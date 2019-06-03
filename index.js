const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const User = require('./user.js');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/login', (req, res) => {

    res.format({
        'application/json': () => res.send(req.body).status(200)
    }).end();

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const user = new User("'jaco");
user.hash = 'jacotest';

user.save()
    .then(() => console.log("Success"))
    .catch(err => console.error(err));