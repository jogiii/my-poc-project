import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { MyPocStack } from '../lib/my-poc-stack';

describe('MyPocStack', () => {
  let app: cdk.App;
  let stack: MyPocStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new MyPocStack(app, 'TestMyPocStack', {
      stackName: 'test-my-poc-project',
      env: { account: '123456789012', region: 'us-east-1' },
    });
    template = Template.fromStack(stack);
  });

  test('VPC is created with correct subnets', () => {
    template.hasResourceProperties('AWS::EC2::VPC', {
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
    });
  });

  test('ECS Cluster is created', () => {
    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: Match.arrayWith([
        Match.objectLike({ Name: 'containerInsights', Value: 'enabled' }),
      ]),
    });
  });

  test('S3 Artifacts Bucket is created with encryption', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: Match.arrayWith([
          Match.objectLike({
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          }),
        ]),
      },
      VersioningConfiguration: { Status: 'Enabled' },
    });
  });

  test('Stack has expected outputs', () => {
    template.hasOutput('VpcId', {});
    template.hasOutput('ClusterName', {});
    template.hasOutput('ArtifactsBucketName', {});
    template.hasOutput('ServiceUrl', {});
  });
});

