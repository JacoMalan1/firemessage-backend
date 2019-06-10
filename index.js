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

    const params = req.body;

    if (!params.uname || !params.pword) {

        res.json({ status: "error", error: "Invalid username or password." }).end();

    } else {

        const user = new User(params.uname, sqlCreds);
        user.getProps();

        user.authenticate(params)
            .then(result => {

                if (result.logged === false && result.status === 'error') {
                    res.json({ status: 'error', error: result.error });
                } else {
                    res.json({ status: 'success', token: result.token });
                }

            });

    }

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));