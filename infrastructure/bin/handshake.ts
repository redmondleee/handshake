#!/usr/bin/env node

import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AppStack } from '../lib/app-stack';
import { StorageStack } from '../lib/storage-stack'
import { ServiceStack } from '../lib/service-stack';


const app = new App();

new AppStack(app, 'AppStack');

const serviceStack = new ServiceStack(app, 'ServiceStack', {
  memorySize: 1028,
  // Disable provisioned concurrency to prevent unnecessary costs
  // provisionedConcurrency: 5,
});

const storageStack = new StorageStack(app, 'StorageStack', {
  role: serviceStack.lambdaRole,
});

serviceStack.functions.forEach(f => f.addEnvironment('tableName', storageStack.table.tableName));


app.synth();
