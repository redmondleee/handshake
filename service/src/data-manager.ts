import { v4 as uuid } from 'uuid';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import {
  marshall as defaultMarshall,
  unmarshall,
} from '@aws-sdk/util-dynamodb';

import { Student } from 'handshake-server';

const marshall = (value: any) => defaultMarshall(value, {
  convertClassInstanceToMap: true,
  removeUndefinedValues: true,
});

export const convertTableItemToStudent = (item: any): Student => ({
  id: item.id,
  firstName: item.first_name,
  lastName: item.last_name,
  checkInTime: new Date(item.check_in_time),
});

export class DataManager {
  readonly client: DynamoDBClient;

  readonly tableName: string;

  constructor(client: DynamoDBClient, tableName?: string) {
    this.client = client;

    if (!tableName) {
      throw Error('tableName is empty');
    }
    this.tableName = tableName;
  }

  async createStudent(
    student: Student,
  ): Promise<Student> {
    const id = uuid();
    const checkInTime = new Date();

    await this.client.send(new PutItemCommand({
      TableName: this.tableName,
      Item: marshall({
        id,
        first_name: student.firstName,
        last_name: student.lastName,
        check_in_time: checkInTime,
      }),
    }));

    return {
      ...student,
      id,
      checkInTime,
    };
  }

  async listStudents(
    maxResults: number,
    nextToken?: string,
  ): Promise<{ students: Student[], nextToken?: string }> {
    const result = await this.client.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'check_in_time__last_name',
      KeyConditionExpression: 'check_in_time > :check_in_time',
      ExpressionAttributeValues: marshall({
        ':check_in_time': 0,
      }),
      ScanIndexForward: false,
      ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
      Limit: maxResults,
    }));

    return {
      students: result.Items!.map((i) => convertTableItemToStudent(unmarshall(i))),
      nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
    };
  }
}
