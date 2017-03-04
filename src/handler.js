'use strict';

import 'babel-polyfill'
var rp = require('request-promise');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({'region':'ap-northeast-1'});

module.exports.update = async(event, context, callback) => {

  const postToCircleCI = async() => {
    return await rp({
      method: 'POST',
      uri: 'https://circleci.com/api/v1.1/project/github/kongou-ae/i.anison.me/tree/master?circle-token=ab1cbd3291b34929a5ff98e016769b1754b65357'
    })
  }

  await postToCircleCI()
  context.succeed()
}

module.exports.get = async(event, context, callback) => {

  let resp = ''
  try {
    resp = await dynamoDb.scan({TableName : 'anison.me'}).promise();
  } catch(err){
    callback(JSON.stringify(err))
  }
  
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Credentials" : true
    },
    body: JSON.stringify(resp.Items)
  };

  callback(null,response)
}