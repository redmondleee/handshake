import { v4 as uuid } from 'uuid';
import { Operation } from '@aws-smithy/server-common';
import { CreateStudentServerInput, CreateStudentServerOutput } from 'handshake-server';
import { HandlerContext } from './apigateway';

// eslint-disable-next-line import/prefer-default-export
export const CreateStudent: Operation<CreateStudentServerInput, CreateStudentServerOutput, HandlerContext> = async (input, context) => ({
  student: {
    id: uuid(),
    firstName: 'Red',
    lastName: 'Lee',
    checkInTime: new Date(),
  },
});
