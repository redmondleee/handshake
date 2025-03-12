$version: "1.0"

namespace com.handshake

@length(min: 1, max: 2048)
string Message

@error("client")
@httpError(403)
structure AccessDeniedException {
  message: Message,
}

@error("client")
@httpError(404)
structure ResourceNotFoundException {
  message: Message,
}

@error("client")
@httpError(409)
structure ConflictException {
  message: Message,
}

@retryable(throttling: true)
@error("client")
@httpError(429)
structure ThrottlingException {
  message: Message,
}

@retryable
@error("server")
@httpError(500)
structure InternalServerException {
  message: Message,
}
