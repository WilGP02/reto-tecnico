'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const middy = require('middy');
const axios = require('axios');
const {jsonBodyParser} = require('middy/middlewares');
const util = require('util/methods');

const getPeople = async (event) => {
    try {
        const queryParameters = event.queryStringParameters;
        let data = await axios.get(`https://swapi.py4e.com/api/people/${queryParameters.id}`);

        return {
            statusCode: 201,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data.data)
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

const handler = middy(getPeople)
    .use(jsonBodyParser());

module.exports = {handler};
