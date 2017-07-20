var FarmerReport = Parse.Object.extend("FarmerReport");
var Sensor = Parse.Object.extend("Sensor");

var table = null;
var report_dict = {};

function load_reports() {
    var query = new Parse.Query(FarmerReport);
    query.equalTo("username", currentUser.get('username'));
    query.find({
        success: function (results) {
            create_dict(results);
            create_table(results);
        },
        error: function (error) {
            $("#table-wrapper").html(red_alert("Cannot load reports, please try again later."));
        }
    });
}

function remove_report(id, row) {
    var to_delete = report_dict[id];
    if (to_delete) {
        to_delete.destroy({
            success: function () {
                row.remove().draw();
            },
            error: function (myObject, error) {
            }
        });
    }
}

function get_readings(id, row) {
    var target = report_dict[id];
    if (target) {
        var start = moment(target.get('sensorStartDate')).format('MM/DD/YYYY'),
            end = moment(target.get('sensorEndDate')).format('MM/DD/YYYY'),
            sensorID = target.get('sensorID');
        var query = new Parse.Query(Sensor);
        query.get(sensorID, {
            success: function (sensor) {
                var major = sensor.get('major'),
                    minor = sensor.get('minor');
                var hash = major + '*' + minor + '*' + start + '*' + end;
                window.location = ('/farmer/sensors/read/#' + hash);
            },
            error: function (sensor, error) {
            }
        });
    }
}

function handle_buttons_click() {
    $('.remove').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        remove_report(id, row);
    });
    $('.read').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        get_readings(id, row);
    });
}

function create_dict(results) {
    for (var i = 0; i < results.length; ++i) {
        var curr_report = results[i];
        report_dict[curr_report.get('digitalID')] = curr_report;
    }
}

function create_table(results) {
    $('#table-wrapper').html(
        '<table id="table" class="table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
        + '<thead>'
        + '<tr>'
        + '<th>ID</th>'
        + '<th>Created At</th>'
        + '<th>Type</th>'
        + '<th>Quantity (Kg)</th>'
        + '<th>Data</th>'
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
                "defaultContent": '<button class="btn btn-success read">Read</button>'
            }],
        "order": [[0, "desc"]]
    });
    for (var i = 0; i < results.length; ++i) {
        var curr_report = results[i];
        table.row.add([curr_report.get('digitalID'),
            moment(curr_report.get('createdAt')).format('MM/DD/YYYY'),
            curr_report.get('type'),
            curr_report.get('quantity')]);
        table.draw(false);
    }
    handle_buttons_click();
}

$(document).ready(function () {
    load_reports();
});