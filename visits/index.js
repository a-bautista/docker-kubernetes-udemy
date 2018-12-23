const express = require('express');
const reds = require('redis');

const app = express();
const client = redis.createClient();

client.set('visits', 0);

app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
       res.send('Number of visits is ' + visits);
       client.set('visits', parseInt(visits) + 1);
    });
});



app.listen(8081, () => {
	console.log('Listening on port 8081');
});
