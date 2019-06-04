const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const User = require('./user.js');

// Load the AuthDB credentials from a JSON file.
const sqlCreds = JSON.parse(fs.readFileSync('creds.json'));

// Add the required SSL certificates.
sqlCreds.ssl = {
    ca: fs.readFileSync('server-ca.pem'),
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem')
};

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

const user = new User("'jaco", sqlCreds);
user.hash = 'jacotest';

user.save()
    .then(() => console.log("Success"))
    .catch(err => console.error(err));