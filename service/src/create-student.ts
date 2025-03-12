import { Operation } from '@aws-smithy/server-common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CreateStudentServerInput, CreateStudentServerOutput } from 'handshake-server';
import { HandlerContext } from './apigateway';
import { DataManager } from './data-manager';

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const dataManager = new DataManager(dynamoDbClient, process.env.tableName);

// eslint-disable-next-line import/prefer-default-export, arrow-body-style
export const CreateStudent: Operation<CreateStudentServerInput, CreateStudentServerOutput, HandlerContext> = async (input, context) => {
  return { student: await dataManager.createStudent(input.student!) };
};
