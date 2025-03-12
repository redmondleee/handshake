import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AppStack extends Stack {
  readonly appBucket: s3.Bucket;

  readonly originAccessIdentity: cloudfront.OriginAccessIdentity;

  readonly distribution: cloudfront.CloudFrontWebDistribution;

  /**
   * Creates all resources for this stack.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.appBucket = new s3.Bucket(this, 'AppBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    this.originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');
    this.appBucket.grantRead(this.originAccessIdentity);

    this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: this.appBucket,
          originAccessIdentity: this.originAccessIdentity,
        },
        behaviors: [{ isDefaultBehavior: true }],
      }],
      errorConfigurations: [
        {
          errorCode: 403,
          responsePagePath: '/error.html',
          // Forbidden objects in S3 are treated as if they don't exist
          responseCode: 404,
        },
        {
          errorCode: 404,
          responsePagePath: '/error.html',
          responseCode: 404,
        },
      ],
    });
  }
}
