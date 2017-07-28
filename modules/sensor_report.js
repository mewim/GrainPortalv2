var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
var SensorData = Parse.Object.extend("SensorData");

/*
 * sensor_report object:
 * @param sensor_report.major: major in database, digit string.
 * @param sensor_report.minor: minor in database, digit string.
 * @param sensor_report.humidity: humidity in database, number.
 * @param farmer_report.temperature: temperature in database, number.
 */


module.exports = {
    /*
     * Create a sensor report.
     * @param raw_report: information of the report we are creating.
     * @param callback: callback function. param: Boolean, indicating if the report is saved.
     */
    create: function (raw_report, callback) {
        console.log(JSON.stringify(raw_report));
        if ((!raw_report.major) || (isNaN(raw_report.major))) {
            console.log('major_error');
            callback(false);
            return;
        }
        var major = raw_report.major;

        if ((!raw_report.minor) || (isNaN(raw_report.minor))) {
            console.log('minor_error');
            callback(false);
            return;
        }
        var minor = raw_report.minor;

        if(!raw_report.temperature){
            console.log('temp_error');
            callback(false);
            return;
        }
        var temperature = Number(raw_report.temperature);
        if (isNaN(temperature)) {
            console.log('temp2_error');
            callback(false);
            return;
        }

        if(!raw_report.humidity){
            console.log('humi_error');
            callback(false);
            return;
        }
        var humidity = Number(raw_report.humidity);
        if (isNaN(humidity)) {
            console.log('humi2_error');
            callback(false);
            return;
        }

        var new_data = new SensorData();
        new_data.set("major", major);
        new_data.set("minor", minor);
        new_data.set("humidity", humidity);
        new_data.set("temperature", temperature);

        new_data.save(null, {
            success: function (new_data) {
                console.log('created', JSON.stringify(new_data));
                callback(true);
                return;
            },
            error: function (new_data, error) {
                console.log('err', JSON.stringify(error));
                callback(false);
                return;
            }
        });
    }
};
