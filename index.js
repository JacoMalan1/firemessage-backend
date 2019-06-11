const express = require('express');
const fs = require('fs');
const User = require('./user.js');
const firebase = require('firebase/app');
require('firebase/firestore');

// Get FireBase creds
const fbCreds = JSON.parse(fs.readFileSync('./creds.json'));

firebase.initializeApp(fbCreds);
const fbDatabase = firebase.database();
const dbRef = fbDatabase.ref('users');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const testUser = {

    uName: 'test',
    uHash: 'FFAAE23331A'

};

dbRef.push(testUser).then(status => console.log('Success!')).catch(err => console.log(err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));