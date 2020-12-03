'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const middy = require('middy');
const axios = require('axios');
const {jsonBodyParser} = require('middy/middlewares');
const util = require('util/methods');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PEOPLE_TABLE;

const addPeople = async (event) => {
    try {
        const queryParameters = event.queryStringParameters;
        let { data }= await axios.get(`https://swapi.py4e.com/api/people/${queryParameters.id}`);

        let item = {
            id: queryParameters.id,
            nombre: data.name,
            altura: data.height,
            masa: data.mass,
            color_cabello: data.hair_color,
            color_piel: data.skin_color,
            color_ojos: data.eye_color,
            cumpleaños: data.birth_year,
            genero: data.gender,
            mundo_natal: data.homeworld,
            peliculas: data.films,
            especies: data.species,
            vehiculos: data.vehicles,
            naves: data.starships,
            fecha_creacion: data.created,
            fecha_edicion: data.edited,
            url: data.url
        }

        let saveData = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        console.log(saveData);

        return {
            statusCode: 201,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
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

const handler = middy(addPeople)
    .use(jsonBodyParser());

module.exports = {handler};
