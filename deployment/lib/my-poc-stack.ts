import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { SpringBootService } from './constructs/spring-boot-service';

export interface MyPocStackProps extends cdk.StackProps {
  stackName?: string;
  description?: string;
}

export class MyPocStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;
  public readonly artifactsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: MyPocStackProps) {
    super(scope, id, props);

    // ── VPC ──────────────────────────────────────────────────────────────────
    this.vpc = new ec2.Vpc(this, 'MyPocVpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });

    // ── ECS Cluster ──────────────────────────────────────────────────────────
    this.cluster = new ecs.Cluster(this, 'MyPocCluster', {
      vpc: this.vpc,
      clusterName: `${props?.stackName}-cluster`,
      containerInsights: true,
    });

    // ── S3 Artifacts Bucket ──────────────────────────────────────────────────
    this.artifactsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
      bucketName: `my-poc-artifacts-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsPrefix: 'access-logs/',
    });

    // ── Spring Boot Fargate Service ──────────────────────────────────────────
    const springBootService = new SpringBootService(this, 'SpringBootService', {
      cluster: this.cluster,
      vpc: this.vpc,
      serviceName: 'my-poc-spring-boot',
      containerPort: 8080,
      desiredCount: 1,
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    // ── Outputs ──────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      description: 'VPC ID',
      exportName: `${id}-VpcId`,
    });

    new cdk.CfnOutput(this, 'ClusterName', {
      value: this.cluster.clusterName,
      description: 'ECS Cluster Name',
      exportName: `${id}-ClusterName`,
    });

    new cdk.CfnOutput(this, 'ArtifactsBucketName', {
      value: this.artifactsBucket.bucketName,
      description: 'Artifacts S3 Bucket Name',
      exportName: `${id}-ArtifactsBucketName`,
    });

    new cdk.CfnOutput(this, 'ServiceUrl', {
      value: `http://${springBootService.loadBalancerDnsName}`,
      description: 'Spring Boot Service Load Balancer URL',
      exportName: `${id}-ServiceUrl`,
    });
  }
}

