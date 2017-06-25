var Sensor = Parse.Object.extend("Sensor");
var FarmerReport = Parse.Object.extend("FarmerReport");

function submit(){
    var type = $('#type').val();
    var quantity = Number($('#quantity').val());
    if(!type){
        $("#info").html(red_alert('Please enter a valid grain type.'));
        return;
    }
    if((!quantity) || (quantity < 0)) {
        $("#info").html(red_alert('Please enter a valid quantity.'));
        return;
    }
    var sensorID = $('#sensor option:selected').val();
    if (sensorID === '0'){
        $("#info").html(red_alert('Please select a sensor.'));
    }
    var raw_sensorStartDate = moment($('#start').val(), "MM/DD/YYYY");
    var raw_sensorEndDate = moment($('#end').val(), "MM/DD/YYYY");
    console.log(raw_sensorStartDate, raw_sensorEndDate);
    var sensorStartDate, sensorEndDate;
    if(!raw_sensorStartDate.isValid()){
        $("#info").html(red_alert('Please select or enter a valid start date.'));
        return;
    }
    if(!raw_sensorEndDate.isValid()){
        $("#info").html(red_alert('Please select or enter a valid end date.'));
        return;
    }
    sensorStartDate = raw_sensorStartDate.toDate();
    sensorEndDate = raw_sensorEndDate.toDate();
    if(sensorEndDate <= sensorStartDate){
        $("#info").html(red_alert('Date range is invalid'));
        return;
    }

    var most_recent_querry = new Parse.Query(FarmerReport);
    most_recent_querry.equalTo("username", currentUser.get('username'));
    most_recent_querry.descending("createdAt");
    most_recent_querry.limit(1);
    most_recent_querry.find({
        success: function (most_recent_data) {
            var new_report = new FarmerReport();
            new_report.set("type", type);
            new_report.set("username", currentUser.get('username'));
            new_report.set("quantity", quantity);
            new_report.set("sensorStartDate", sensorStartDate);
            new_report.set("sensorEndDate", sensorEndDate);
            new_report.set("sensorID", sensorID);
            new_report.set("listed", false);
            new_report.set("sold", false);
            if(most_recent_data.count === 0){
                new_report.set("digitalID", 0);
            }

            else{
                var most_recent = most_recent_data[0];
                new_report.set("digitalID", most_recent.get("digitalID") + 1);
            }
            $("#info").html(blue_alert('Submitting your report. Please wait.'));
            new_report.save(null, {
                success: function (new_report) {
                    // Execute any logic that should take place after the object is saved.
                    $("#info").html(green_alert('Your report is submitted.'));
                },
                error: function (report, error) {
                    $("#info").html(red_alert('Your report cannot be submitted. Please try again later.'));
                }
            });

        },
        error: function (error) {
            $("#info").html(red_alert('Your report cannot be submitted. Please try again later.'));
        }
    });

}

function reset(){
    $('#info').html(blue_alert('Create a report to help you better manage your yields. It also helps potential buyer and researchers learn more about your grain.'));
    $('#type').val('');
    $('#quantity').val('');
    $('#sensor').val('0');
    $('#start').val('');
    $('#end').val('');
}

function load_sensors() {
    var query = new Parse.Query(Sensor);
    query.equalTo("username", currentUser.get('username'));
    query.find({
        success: function (results) {
            create_selector(results);
            if (results.length === 0){
                $("#info").html(red_alert('You have no sensor to associate. Please add a sensor first.'));
            }
        },
        error: function (error) {
            $("#info").html(red_alert('Cannot load sensors. Please try again later.'));
        }
    });
}

function create_selector(results) {
    var selector = $('#sensor');
    selector.find('option')
        .remove();
    $('select').append($('<option>', {value: 0, text: 'Please select a sensor' }));
    for(var i = 0; i < results.length; ++i) {
        var curr_sensor = results[i];
        var name = curr_sensor.get("name");
        var major = curr_sensor.get("major");
        var minor = curr_sensor.get("minor");
        var id = curr_sensor.id;
        $('select').append($('<option>', {value: id, text: name + ' (' + major +'/' + minor + ')' }));
    }
}

$(document).ready(function () {
    load_sensors();
    $('.dpicker').datepicker({
        todayBtn: "linked"
    });
});
