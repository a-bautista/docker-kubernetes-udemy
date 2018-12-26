const keys = require('./keys');

//Express App setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(error => console.log(err));


// Redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
	res.send('Hi');
});


//Retrieve all values from the postgres database
app.get('/values/all', async(req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

// Reach the values from Redis
app.get('/values/current', async(req, res) => {
	// get the hash values from Redis
	redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});


//Calculate the values in Redis
app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values', index, 'Nothing yet');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)',[index]);
    res.send({working: true});
});

//Redis port
app.listen(5000, err => {
    console.log('Listening');
});

