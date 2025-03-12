import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Template } from 'aws-cdk-lib/assertions';
import { AppStack } from '../lib/app-stack';

describe('App stack', () => {
  test('creates S3 bucket', () => {
    const app = new cdk.App();

    const appStack = new AppStack(app, 'AppStack');

    const template = Template.fromStack(appStack);

    template.hasResourceProperties('AWS::S3::Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    template.resourceCountIs('AWS::S3::Bucket', 1);
  });
});
