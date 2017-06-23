var Sensor = Parse.Object.extend("Sensor");
var SensorData = Parse.Object.extend("SensorData");
var User = Parse.Object.extend("User");
var table = null;


function load_seller_info(username){
  var query = new Parse.Query(User);
  query.equalTo("username",username);
  query.find({
    success: function (results) {
        create_details_table(results);
    },
    error: function (error) {
        hide_loader();
        $("#info").html(red_alert('Cannot load seller details. Please try again later.'));
    }
  });
}


function create_details_table(results) {

    $('#other-wrapper').html(
        '<br>'
        + '<table id="table" class="table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
        + '<thead>'
        + '<tr>'
        + '<th>First Name</th>'
        + '<th>Last Name</th>'
        + '<th>Zip Code</th>'
        + '<th>City</th>'
        + '<th>State</th>'
        + '<th>Country</th>'
        + '</tr>'
        + '</thead>');
    table = $('#table').DataTable();
    for (var i = 0; i < results.length; ++i) {

        var curr_report = results[i];
        table.row.add([
            curr_report.get('firstName'),
            curr_report.get('lastName'),
            curr_report.get('zipCode'),
            curr_report.get('city'),
            curr_report.get('state'),
            curr_report.get('country')]);
        table.draw(false);
    }
}



function read() {
    $("#alert").html(blue_alert("Loading..."));
    $("#table-wrapper").html('');
    $("#morris_chart").html('');
    var name = $('#name').val();
    var major, minor, start, end, username;

    if (window.location.hash) {
      var hashtag = window.location.hash.split('#')[1];
      var vals = hashtag.split('*');
      major = vals[0];
      minor = vals[1];
      start = vals[2];
      end = vals[3];
      username = vals[4];
    }



      var major = major;
      var minor = minor;
      var raw_start = start;
      var raw_end = end;


    //   if (!major) {
    //       $("#alert").html(red_alert('Please enter major for the sensor.'));
    //       return;
    //   }
    //   if (isNaN(major)) {
    //       $("#alert").html(red_alert('Please enter a valid major.'));
    //       return;
    //   }
    //
    //   if (!minor) {
    //       $("#alert").html(red_alert('Please enter minor for the sensor.'));
    //       return;
    //   }
    //   if (isNaN(minor)) {
    //       $("#alert").html(red_alert('Please enter a valid minor.'));
    //       return;
    //   }
    //
    // var start = null, end = null;
    // if (raw_start) {
    //     var moment_start = moment(raw_start, "MM/DD/YYYY");
    //     if (!moment_start.isValid()) {
    //         $("#alert").html(red_alert('Please select or enter a valid start date.'));
    //         return;
    //     }
    //     else {
    //         start = moment_start.toDate();
    //     }
    // }
    //
    // if (raw_end) {
    //     var moment_end = moment(raw_end, "MM/DD/YYYY");
    //     if (!moment_end.isValid()) {
    //         $("#alert").html(red_alert('Please select or enter a valid end date.'));
    //         return;
    //     }
    //     else {
    //         end = moment_end.toDate();
    //     }
    // }
    //
    // if (start && end) {
    //     console.log(start);
    //     console.log(end);
    //     if (end <= start) {
    //         $("#alert").html(red_alert('Date range is invalid'));
    //         return;
    //     }
    // }



    var start = null, end = null;
    var moment_start = moment(raw_start, "MM/DD/YYYY");
    start = moment_start.toDate();
    var moment_end = moment(raw_end, "MM/DD/YYYY");
    end = moment_end.toDate();





    var query = new Parse.Query(Sensor);
    query.equalTo("major", major);
    query.equalTo("minor", minor);
    show_loader();
    query.find({
        success: function (sensors) {
            if (sensors.length === 0) {
                hide_loader();
                $("#alert").html(red_alert('Cannot find sensor. Please check your input.'));
            }
            else {
                var sensor = sensors[0];
                major = sensor.get('major');
                minor = sensor.get('minor');
                var query = new Parse.Query(SensorData);
                query.equalTo("major", major);
                query.equalTo("minor", minor);
                if (start) {
                    query.greaterThanOrEqualTo("createdAt", start);
                }
                if (end) {
                    query.lessThanOrEqualTo("createdAt", end);
                }
                query.descending("updatedAt");
                query.find({
                    success: function (data) {
                        hide_loader();
                        if(data.length > 0) {
                            create_table(data);
                            create_chart(data);
                            $("#alert").html(green_alert('Sensor readings successfully loaded from server.'));
                        }
                        else{
                            $("#alert").html(blue_alert('There are no readings to display.'));
                        }
                    },
                    error: function (error) {
                        $("#alert").html(red_alert('Cannot retrieve sensor data due to a network error. Please try again later.'));
                        hide_loader();
                    }
                });
            }
        },
        error: function (error) {
            $("#alert").html(red_alert('Cannot find sensor due to a network error. Please try again later.'));
            hide_loader();
        }
    });
}

// function reset() {
//     $("#alert").html(blue_alert('Enter major and minor value of a sensor to get readings from it.'));
//     $("#table-wrapper").html('');
//     $("#morris_chart").html('');
//     $('#name').val('');
//     $('#major').val('');
//     $('#minor').val('');
//     $('#start').val('');
//     $('#end').val('');
// }

function show_loader() {
    $('#morris_chart').html(
        '<div class="huge">'
        + '<div class="loader"></div>'
        + '</div>'
        + '<br>'
        + '<h4 style="text-align:center">Loading...</h4>'
        + '</div>'
    );
}

function hide_loader() {
    $('#morris_chart').html('');
}

function create_table(data) {
    $('#table-wrapper').html(
        '<br>'
        + '<table id="table2" class="table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
        + '<thead>'
        + '<tr>'
        + '<th>Index</th>'
        + '<th>Time</th>'
        + '<th>Humidity</th>'
        + '<th>Temperature</th>'
        + '</tr>'
        + '</thead>');
    table2 = $('#table2').DataTable();
    for (var i = 0; i < data.length; ++i) {
        var curr_reading = data[i];
        table2.row.add([
            i,
            moment(curr_reading.get('updatedAt')).format('MMM Do, HH:mm'),
            curr_reading.get('humidity'),
            curr_reading.get('temperature')]);
        table2.draw(false);
    }
}

function create_chart(data) {
    var morris_data = [];
    for (var i = 0; i < Math.min(data.length, 10); ++i) {
        var curr_reading = data[i];
        morris_data[i] = {
            time: moment(curr_reading.get('updatedAt')).format('MMM Do, HH:mm'),
            humidity: curr_reading.get('humidity'),
            temperature: curr_reading.get('temperature')
        }
    }
    morris_data.reverse();
    new Morris.Line({
        element: 'morris_chart',
        data: morris_data,
        xkey: 'time',
        ykeys: ['humidity', 'temperature'],
        labels: ['Humidity', 'Temperature'],
        resize: true,
        parseTime:false
    });
}

$(document).ready(function () {
    $('.dpicker').datepicker({
        todayBtn: "linked"
    });
    if (window.location.hash) {
        var hashtag = window.location.hash.split('#')[1];
        var vals = hashtag.split('*');
        var major = vals[0];
        var minor = vals[1];
        var start = vals[2];
        var end = vals[3];
        var username = vals[4];

        load_seller_info(username);
        read();
    }
});
