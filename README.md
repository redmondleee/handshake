# TODO

## App
* Create separate admin page
* Make a form with dropdown major and email
* Major is fetched by useEffect, only fetched once

* Admin should be able to infinite scroll


## Service
* Original table just adds rows without querying
  * Email PK, and check_in_time__id SK needed

* Dedupe by email -- query by email first and if exists, just increment count
   * check_in_time should be modified to be the last check_in_time
* 


## Data store
* Need index on email (PK) and user_id (SK)
* Need to add check_in_count field

* Need another table, just e-mail and last-check-in time and count
  * If you click on it, you'll be able to query by just e-mail (PK) and last_check_in_time will be SK


# Nice to have
* SQS queue before DB storage
* Create calls can just store in queue, and we can have a Lambda process it into the DB
* Use React-query to cache all calls
