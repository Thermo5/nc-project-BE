# Northcoders Project Phase - JOY API

Back end for our Northcoders Project - Express server calling to SQL database

Deployed here - https://joy-app.herokuapp.com/

### Endpoints

```
GET /rds/users

GET /rds/users/:user_id

GET /rds/questions

GET /rds/questions/:question_id

GET /rds/questions/:quesiton_id/answers

GET /rds/answers/:user_id

GET /rds/answers?answerId=<answer id>

PUT /rds/users
  body: { first_name, surname, answerer, questioner, region, email, user_password, gender, dob, occupation }

PUT /rds/questions
  body: { user_id, topic, keywords }
  // returns the row number which is used as key for question object

PUT /rds/answers
  body: { user_id, question_id }
  // returns the row number which is used as key for answer object

PUT /s3/textstorage
  body: { data, id, type }
  // s3.putObject()

GET /s3/textstorage?keyName=<key of object>
  // s3.getObject()

GET /s3/sign?objectName=<object name>&prefix=<q or a>
  // s3.getSignedUrl() - used to put object in bucket client side
```
