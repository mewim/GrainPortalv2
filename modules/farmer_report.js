var Parse = require('parse/node');
var Moment = require('moment');

var Sensor = Parse.Object.extend("Sensor");
var FarmerReport = Parse.Object.extend("FarmerReport");

/*
 * farmer_report object:
 * @param farmer_report.type: type in database, can characters.
 * @param farmer_report.username: username in database, can contain number and characters.
 * @param farmer_report.sensorID: sensorID in database.
 * @param farmer_report.quantity: number, corresponding to quantity in database.
 * @param farmer_report.raw_sensorStartDate: MM/DD/YYYY, corresponding to sensorStartDate in database.
 * @param farmer_report.raw_sensorEndDate: MM/DD/YYYY, corresponding to sensorEndDate in database.
 */


module.exports = {
    /*
     * Create a new report.
     * @param raw_report: information of the report we are creating.
     * @param callback: callback function. param: {success: Boolean, message: String, report: Parse FarmerReport object }
     */
    create: function (raw_report, callback){
        console.log(raw_report);
        if(!raw_report.type){
            callback({message: "Invalid grain type.", success: false});
            return;
        }
        // /^\d+(\.\d+)?$/.test("112311")
        if((!raw_report.quantity) || (raw_report.quantity <= 0)){
            callback({message: "Invalid quantity.", success: false});
            return;
        }
        var moment_sensorStartDate = Moment(raw_report.raw_sensorStartDate, "MM/DD/YYYY");
        var moment_sensorEndDate = Moment(raw_report.raw_sensorEndDate, "MM/DD/YYYY");
        if(!moment_sensorStartDate.isValid()){
            callback({message: "Please enter a valid start date.", success: false});
            return;
        }
        if(!moment_sensorEndDate.isValid()){
            callback({message: "Please enter a valid end date.", success: false});
            return;
        }

        var sensorStartDate, sensorEndDate;
        sensorStartDate = moment_sensorStartDate.toDate();
        sensorEndDate = moment_sensorEndDate.toDate();
        if(sensorEndDate <= sensorStartDate){
            callback({message: "Date range is invalid.", success: false});
            return;
        }
        var most_recent_query = new Parse.Query(FarmerReport);
        most_recent_query.equalTo("username", raw_report.username);
        most_recent_query.descending("updatedAt");
        most_recent_query.limit(1);
        most_recent_query.find({
            success: function (most_recent_data) {
                var new_report = new FarmerReport();
                new_report.set("username", raw_report.username);
                new_report.set("sensorID", raw_report.sensorID);
                new_report.set("quantity", raw_report.quantity);
                new_report.set("sensorStartDate", sensorStartDate);
                new_report.set("sensorEndDate", sensorEndDate);
                new_report.set("type", raw_report.type);
                new_report.set("listed", false);
                new_report.set("sold", false);
                if(most_recent_data.count === 0){
                    new_report.set("digitalID", 0);
                }
                else{
                    var most_recent = most_recent_data[0];
                    new_report.set("digitalID", most_recent.get("digitalID") + 1);
                }
                new_report.save(null, {
                    success: function (new_report) {
                        callback({message: "Your report has been submitted, report ID: " + new_report.get("digitalID") + ".", success: true});
                        return;
                    },
                    error: function (new_report, error) {
                        callback({message: "Your report cannot be submitted, please try again later.",  success: false});
                        return;
                    }
                });
            },
            error: function (error) {
                callback({message: "Your report cannot be submitted, please try again later.", success: false});
                return;
            }
        });
    },
    delete: function(report_id){

    }
};
