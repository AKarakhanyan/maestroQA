import { CloudWatchClient, GetDashboardCommand, PutDashboardCommand } from "@aws-sdk/client-cloudwatch";

exports.handler = function(event, context, callback) {

    //Retrieve info from sns message and create annotation object
    let message = event.Records[0].Sns.Message;
    let [headCommit, deployFinishTime] = [message.headCommit, message.deployFinishTime];
    let newSchemas = message.hasOwnProperty("newSchemas") ? message.newSchemas: undefined;
    let annotation = {
        "annotations": {
            "vertical": [
                {
                    "label": `${headCommit} deployed to production`,
                    "value": `${deployFinishTime}`,
                    "color": "#67bd92",
                    "visible": true
                },
            ]
        }
    };
    if (newSchemas){
        let newSchemaVertical = {
            "label": `New Schema(s): ${newSchemas} in ${headCommit} deployed to production`,
            "value": `${deployFinishTime}`,
            "color": "#bd9367",
            "visible": true
        }
        annotation.annotations.vertical.push(newSchemaVertical);
    }

    //Retrieve dashboard
    let dashboardEnv = process.env.DASHBOARD_NAME;
    let widgetEnv = process.env.WIDGET_NAME; //metric widget we want to annotate 
    const client = new CloudWatchClient(config);
    const getDashCommand = new GetDashboardCommand(dashboardEnv);
    let dashboard;
    try{
        dashboard = await client.send(getDashCommand); //widget we care about is now in DashboardBody=>widgets[] - need to find the right one using title of widget
    } catch (error){
        console.error(error);
    }
    console.log(dashboard);

    //Find and Modify Widget we want annotations added to
    const widget = dashboard.DashboardBody.widgets.find(w => w.properties.title === `${widgetEnv}`); //this will find the widget in array where properties.title == title of widget we want
    if (!widget){throw `Widget with title ${widgetEnv} not found`}
    widget.properties.annotations = annotation.annotations;
    
    //Put updated dashboard (will replace old)
    const putDashCommand = new PutDashboardCommand(dashboard, dashboardEnv);
    let putDashResponse;
    try{
        putDashResponse = await client.send(putDashCommand);
    } catch (error){
        console.error(error);
    }
     
};