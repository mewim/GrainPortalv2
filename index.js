// Example express application adding the parse-server module to expose Parse
// compatible API routes.

// hello!

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('parse/node');

// Add ParseDashboard
var ParseDashboard = require('parse-dashboard');
var allowInsecureHTTP = true

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
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

// Parse Server plays nicely with the rest of your web routes
app.get('/twilio', function(req, res) {
	Parse.initialize(process.env.APP_ID);
	Parse.serverURL = process.env.SERVER_URL;
	
	var from = req.param('From');
	var message_sid = req.param('MessageSid');
	var body1 = req.param('Body');

	var res = body1.split('*');
	if (res.length == 5 && res[0] == 'sensor') {
		var TestObject = Parse.Object.extend("SensorReport");
		var testObject = new TestObject();

		testObject.save({messageSid: message_sid, from: from, major: res[1], minor: res[2], temperature: res[3], humidity: res[4]}).then(function(object) {
  		res.send("saved");
	});

	} else if (res.length == 7 && res[0] == 'report'){
		var TestObject = Parse.Object.extend("FarmerReport");
		var testObject = new TestObject();

		testObject.save({messageSid: message_sid, from: from, type: res[1], available: res[2], price: res[3], quantity: res[4], major: res[5], minor: res[6]}).then(function(object) {
  			res.send("saved");
		});	
	} else {		
		var TestObject = Parse.Object.extend("Message");
		var testObject = new TestObject();
		testObject.save({messageSid: message_sid, from: from, body: body1}).then(function(object) {
  			res.send("saved");
		});	
	}
	

});

app.use('/dashboard', dashboard);

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
