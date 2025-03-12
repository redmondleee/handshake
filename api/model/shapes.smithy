$version: "1.0"

namespace com.handshake

list StudentList {
  member: Student,
}

structure Student {
  id: StudentId,

  firstName: Name,

  lastName: Name,

  @timestampFormat("date-time")
  checkInTime: Timestamp,
}

@length(min: 36, max: 36)
@pattern("^[\\w-]+$")
string StudentId

@length(min: 1, max: 50)
string Name

@length(min: 36, max: 36)
@pattern("^[\\w-]+$")
string ClientToken

@length(min: 1, max: 8192)
@pattern("^[\\w./+-]+$")
string NextToken

@box
@range(min: 1, max: 100)
integer MaxResults
