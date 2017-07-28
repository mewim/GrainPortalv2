/*
 * Handling user registration and deletion. 
 */

/*
 *user object:
 * @param user.username: username in database, can contain number and characters.
 * @param user.userType: 0 = admin, 1 = farmer, 2 = trader. userType in database.
 * @param user.phoneNumber: phoneNumber in database.
 * @param user.firstName: firstName in database.
 * @param user.lastName: lastName in database.
 * @param user.country: country in database.
 * @param user.city: (optional) city in database.
 * @param user.state: (optional) state in database.
 * @param user.address: (optional) address in database.
 * @param user.zipCode: (optional) zipCode in database.
 * @param user.email: (optional) email in database. Must be a valid e-mail address if filled.
 * @param user.password: (will be generated automatically) password in database.
 */

var Parse = require('parse/node');
var Validator = require('validator');

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * Validate and preprocess a user.
 * @param user: information of the user we are creating.
 * @return {success: Boolean, message: String, user: user object}
 */
function validateUserInfo(user) {
    if (!user.username) {
        return {success: false, message: 'Username cannot be empty.'};
    }

    if (!Validator.isLength(user.username, {min: 1, max: 10})) {
        return {success: false, message: 'Username can only have 1 - 10 characters.'};
    }
    if (!Validator.isAlphanumeric(user.username)) {
        return {success: false, message: 'Username can contain only numbers and letters.'};
    }
    user.username = user.username.toLowerCase();

    if ((user.userType !== 0) && (user.userType !== 1) && (user.userType !== 2)) {
        return {success: false, message: 'userType error. Please contact administrator.'};
    }

    if (!user.firstName) {
        return {success: false, message: 'First name cannot be empty.'};
    }
    if (!Validator.isAlpha(user.firstName)) {
        return {success: false, message: 'First name can contain only letters.'};
    }

    if (!user.lastName) {
        return {success: false, message: 'Last name cannot be empty.'};
    }
    if (!Validator.isAlpha(user.lastName)) {
        return {success: false, message: 'Last name can contain only letters.'};
    }

    if (user.country !== 'India' && user.country !== 'United States') {
        return {success: false, message: 'Invalid country. Please contact administrator.'};
    }

    if (user.city) {
        if (!Validator.isAlpha(user.city)) {
            return {success: false, message: 'City can contain only letters.'};
        }
    }

    if (user.state) {
        if (!Validator.isAlpha(user.state)) {
            return {success: false, message: 'State can contain only letters.'};
        }
    }

    if (user.zipCode) {
        if (!Validator.isNumeric(user.zipCode)) {
            return {success: false, message: 'Zip code can contain only numbers.'};
        }
    }

    if (user.email) {
        if (!Validator.isEmail(user.email)) {
            return {success: false, message: 'Invalid e-mail address.'};
        }
        else {
            user.email = user.email.toLowerCase();
        }
    }
    return {success: true, message: null, user: user};
}


module.exports = {
    /*
     * Create a new user.
     * @param user: information of the user we are creating.
     * @param callback: callback function. param: {success: Boolean, message: String, password: password for the user, user: Parse user object }
     */
    create: function (user, callback) {
        var userValidate = validateUserInfo(user);
        if (userValidate.success) {
            user.password = getRandomInt(10000000, 99999999).toString();
            var exist_user = new Parse.Query(Parse.User);
            exist_user.equalTo("username", user.username);
            exist_user.count({
                success: function (count_user) {
                    if (count_user === 0) {
                        var exist_phone = new Parse.Query(Parse.User);
                        exist_phone.equalTo("phoneNumber", user.phoneNumber);
                        exist_phone.count({
                            success: function (count_phone) {
                                if (count_phone === 0) {
                                    var new_user = new Parse.User();
                                    new_user.set("username", user.username);
                                    new_user.set("userType", user.userType);
                                    new_user.set("phoneNumber", user.phoneNumber);
                                    new_user.set("firstName", user.firstName);
                                    new_user.set("lastName", user.lastName);
                                    new_user.set("country", user.country);
                                    new_user.set("password", user.password);
                                    if (user.city) {
                                        new_user.set("city", user.city);
                                    }
                                    if (user.state) {
                                        new_user.set("state", user.state);
                                    }
                                    if (user.address) {
                                        new_user.set("address", user.address);
                                    }
                                    if (user.zipCode) {
                                        new_user.set("zipCode", user.zipCode);
                                    }
                                    if (user.email) {
                                        new_user.set("email", user.email);
                                    }
                                    new_user.signUp(null, {
                                        success: function (signed_user) {
                                            callback({
                                                success: true,
                                                message: 'Completed successfully. Your Username is "' + user.username + '", and your password is "' + user.password + '".',
                                                password: user.password,
                                                phoneNumber: user.phoneNumber
                                            });
                                        },
                                        error: function (error) {
                                            callback({success: false, message: error.message});
                                        }
                                    });
                                }
                                else {
                                    callback({
                                        success: false,
                                        message: "Phone number " + user.phoneNumber + " already taken. Please use another phone number."
                                    });
                                }
                            },
                            error: function (user, error) {
                                callback({success: false, message: error.message});
                            }
                        });
                    }
                    else {
                        callback({
                            success: false,
                            message: "Username " + user.username + " already taken. Please use another username."
                        });
                    }
                },
                error: function (user, error) {
                    callback({success: false, message: error.message});
                }
            });
        }
        else {
            callback({success: false, message: userValidate.message});
        }
    },
    remove: function (username) {
        return "Hola";
    },
    /*
     * Reset password of a user.
     * @param phoneNumber: phone number of the user.
     * @param callback: callback function. param: {success: Boolean, newPassword: a new password.}
     */
    reset: function (user, callback) {
        var newPassword = getRandomInt(10000000, 99999999).toString();
        user.setPassword(newPassword);
        user.save(null, {
            useMasterKey: true,
            success: function (user) {
                callback({success: true, newPassword: newPassword});
            },
            error: function (error) {
                callback({success: false});
            }
        });
    },
    /*
     * Query a user based on username or phoneNumber.
     * @param userInfo: known information of the user.
     * @param callback: callback function. param: {found: Boolean, user: Parse user object}
     */
    query: function (userInfo, callback) {
        var exist_user = new Parse.Query(Parse.User);
        if (userInfo.phoneNumber) {
            exist_user.equalTo("phoneNumber", userInfo.phoneNumber);
            exist_user.find({
                success: function (results) {
                    if (results.length > 0) {
                        var user = results[0];
                        callback({found: true, user: user});
                    }
                    else {
                        callback({found: false});
                    }
                },
                error: function (error) {
                    callback({found: false});
                }
            });
        }

        else if (userInfo.username) {
            exist_user.equalTo("username", userInfo.username);
            exist_user.find({
                success: function (results) {
                    if (results.length > 0) {
                        var user = results[0];
                        callback({found: true, user: user});
                    }
                    else {
                        callback({found: false});
                    }
                },
                error: function (error) {
                    callback({found: false});
                }
            });
        }

        else {
            callback({found: false});
        }
    }
};
