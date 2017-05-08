/*
 * Send text message using Twilio API.
 */

var Twilio = require('twilio');
var TwilioClient = new Twilio.RestClient(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

module.exports = {
    send_text: function (to, body, callback) {
        TwilioClient.messages.create({
            body: body,
            to: to,
            from: process.env.TWILIO_PHONENUMBER
        }, callback);
    }
};