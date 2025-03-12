import { Operation } from '@aws-smithy/server-common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ListStudentsServerInput, ListStudentsServerOutput } from 'handshake-server';
import { HandlerContext } from './apigateway';
import { DataManager } from './data-manager';

export const DEFAULT_MAX_RESULTS = 25;

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const dataManager = new DataManager(dynamoDbClient, process.env.tableName);

// eslint-disable-next-line arrow-body-style
export const ListStudents: Operation<ListStudentsServerInput, ListStudentsServerOutput, HandlerContext> = async (input, context) => {
  return dataManager.listStudents(DEFAULT_MAX_RESULTS);
};
