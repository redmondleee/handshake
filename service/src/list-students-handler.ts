import { getListStudentsHandler } from 'handshake-server';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ListStudents } from './list-students';
import { getApiGatewayHandler } from './apigateway';

// eslint-disable-next-line import/prefer-default-export
export const handler: APIGatewayProxyHandler = getApiGatewayHandler(getListStudentsHandler(ListStudents));
