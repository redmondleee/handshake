import { v4 as uuid } from 'uuid';
import { Operation } from '@aws-smithy/server-common';
import { ListStudentsServerInput, ListStudentsServerOutput } from 'handshake-server';
import { HandlerContext } from './apigateway';

// eslint-disable-next-line import/prefer-default-export
export const ListStudents: Operation<ListStudentsServerInput, ListStudentsServerOutput, HandlerContext> = async (input, context) => ({
  students: [{
    id: uuid(),
    firstName: 'Red',
    lastName: 'Lee',
    checkInTime: new Date(),
  }],
});
