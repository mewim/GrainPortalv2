var FarmerReport = Parse.Object.extend("FarmerReport");
var Sensor = Parse.Object.extend("Sensor");

var table = null;
var report_dict = {};

function show_detail(id){
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
                window.location = ('/trader/sensor_read/#' + hash);
            },
            error: function (sensor, error) {
            }
        });
    }
}

function submit_message(){
    var id = $("#submit_message").val();
    var content = $('#message').val();
    if(!content){
        $('#contact-info').html(red_alert("Please enter your message to send."));
        return;
    }
    var listing = report_dict[id];
    if(!listing){
        $("#contact-info").html(red_alert("Invalid listing. Please try to refresh the webpage."));
        $("#submit_message").hide();
        return;
    }
    var seller_username = listing.get("username");
    var message = {type: 2, content:content, username:seller_username};
    $.ajax({
        url: '/send_message',
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'POST',
        data: JSON.stringify(message),
        success: function (result) {
            if (result.success) {
                $("#contact-info").html(green_alert('Your message is sent to seller.'));
            }
            else{
                $("#contact-info").html(red_alert(result.message));
            }
        },
        error: function (xhr, status, error) {
            $("#contact-info").html(('Network error. Please try again later.'));
        }
    });
}

function contact_clicked(id){
    $("#contact-info").html(blue_alert("Send a message to seller."));
    $("#submit_message").val(id);
    $("#submit_message").show();
    var listing = report_dict[id];
    if(!listing){
        $("#contact-info").html(red_alert("Invalid listing. Please try to refresh the webpage."));
        $("#submit_message").hide();
        return;
    }
    $('#message').val(
          "Hello, My name is "
        + currentUser.get("firstName")
        +" "
        + currentUser.get("lastName")
        +". I am interested in your listing of "
        + listing.get("quantity")
        + " kg of "
        + listing.get("type")
        + " available at "
        + moment(listing.get("listedAvailableAt")).format("MM/DD/YYYY")
        + ". Please contact me at "
        + currentUser.get("phoneNumber")
        + "."
    );
}

function show_loader() {
    var loader = '<div class="huge">'
        + '<div class="loader"></div>'
        + '</div>'
        + '<br>'
        + '<h4 style="text-align:center">Loading...</h4>';
    $('#table-wrapper').html(loader);
}

function load_reports() {
    show_loader();
    var query = new Parse.Query(FarmerReport);
		query.equalTo("listed", true);
		query.equalTo("sold", false);
		query.descending("listedAvailableAt");
    query.find({
        success: function (results) {
            create_dict(results);
            create_table(results);
        },
        error: function (error) {
            $("#table-wrapper").html(red_alert("Cannot load listings, please try again later."));
        }
    });
}

function handle_buttons_click() {
    $('.detail').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        show_detail(id);
    });
    $('.contact').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        contact_clicked(id);
    });
}

function create_dict(results) {
    for (var i = 0; i < results.length; ++i) {
        var curr_report = results[i];
        report_dict[curr_report.id] = curr_report;
    }
}

function create_table(results) {
    $('#table-wrapper').html(
        '<table id="table" class="table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
        + '<thead>'
        + '<tr>'
        + '<th>Report ID</th>'
        + '<th>Available At</th>'
        + '<th>Type</th>'
        + '<th>Quantity (Kg)</th>'
        + '<th>Unit Price</th>'
        + '<th>Total Price</th>'
        + '<th>Detail</th>'
        + '<th>Buy</th>'
        + '</tr>'
        + '</thead>');
    table = $('#table').DataTable({
        "columnDefs": [

            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "orderable": false,
                "targets": 1
            },
            {
                "orderable": false,
                "targets": -2,
                "data": null,
                "width": "1%",
                "defaultContent": '<button type="button" class="btn btn-primary detail">Get Detail</button>'
            },
            {
                "orderable": false,
                "targets": -1,
                "data": null,
                "width": "1%",
                "defaultContent": '<button type="button" class="btn btn-success contact" data-toggle="modal" data-target="#more_info">Contact Seller</button>'
            }],
        "order": [[0, "desc"]]
    });
    for (var i = 0; i < results.length; ++i) {

        var curr_report = results[i];
        table.row.add([
            curr_report.id,
            moment(curr_report.get('listedAvailableAt')).format('MM/DD/YYYY'),
            curr_report.get('type'),
            curr_report.get('quantity'),
            curr_report.get('listedUnitPrice'),
            curr_report.get('listedUnitPrice') * curr_report.get('quantity')]);
        table.draw(false);
    }
    handle_buttons_click();
}

$(document).ready(function () {
    load_reports();
});
