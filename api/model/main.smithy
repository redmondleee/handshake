$version: "1.0"

namespace com.handshake

use smithy.framework#ValidationException

@cors(
  maxAge: -1,
  additionalAllowedHeaders: ["content-type", "x-amz-user-agent"],
)

@aws.apigateway#requestValidator("full")

@aws.api#service(sdkId: "Handshake")
@aws.protocols#restJson1
@title("Handshake")
@paginated(inputToken: "nextToken", outputToken: "nextToken", pageSize: "maxResults")
service Handshake {
  version: "2021-04-12",
  resources: [StudentResource],
}

resource StudentResource {
    identifiers: { studentId: StudentId },
    create: CreateStudent,
    list: ListStudents,
}

@aws.apigateway#integration(
  type: "aws_proxy",
  httpMethod: "POST",
  uri: "arn:${AWS::Partition}:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${CreateStudentHandler.Arn}:live/invocations",
  credentials: "${ApiGatewayExecutionRole.Arn}",
)
@idempotent
@http(code: 200, method: "POST", uri: "/students")
operation CreateStudent {
  input: CreateStudentRequest,
  output: CreateStudentResponse,
  errors: [
    ConflictException,
    AccessDeniedException,
    ValidationException,
    ThrottlingException,
    InternalServerException,
  ],
}

structure CreateStudentRequest {
  @required
  student: Student,

  @idempotencyToken
  @required
  clientToken: ClientToken,
}

structure CreateStudentResponse {
  student: Student,
}


@aws.apigateway#integration(
  type: "aws_proxy",
  httpMethod: "POST",
  uri: "arn:${AWS::Partition}:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${ListStudentsHandler.Arn}:live/invocations",
  credentials: "${ApiGatewayExecutionRole.Arn}",
)
@readonly
@paginated(items: "students")
@http(code: 200, method: "GET", uri: "/students")
operation ListStudents {
  input: ListStudentsRequest,
  output: ListStudentsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
    ThrottlingException,
    InternalServerException,
  ],
}

structure ListStudentsRequest {
  @httpQuery("nextToken")
  nextToken: NextToken,

  @httpQuery("maxResults")
  maxResults: MaxResults,
}

structure ListStudentsResponse {
  nextToken: NextToken,
  students: StudentList,
}
