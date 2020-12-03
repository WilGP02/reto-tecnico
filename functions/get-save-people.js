'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const middy = require('middy');
const {jsonBodyParser} = require('middy/middlewares');
const util = require('util/methods');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PEOPLE_TABLE;

const getSavePeople = async (event) => {
    try {
        const queryParameters = event.queryStringParameters;
        let params = {
            TableName: tableName,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": queryParameters.id
            },
            Limit: 5,
            ScanIndexForward: false
        };

        let data = await dynamodb.query(params).promise();
        console.log(data);

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
        };
    }catch (error) {

        return{
            statusCode: error.statusCode ? error.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: error.name ? error.name : "Exception",
                message: error.message ? error.message : "Unknown error"
            })
        }
    }
};

const handler = middy(getSavePeople)
    .use(jsonBodyParser());

module.exports = {handler};
