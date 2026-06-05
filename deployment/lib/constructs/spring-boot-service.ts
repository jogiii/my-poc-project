import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface SpringBootServiceProps {
  /** ECS Cluster to deploy into */
  cluster: ecs.Cluster;
  /** VPC for networking */
  vpc: ec2.Vpc;
  /** ECS service name */
  serviceName: string;
  /** Container port (Spring Boot default: 8080) */
  containerPort: number;
  /** Number of desired tasks */
  desiredCount?: number;
  /** Fargate vCPU units (256 = 0.25 vCPU) */
  cpu?: number;
  /** Memory in MiB */
  memoryLimitMiB?: number;
  /** Docker image URI */
  dockerImageUri?: string;
}

export class SpringBootService extends Construct {
  public readonly service: ecs_patterns.ApplicationLoadBalancedFargateService;
  public readonly loadBalancerDnsName: string;

  constructor(scope: Construct, id: string, props: SpringBootServiceProps) {
    super(scope, id);

    const {
      cluster,
      vpc,
      serviceName,
      containerPort,
      desiredCount = 1,
      cpu = 512,
      memoryLimitMiB = 1024,
      dockerImageUri = 'openjdk:21-jdk-slim',
    } = props;

    // ── CloudWatch Log Group ─────────────────────────────────────────────────
    const logGroup = new logs.LogGroup(this, 'ServiceLogGroup', {
      logGroupName: `/ecs/${serviceName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ── Task Execution Role ──────────────────────────────────────────────────
    const executionRole = new iam.Role(this, 'ExecutionRole', {
      roleName: `${serviceName}-execution-role`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy'
        ),
      ],
    });

    // ── Task Role ────────────────────────────────────────────────────────────
    const taskRole = new iam.Role(this, 'TaskRole', {
      roleName: `${serviceName}-task-role`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    // ── ALB Fargate Service ──────────────────────────────────────────────────
    this.service = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'FargateService',
      {
        cluster,
        serviceName,
        desiredCount,
        cpu,
        memoryLimitMiB,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(dockerImageUri),
          containerPort,
          executionRole,
          taskRole,
          logDriver: ecs.LogDrivers.awsLogs({
            logGroup,
            streamPrefix: serviceName,
          }),
          environment: {
            SPRING_PROFILES_ACTIVE: 'prod',
            SERVER_PORT: containerPort.toString(),
            JAVA_OPTS: '-Xmx768m -Xms256m -XX:+UseG1GC',
          },
        },
        publicLoadBalancer: true,
        assignPublicIp: false,
      }
    );

    // ── Health Check ─────────────────────────────────────────────────────────
    this.service.targetGroup.configureHealthCheck({
      path: '/actuator/health',
      healthyHttpCodes: '200',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(10),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 5,
    });

    // ── Auto Scaling ─────────────────────────────────────────────────────────
    const scalingTarget = this.service.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 5,
    });

    scalingTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(120),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    scalingTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(120),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    this.loadBalancerDnsName = this.service.loadBalancer.loadBalancerDnsName;
  }
}

