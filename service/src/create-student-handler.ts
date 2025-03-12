import { getCreateStudentHandler } from 'handshake-server';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { CreateStudent } from './create-student';
import { getApiGatewayHandler } from './apigateway';

// eslint-disable-next-line import/prefer-default-export
export const handler: APIGatewayProxyHandler = getApiGatewayHandler(getCreateStudentHandler(CreateStudent));
