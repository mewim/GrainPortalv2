/*
 * Test cases.
 */

var User = require('./user');
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    test_user_create: function () {
        var u1 = User.create('jj', 1, "+12566688704", 'Chang', 'Liu', 'United States', 'Champaign', 'IL', null, '61820', null, null);
        var u2 = User.create('jj', 1, "+16566688704", 'Chang', 'Liu', 'United States', 'Champaign', 'IL', null, '61820', null, null);
        var u3 = User.create('jjj', 1, "+12566688704", 'Chang', 'Liu', 'United States', 'Champaign', 'IL', null, '61820', null, null);
        var u4 = User.create('jjj', 2, "+19499035202", 'Chang', 'Liu', 'United States', 'Champaign', 'IL', null, '61820', null, null);
        var u5 = User.create('jjj', 2, "+19499035202", 'Chang', 'Liu', 'United States', 'Champaign', 'IL', null, '61820', null, "123456789");
        return [u1, u2, u3, u4, u5];
    },
};
