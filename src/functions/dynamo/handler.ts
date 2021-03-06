// import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
// import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Handler } from "aws-lambda";
// import OAuthClient from "intuit-oauth";
// import { oauth } from "@functions/oauth_instance";/
// import schema from "./schema";
const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

const dynamosaving: Handler = async (event, context, callback) => {
  // console.log("############", event);
  const authCode = event.queryStringParameters.code;

  // const path = event.path;

  const realmId = event.queryStringParameters.realmId;

  const state = event.queryStringParameters.state;

  // const redirectUri = `/${path}?code=${authCode}&state=${state}&realmId=${realmId}`;
  const newdata = {
    authCode,
    state,
    realmId,
  };

  await dynamodb
    .put({
      TableName: "TypescriptTable",
      Item: newdata,
    })
    .promise();

  // oauth
  //   .createToken(redirectUri)
  //   .then(function (authResponse) {
  //     console.log("The Token is  " + JSON.stringify(authResponse.getJson()));
  //     // const oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
  //   })
  //   .catch(function (e) {
  //     console.error("The error message is :" + e.originalMessage);
  //     console.error(e.intuit_tid);
  //   });

  const response = {
    statusCode: 301,

    headers: {
      Location: "http://localhost:3000/dev/retrieveToken",
    },
  };

  // console.log(response);

  return callback(null, response);
};

export const main = middyfy(dynamosaving);
