/*
 * Handling incoming messages from twilio
 */
var BodyParser = require('body-parser');

var express = require('express'),
    router = express.Router();
var JsonParser = BodyParser.json();

var Sender = require('../modules/send_text');

var user = require('../modules/user');

var Notification = Parse.Object.extend("Notification");

router.post('/', JsonParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }
    var username = req.body.username;
    var content = req.body.content;
    var type = req.body.type;
    user.query({username: username}, function (query_result) {
        if (query_result.found) {
            var receiver = query_result.user;
            var phoneNumber = receiver.get("phoneNumber");
            var username = receiver.get("username");
            Sender.send_text(phoneNumber, content,
                function (err, message) {
                    if (err) {
                        res.status(200).send({
                            success: false,
                            message: "Due to a technical error, we cannot send information to the receiver. Please try again later."
                        });
                    }
                    else {
                        res.status(200).send({
                            success: true
                        });
                    }
                });
            var new_notification = new Notification();
            new_notification.set("username", username);
            new_notification.set("content", content);
            new_notification.set("archived", false);
            new_notification.set("type", type);
            new_notification.save();
        }
        else {
            res.status(200).send({
                success: false,
                message: "Due to a technical error, we cannot send information to the receiver. Please try again later."
            });
        }
    });
});
module.exports = router;
