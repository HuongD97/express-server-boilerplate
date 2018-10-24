const express = require('express');
const dotenv = require('dotenv').config();
const Knex = require('knex');

const config = {
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
};
// Connect to the database
const knex = Knex({
    client: 'mysql',
    connection: config
});

const PORT = process.env.PORT || 3001;

const app = express();

app.get('/api/restaurants', (req, res) => {
    knex.select('*')
        .from('Restaurant')
        .then((restaurants) => {
            res.json(restaurants);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
});

app.get('/api/parks', (req, res) => {
    knex.select('*')
        .from('Park')
        .then((parks) => {
            res.json(parks);
        })
        .catch((err) => {
            console.log(`ERROR GRABBING PARKS: ${err}`);
        });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
