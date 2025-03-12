
import { Operation } from "@aws-smithy/server-common";
import { CreateStudentInput, CreateStudentOutput } from "handshake-server";
import { HandlerContext } from "./apigateway";

// This is the implementation of business logic of the EchoOperation
export const EchoOperation: Operation<CreateStudentInput, CreateStudentOutput, HandlerContext> = async (input, context) => {
  return {
    string: input.string,
  };
};
