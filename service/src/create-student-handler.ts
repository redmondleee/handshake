import { getCreateStudentHandler, getListStudentsHandler } from "handshake-server";
import { CreateStudent } from "create-student";
import { APIGatewayProxyHandler } from "aws-lambda";
import { getApiGatewayHandler } from "./apigateway";

// This is the entry point for the Lambda Function that services the EchoOperation
export const lambdaHandler: APIGatewayProxyHandler = getApiGatewayHandler(getCreateStudentHandler(CreateStudent));