#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyPocStack } from '../lib/my-poc-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

// Development Stack
new MyPocStack(app, 'MyPocStack-Dev', {
  env,
  stackName: 'my-poc-project-dev',
  description: 'My POC Project - Development Environment (Spring Boot 3.5 / Java 21)',
  tags: {
    Environment: 'dev',
    Project: 'my-poc-project',
    ManagedBy: 'aws-cdk',
    Owner: 'platform-team',
  },
});

// Production Stack
new MyPocStack(app, 'MyPocStack-Prod', {
  env,
  stackName: 'my-poc-project-prod',
  description: 'My POC Project - Production Environment (Spring Boot 3.5 / Java 21)',
  tags: {
    Environment: 'prod',
    Project: 'my-poc-project',
    ManagedBy: 'aws-cdk',
    Owner: 'platform-team',
  },
});

app.synth();

