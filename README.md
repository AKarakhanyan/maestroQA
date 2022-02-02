# maestroQA
publish_sns.sh generates the message json and sends it to a SNS topic

update_dashboard.js includes a lambda handler. Assumed said lambda is subscribed to SNS topic we published to prior. 
Lambda will ingest SNS message, generate annotation, get dashboard we want to update, add annotation to specific widget we want and then update dashboard with new data.


--------------

Sample message sent to SNS using dummy data:

`{"default":"default message", "headCommit":"293f43e5dc08adc761bc5fcacc3a971043d1892b","newSchemas":".nvmrc&README.md&deploy.Jenkinsfile", "deployFinishTime":"2022-02-02T17:59:39.000Z"}`

Sample annotation lambda creates using dummy data:

```
{
    "annotations": {
        "vertical": [
            {
                "label": "293f43e5dc08adc761bc5fcacc3a971043d1892b",
                "value": "2022-02-02T17:10:04.000Z",
                "color": "#67bd92",
                "visible": true
            },
            {
                "label": "New Schema(s): .nvmrc&README.md&deploy.Jenkinsfile in 293f43e5dc08adc761bc5fcacc3a971043d1892b",
                "value": "2022-02-02T17:10:04.000Z",
                "color": "#bd9367",
                "visible": true
            }
        ]
    }
}
```

Sample updated dashboard lambda using dummy data:

```
{
    "DashboardName": "Two-metric-widget Dashboard",
    "DashboardBody": {
        "widgets": [
            {
                "type": "metric",
                "x": 0,
                "y": 0,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        [
                            "AWS/EC2",
                            "CPUUtilization",
                            "InstanceId",
                            "i-012345"
                        ]
                    ],
                    "period": 300,
                    "stat": "Average",
                    "region": "us-east-1",
                    "title": "EC2 Instance CPU"
                }
            },
            {
                "type": "metric",
                "x": 12,
                "y": 0,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        [
                            "AWS/S3",
                            "BucketSizeBytes",
                            "BucketName",
                            "MyBucketName"
                        ]
                    ],
                    "period": 86400,
                    "stat": "Maximum",
                    "region": "us-east-1",
                    "title": "MyBucketName bytes",
                    "annotations": {
                        "vertical": [
                            {
                                "label": "293f43e5dc08adc761bc5fcacc3a971043d1892b deployed to production",
                                "value": "2022-02-02T17:10:04.000Z",
                                "color": "#67bd92",
                                "visible": true
                            },
                            {
                                "label": "New Schema(s): .nvmrc&README.md&deploy.Jenkinsfile in 293f43e5dc08adc761bc5fcacc3a971043d1892b deployed to production",
                                "value": "2022-02-02T17:10:04.000Z",
                                "color": "#bd9367",
                                "visible": true
                            }
                        ]
                    }
                }
            }
        ]
    }
}
```

Where in CircleCI would we put the publish script?

I'm goint to assume you're using a CircleCI workflow that looks something like this:
```
workflows:
  version: 2
  build-test-and-deploy:
    jobs:
      - build
      - test1:
          requires:
            - build
      - test2:
          requires:
            - test1
      - deploy:
          requires:
            - test2
```

I would add the publish job at the end, requiring deploy job.
```
workflows:
  version: 2
  build-test-and-deploy:
    jobs:
      - build
      - test1:
          requires:
            - build
      - test2:
          requires:
            - test1
      - deploy:
          requires:
            - test2
      - publish:
          requires:
            - deploy

```

The definition for the deploy job would look something like this:

```
version: 2.1

jobs:
  deploy:
    steps:
      - run: /scripts/publish.sh
```
Environment variables for that script could be set within a Context or Project settings.
Environment variables for the lambda can be set in a terraform config 

Flow Diagram
[]