import * as fs from 'fs';
import * as path from 'path';

import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { NodejsFunction, LogLevel } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  App,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

export interface ServiceStackProps extends StackProps {
  readonly memorySize: number;
  readonly provisionedConcurrency?: number;
}

export class ServiceStack extends Stack {
  readonly restApi: apigateway.SpecRestApi;

  readonly restApiExecutionRole: iam.Role;

  constructor(app: App, id: string, props: ServiceStackProps) {
    super(app, id, props);

    this.restApiExecutionRole = new iam.Role(this, 'restApiExecutionRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    const operations = {
      CreateStudent: 'create-student-handler',
      ListStudents: 'list-students-handler',
    };

    Object.keys(operations).forEach(operation => {
      const requestHandler = new NodejsFunction(this, `${operation}Handler`, {
        // @ts-expect-error TS7053
        entry: path.resolve(__dirname, `../../service/src/${operations[operation]}.ts`),
        bundling: {
          sourceMap: true,
          logLevel: LogLevel.INFO,
          nodeModules: ['re2-wasm'],
        },
        memorySize: props.memorySize,
        timeout: Duration.seconds(28),
        tracing: lambda.Tracing.ACTIVE,
        currentVersionOptions: {
          provisionedConcurrentExecutions: props.provisionedConcurrency,
        },
      });
      requestHandler.role!.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'),
      );
      requestHandler.addLayers(lambda.LayerVersion.fromLayerVersionArn(
        requestHandler,
        'LambdaInsightsLayer',
        'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:14',
      ));

      // API model used for API Gateway requires fixed logical IDs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (requestHandler.node.defaultChild as any).overrideLogicalId(`${operation}Handler`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.restApiExecutionRole.node.defaultChild as any).overrideLogicalId('ApiGatewayExecutionRole');

      const alias = requestHandler.currentVersion.addAlias('live');
      alias.grantInvoke(this.restApiExecutionRole);
      const autoScaling = alias.addAutoScaling({ maxCapacity: 50 });
      autoScaling.scaleOnUtilization({ utilizationTarget: 0.5 });
    });

    const apiDefinition = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../../api/build/smithy/source/openapi/Handshake.openapi.json'),
      'utf8',
    ));
    this.restApi = new apigateway.SpecRestApi(this, 'RestApi', {
      apiDefinition: apigateway.ApiDefinition.fromInline(apiDefinition),
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
        throttlingBurstLimit: 100,
        throttlingRateLimit: 100,
        accessLogDestination: new apigateway.LogGroupLogDestination(new logs.LogGroup(this, 'RestApiAccessLogs')),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
      },
    });
  }
}
