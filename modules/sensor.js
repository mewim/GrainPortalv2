var Parse = require('parse/node');
var Sensor = Parse.Object.extend("Sensor");

module.exports = {
    query: function(sensorInfo, callback) {
        console.log(sensorInfo);
        var exist_sensor = new Parse.Query(Sensor);
        if (sensorInfo.major && sensorInfo.minor) {
            exist_sensor.equalTo("major", sensorInfo.major);
            exist_sensor.equalTo("minor", sensorInfo.minor);
            exist_sensor.find({
                success: function (results) {
                    if (results.length > 0) {
                        var sensor = results[0];
                        callback({found: true, sensor: sensor});
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
        else if(sensorInfo.name && sensorInfo.username){
            exist_sensor.equalTo("name", sensorInfo.name);
            exist_sensor.equalTo("username", sensorInfo.username);
            exist_sensor.find({
                success: function (results) {
                    if (results.length > 0) {
                        var sensor = results[0];
                        callback({found: true, sensor: sensor});
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
        else{
            callback({found: false});
        }
    },


    add: function(sensorInfo, callback){

    }
};
