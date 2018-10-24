const express = require('express');
const dotenv = require('dotenv').config();
const Knex = require('knex');
const each = require('async/each');

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
            console.error(err);
        });
});

app.get('/api/parks', (req, res) => {
    knex.select('*')
        .from('Park')
        .then((parks) => {
            res.json(parks);
        })
        .catch((err) => {
            console.error(err);
        });
});

function getParkID(parkName) {
    return knex.select('parkID')
        .from('Park')
        .where('parkName', '=', parkName)
        .then((result) => {
            const queryResult = JSON.parse(JSON.stringify(result));
            if (queryResult.length > 1) {
                throw new Error(`There are more than one parkIDs mapped to ${parkName}`);
            }

            return queryResult[0];
        })
        .catch((err) => {
            console.error(err);
        });
}

function getLandIDs(parkID) {
    return knex.select('landID')
        .from('Land')
        .where('parkID', '=', parkID)
        .then((result) => {
            return JSON.parse(JSON.stringify(result));
        })
        .catch((err) => {
            console.error(err);
        });
}

function getAllRestaurants(landID) {
    return knex.select('*')
        .from('Restaurant')
        .where('landID', '=', landID)
        .then((result) => {
            return JSON.parse(JSON.stringify(result));
        })
        .catch((err) => {
            console.error(err);
        });
}

app.get('/api/magicKingdomRestaurants', (req, res) => {
    const { parkName } = req.query;
    let allRestaurants = [];

    getParkID(parkName)
        .then((result) => result.parkID)
        .then((parkID) => getLandIDs(parkID))
        .then((lands) => {
            each(lands, (land, next) => {
                getAllRestaurants(land.landID).then((restaurants) => {
                    allRestaurants = allRestaurants.concat(restaurants);
                    next();
                }).catch((err) => next(err));
            }, (err) => {
                if (err) throw new Error(err);
                console.log(`allRestaurants ${allRestaurants}`);
                res.send({allRestaurants: allRestaurants});
            })
        })
        .catch((err) => {
            console.error(err);
        });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
