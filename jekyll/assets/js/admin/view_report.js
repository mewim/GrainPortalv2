var Report = Parse.Object.extend("FarmerReport");



$(document).ready(function () {
    load_report();
});

function load_report() {
    var query = new Parse.Query(Report);
    query.descending("updatedAt");
    query.find({
        success: function (results) {
            var count = results.length;
            console.log(count);
            if (count === 0) {
                hide_loader();
                $('#info').html(red_alert('There is no report to display.'));
            }
            else {
                hide_loader();
                display_report(results);
            }
        },
        error: function (error) {
            hide_loader();
            $("#info").html(red_alert('Cannot load reports. Please try again later.'));
        }
    });
}

function display_report(results) {
    for (var i = 0; i < results.length; ++i) {
        add_report(results[i]);
    }
}

function add_report(report) {
    var create_date = moment(report.createdAt).format('MMM Do, HH:mm');
    var sold_date = moment(report.soldAt).format('MMM Do, HH:mm');
    var user = report.get('username');
    var grain_type = report.get('type');
    var quantity = report.get('quantity');
    var sold_comment = report.get('soldComment');
    var sensor_start_date = moment(report.sensorStartDate).format('MMM Do, HH:mm');
    var sensor_end_date = moment(report.sensorEndDate).format('MMM Do, HH:mm');
    if (sold_comment == undefined){
        sold_comment = "no comment";
    }
    var report_html = '<div class="panel panel-default background-report">'
        + '<div class="panel-heading">'
        + '<div class="row">'
        + '<div class="col-xs-3">'
        + '<div>'
        + create_date
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="panel-body">'
        + '<b class = "sold-style">Sold date: </b>'
        + '<span class = "sold-style">'
        + sold_date
        +'<hr>'
        + '</span>'
        + '<b class = "report-style">User name: </b>'
        + '<span class = "report-style">'
        + user
        +'<hr>'
        + '</span>'
        + '<b class = "report-style">Grain type: </b>'
        + '<span class = "report-style">'
        + grain_type
        +'<hr>'
        + '</span>'
        + '<b class = "report-style">Quantity: </b>'
        + '<span class = "report-style">'
        + quantity
        +'<hr>'
        + '</span>'
        + '<b class = "report-style">Sensor Start Date: </b>'
        + '<span class = "report-style">'
        + sensor_start_date
        +'<hr>'
        + '</span>'
        + '<b class = "report-style">Sensor End Date: </b>'
        + '<span class = "report-style">'
        + sensor_end_date
        +'<hr>'
        + '</span>'
        + '<b class = "report-style">Comment: </b>'
        + '<span class = "report-style">'
        + sold_comment
        +'<hr>'
        + '</span>'
        + '</div>'
        + '</div>';
    $('#report-container').append(report_html);
}

function hide_loader() {
    $('#report-container').html('');
}