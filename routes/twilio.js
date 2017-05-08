/*
 * Handling incoming messages from twilio
 */
var express = require('express'),
    router = express.Router();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
var Twilio = require('twilio');

var User = require('../modules/user');
var Sensor = require('../modules/sensor');
var FarmerReport = require('../modules/farmer_report');
var SensorReport = require('../modules/sensor_report');
var Sender = require('../modules/send_text');

function reply(message, res) {
    var twiml = new Twilio.TwimlResponse();
    twiml.message(message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}

function text_handler(text, from, res) {
    var text_arr = text.split('*');
    var operator = text_arr[0];
    switch (operator) {
        case "REG":
            REG(text_arr, from, res);
            break;
        case "REP":
            REP(text_arr, from, res);
            break;
        case "SENADD":
            SENADD(text_arr, from, res);
            break;
        case "SENREP":
            SENREP(text_arr, from, res);
            break;
        default:
            reply("Invalid request text. Please refer to user guide.", res);
            break;
    }
}

router.get('/', function (req, res) {
    var from = req.param('From');
    var message_sid = req.param('MessageSid');
    var body1 = req.param('Body');

    if (from && body1 && message_sid) {
        text_handler(body1, from, res);
    }
    else {
        res.status(400).send('Invalid Request!');
    }
});

function REG(text_arr, from, res) {
    /*
     * User registration
     * Format: REG*{username}*{firstName}*{lastName}
     */
    if (text_arr.length === 4) {
        var user = {};
        if (text_arr[1]) {
            user.username = text_arr[1];
        }
        user.userType = 1;
        user.phoneNumber = from;
        if (text_arr[2]) {
            user.firstName = text_arr[2];
        }
        if (text_arr[3]) {
            user.lastName = text_arr[3];
        }
        // tmpvar/jsdom
        if (from.substring(0, 3) == "+91") {
            user.country = "India";
        }
        else if (from.substring(0, 2) == "+1") {
            user.country = "United States";
        }
        User.create(user, function (result) {
            reply(('Registration: ' + result.message), res);
        });
    }
    else {
        reply(("Invalid text format for user registration. Please refer to user guide."), res);
    }
}

function REP(text_arr, from, res) {
    /*
     * Farmer report
     * Format: REP*{grain_type}*{quantity}*{sensor_name}*{sensorStartDate}*{sensorEndDate}
     * Date Format: MM/DD/YYYY
     */
    if (text_arr.length === 6) {
        var farmer_report = {};
        var sensor_name;
        farmer_report.type = text_arr[1];
        farmer_report.quantity = Number(text_arr[2]);
        sensor_name = text_arr[3];
        farmer_report.raw_sensorStartDate = text_arr[4];
        farmer_report.raw_sensorEndDate = text_arr[5];

        User.query({phoneNumber: from}, function (user_result) {
            console.log(JSON.stringify(user_result));

            if (!user_result.found) {
                reply("Your phone number is not registered.", res);
            }
            else {
                var username = user_result.user.get("username");
                farmer_report.username = username;
                Sensor.query({username: username, name: sensor_name}, function (sensor_result) {
                    console.log(JSON.stringify(sensor_result));
                    if (!sensor_result.found) {
                        reply("Report creation: Please enter a valid sensor name.", res);
                    }
                    else {
                        var sensorID = sensor_result.sensor.id;
                        farmer_report.sensorID = sensorID;
                        FarmerReport.create(farmer_report, function (report_result) {
                            reply("Report creation: " + report_result.message, res);
                        });
                    }
                });
            }
        });
    }
    else {
        reply("Invalid text format for creating report. Please refer to user guide.", res);
    }
}

function SENADD(text_arr, from, res) {
    /*
     * Add sensor
     * Format: SENADD*{name}*{major}*{minor}
     */
    if (text_arr.length === 4) {


    }
    else {
        reply("Invalid text format for adding sensor. Please refer to user guide.", res);
    }
}


function SENREP(text_arr, from, res) {
    /*
     * Sensor report data
     * Format: SENREP*{major}*{minor}*{temperature}*{humidity}
     */
    if (text_arr.length === 5) {
        var raw_report = {
            major: text_arr[1],
            minor: text_arr[2],
            temperature: text_arr[3],
            humidity: text_arr[4]
        };
        SensorReport.create(raw_report, function (saved) {
            if (saved) {
                Sensor.query(raw_report, function (sensor_query) {
                    if (sensor_query.found) {
                        var username = sensor_query.sensor.get('username');
                        var sensor_name = sensor_query.sensor.get('name');
                        User.query({username: username}, function (user_query) {
                            if (user_query.found) {
                                var phoneNumber = user_query.user.get("phoneNumber");
                                console.log(phoneNumber);
                                var text = 'New data received from sensor: '
                                    + sensor_name
                                    + '. Temperature is '
                                    + raw_report.temperature
                                    + '. Humidity is '
                                    + raw_report.humidity
                                    + '.';
                                Sender.send_text(phoneNumber, text);
                            }
                        });
                    }
                });
            }
        });
    }
    res.send('received');
}

module.exports = router;
