/*
 * Handling incoming messages from twilio
 */
var BodyParser = require('body-parser');

var express = require('express'),
    router = express.Router();
var JsonParser = BodyParser.json();

var Sender = require('../modules/send_text');

var user = require('../modules/user');

router.post('/create', JsonParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }
    user.create(req.body, function (result) {
        if (result.success) {
            Sender.send_text(result.phoneNumber, 'Registration: ' + result.message, function (err, message) {
                if (err) {
                    res.status(200).send({
                        success: false,
                        message: "Due to a technical error, we cannot send information to your phone. Registration: "
                        + result.message
                    });
                }
                else {
                    res.status(200).send({success: true});
                }
            });
        }
        else {
            res.status(200).send(result);
        }
    });
});

router.post('/request_new', JsonParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }
    var username = req.body.username;
    user.query({username: username}, function (query_result) {
        if (query_result.found) {
            var to_reset = query_result.user;
            user.reset(to_reset, function (result) {
                if (result.success) {
                    Sender.send_text(to_reset.get("phoneNumber"), 'Your new password is \"' + result.newPassword + "\".",
                        function (err, message) {
                            if (err) {
                                res.status(200).send({
                                    success: false,
                                    message: "Due to a technical error, we cannot send information to your phone. Please try again later."
                                });
                            }
                            else {
                                res.status(200).send({
                                    success: true,
                                    message: 'A new password has been sent to your phone.'
                                });
                            }
                        });
                }
                else {
                    res.status(200).send({
                        success: false,
                        message: 'Due to a technical error, your password cannot be reset. Please try again later.'
                    });
                }
            });
        }
        else {
            res.status(200).send({
                success: false,
                message: 'Your username is not found.'
            });
        }
    });
});
module.exports = router;
