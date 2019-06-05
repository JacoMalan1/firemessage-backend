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
        return;

    } else {

        const user = new User(params.uname, sqlCreds);
        user.getProps()
            .then(() => {
                if (user.hash === user.computeHash(params.pword)) {
                    res.json({ status: "success", token: "access" }).end();
                } else {
                    res.json({ status: "error", error: "Passwords didn't match." });
                }
            })        
            .catch(() => {
                res.json({ status: "error", error: "Unknown error." }).end();
                return;
            });

    }

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));