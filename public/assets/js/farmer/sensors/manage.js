var Sensor = Parse.Object.extend("Sensor");
var table = null;

function add() {
    $("#alert").html(blue_alert("Add a sensor to your account, so that you can get readings and alerts from it."));
    var name = $('#name').val();
    var major = $('#major').val();
    var minor = $('#minor').val();

    if (!major) {
        $("#alert").html(red_alert('Please enter major for the sensor.'));
        return;
    }
    if (isNaN(major)) {
        $("#alert").html(red_alert('Please enter a valid major.'));
        return;
    }

    if (!minor) {
        $("#alert").html(red_alert('Please enter minor for the sensor.'));
        return;
    }
    if (isNaN(minor)) {
        $("#alert").html(red_alert('Please enter a valid minor.'));
        return;
    }

    if (!name) {
        $("#alert").html(red_alert('Please enter a name.'));
        return;
    }
    var query = new Parse.Query(Sensor);
    query.equalTo("major", major);
    query.equalTo("minor", minor);
    query.count({
        success: function (count) {
            if (count === 0) {
                var query_name = new Parse.Query(Sensor);
                query_name.equalTo("name", name);
                query_name.count({
                    success: function (count_name) {
                        if (count_name === 0) {
                            var new_sensor = new Sensor();
                            new_sensor.set("major", major);
                            new_sensor.set("minor", minor);
                            new_sensor.set("name", name);
                            new_sensor.set("username", currentUser.get('username'));
                            new_sensor.save(null, {
                                success: function (new_sensor) {
                                    // Execute any logic that should take place after the object is saved.
                                    $("#alert").html(green_alert('The sensor is added successfully.'));
                                    table.row.add([new_sensor.get('name'),
                                        new_sensor.get('major'),
                                        new_sensor.get('minor')]);
                                    table.draw(false);
                                    handle_buttons_click();
                                },
                                error: function (new_sensor, error) {
                                    $("#alert").html(red_alert('The sensor cannot be saved. Please try again later.'));
                                }
                            });
                        }
                        else {
                            $("#alert").html(red_alert('The sensor name is already in use, please use another name.'));
                        }
                    },
                    error: function (error) {
                        $("#alert").html(red_alert('The sensor cannot be saved. Please try again later.'));
                    }
                });
            }
            else {
                $("#alert").html(red_alert('The sensor is already in use.'));
            }
        },
        error: function (error) {
            $("#alert").html(red_alert('The sensor cannot be saved. Please try again later.'));
        }
    });
}

function reset() {
    $("#alert").html(blue_alert("Add a sensor to your account, so that you can get readings and alerts from it."));
    $('#name').val('');
    $('#major').val('');
    $('#minor').val('');
}

function load_sensors() {
    var query = new Parse.Query(Sensor);
    query.equalTo("username", currentUser.get('username'));
    query.find({
        success: function (results) {
            create_table(results);
        },
        error: function (error) {
            $("#sensor-data").html(red_alert('Cannot load sensors. Please try again later.'));
        }
    });
}

function remove_sensor(major, minor, row) {
    var query = new Parse.Query(Sensor);
    query.equalTo("major", major);
    query.equalTo("minor", minor);
    query.first({
        success: function (sensor_to_delete) {
            sensor_to_delete.destroy({
                success: function (myObject) {
                    row.remove().draw();
                },
                error: function (myObject, error) {
                }
            });
        },
        error: function (error) {
        }
    });
    //row.remove().draw();
    handle_buttons_click();
}

function get_readings(major, minor) {
    var hash = major + '*' + minor;
    window.location = ('/farmer/sensors/read/#' + hash);
}

function handle_buttons_click() {
    $('.remove').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var major = data[1];
        var minor = data[2];
        remove_sensor(major, minor, row);
    });
    $('.show').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var major = data[1];
        var minor = data[2];
        get_readings(major, minor);
    });
}

function create_table(results) {
    $('#table-wrapper').html(
        '<table id="table" class="table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
        + '<thead>'
        + '<tr>'
        + '<th>Name</th>'
        + '<th>Hub</th>'
        + '<th>Sensor</th>'
        + '<th>Readings</th>'
        + '<th>Remove</th>'
        + '</tr>'
        + '</thead>');
    table = $('#table').DataTable({
        "columnDefs": [{
            "orderable": false,
            "targets": -1,
            "data": null,
            "width": "1%",
            "defaultContent": '<button class="btn btn-danger remove">Remove</button>'
        },
            {
                "orderable": false,
                "targets": -2,
                "data": null,
                "width": "1%",
                "defaultContent": '<button class="btn btn-success show">Show</button>'
            }]
    });
    for (var i = 0; i < results.length; ++i) {
        var curr_sensor = results[i];
        table.row.add([curr_sensor.get('name'),
            curr_sensor.get('major'),
            curr_sensor.get('minor')]);
        table.draw(false);
    }
    handle_buttons_click();
}

$(document).ready(function () {
    load_sensors();
});
