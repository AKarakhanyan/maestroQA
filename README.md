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
            }
        ]
    }
}
```


