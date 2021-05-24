var express = require('express');
var morgan = require('morgan');
var path = require('path');
var querystring = require('querystring');
var request = require('request');
var fs = require("fs");
var https = require('https');
var getDataForDatabase = require('./SQL/getDataForDatabase.js');

//initialize express.
var app = express();

// Initialize variables.
var port = 443; // process.env.PORT || 3000;

// Configure morgan module to log all requests.
app.use(morgan('dev'));

// Set the front-end folder to serve public assets.
app.use(express.static('./'));

// Set up a route for index.html.
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//Pekar på certifikatet och nyckeln, för att säkra sidan. 
var options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem'),
    passphrase: '---'
};

//Hämtar vårat Auth-token från MS, så att vi kan autentisera oss mot ProptechOS.
app.get('/login', function (req, res) {
    var postData = {
        "client_id": "---",
        "client_secret": "---",
        "scope": "https://vk.proptechos.com/api/.default",
        "grant_type": "client_credentials"
    };

    var post_data = querystring.stringify(postData);

    request({
        url: "https://login.microsoftonline.com/d4218456-670f-42ad-9f6a-885ae15b6645/oauth2/v2.0/token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: post_data
    }, function (error, response, body) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(body, 'utf-8');
    });
});

//Kör signIn()-funktionen som ligger i "getDataForDatabase.js"-filen
//denna fil gör egentligen allt, den loggar in och skickar in data i SQL-databasen.
getDataForDatabase.signIn();

// Start the server.
https.createServer(options, app).listen(443);

//Skriver en liten trevlig grej så det känns som att något mer händer :)
console.log('server listening on https://vasakronanone2one.me, on port: ' + port + ' at time: ' + Date.now());