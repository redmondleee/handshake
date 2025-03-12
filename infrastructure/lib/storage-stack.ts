import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';

import {
  App,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

export interface StorageStackProps extends StackProps {
  readonly role?: iam.IRole;
}

export class StorageStack extends Stack {
  readonly table: dynamodb.Table;

  readonly bucket: s3.Bucket;

  constructor(app: App, id: string, props: StorageStackProps) {
    super(app, id, props);

    if (!props.role) {
      throw Error('No role is granted access to storage');
    }

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'check_in_time', type: dynamodb.AttributeType.NUMBER },
      timeToLiveAttribute: 'expiration_time',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
    });
    this.table.grantReadWriteData(props.role);
    this.table.addGlobalSecondaryIndex({
      indexName: 'check_in_time__last_name',
      partitionKey: { name: 'check_in_time', type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: 'last_name', type: dynamodb.AttributeType.STRING },
    });
  }
}
