#!/usr/bin/env node

import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AppStack } from '../lib/app-stack';
import { ServiceStack } from '../lib/service-stack';


const app = new App();

new AppStack(app, 'AppStack', {});

new ServiceStack(app, 'ServiceStack', {
  memorySize: 1028,
  // Disable provisioned concurrency to prevent unnecessary costs
  // provisionedConcurrency: 5,
});

app.synth();
