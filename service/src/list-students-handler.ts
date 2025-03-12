import { getListStudentsHandler } from "handshake-server";
import { ListStudent } from "list-student";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getApiGatewayHandler } from "./apigateway";

// This is the entry point for the Lambda Function that services the EchoOperation
export const lambdaHandler: APIGatewayProxyHandler = getApiGatewayHandler(getListStudentHandler(ListStudent));