/*
 * Main configuration file for Express
 * Forked from: https://github.com/ParsePlatform/parse-server-example
 */

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

// Add ParseDashboard
var ParseDashboard = require('parse-dashboard');
var allowInsecureHTTP = true;
var Parse = require('parse/node');
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
    restAPIKey: process.env.REST_KEY || '',
    javascriptKey: process.env.JAVASCRIPT_KEY || '',
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    }
});

// Parse Dashboard
var dashboard = new ParseDashboard({
    apps: [
        {
            serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
            appId: process.env.APP_ID || 'myAppId',
            masterKey: process.env.MASTER_KEY || '',
            javascriptKey: process.env.JAVASCRIPT_KEY || '',
            restKey: process.env.REST_KEY || '',
            appName: process.env.APP_NAME || 'myAppName',
            production: true
        }
    ],
    users: [
        {
            user: 'admin',
            pass: 'password'
        }
    ]
}, true);

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use(express.static('public'));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Serve Parse Dashboard on the /dashboard
app.use('/dashboard', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.use('/twilio', require('./twilio'));

app.use('/userapi', require('./userapi'));

app.use('/send_message', require('./send_message'));

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
    console.log('GrainPortalv2 running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
// Initialize Parse backend connection here
Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;
console.log('Parse backend connection initialized.');

