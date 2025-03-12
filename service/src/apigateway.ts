import { convertEvent, convertVersion1Response } from '@aws-smithy/server-apigateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ServiceHandler } from '@aws-smithy/server-common';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

export interface HandlerContext {
  sourceIp: string;
}

export function getApiGatewayHandler(handler: ServiceHandler<HandlerContext>): APIGatewayProxyHandler {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { sourceIp } = event.requestContext.identity;
    const context = { sourceIp };

    const httpRequest = convertEvent(event);
    const httpResponse = await handler.handle(httpRequest, context);

    httpResponse.headers = {
      ...httpResponse.headers,
      'Access-Control-Allow-Headers': '*',
      // TODO: Restrict to the current domain
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    };

    return convertVersion1Response(httpResponse);
  };
}
