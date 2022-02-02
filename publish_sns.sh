#!/bin/bash

deployFinishTime=$(date -u '+%Y-%m-%dT%H:%M:%S.000Z') #use current time as the time successful deployment finished
headCommit=$(git rev-parse HEAD)
newSchemas=$(git diff HEAD^1 HEAD --name-only | grep "$SCHEMA_DIR" | tr "\n" "&") #using tr to transform new lines into & so all new schema files can be a single string separated by &
if [ -z "$newSchemas" ]; then #no new Schema. -z can check if var is set or not.
    message='{"default":"default message","headCommit":"'$headCommit'", "deployFinishTime":"'$deployFinishTime'"}'
else #new schema found
    newSchemas=${newSchemas::-1} #remove trailing &
    message='{"default":"default message", "headCommit":"'$headCommit'","newSchemas":"'$newSchemas'", "deployFinishTime":"'$deployFinishTime'"}'
fi
echo $message
aws sns publish \ #assuming appropriate aws cli env vars are set for authentication
    --topic-arn "$TOPIC_ARN" \ #assuming topic arn set as an env var
    --message "$message"
    --message-structure json