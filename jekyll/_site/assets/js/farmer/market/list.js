var FarmerReport = Parse.Object.extend("FarmerReport");

var table = null;
var report_dict = {};

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
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("listed", false);
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

function compute_total_price() {
    var price = Number($("#price").val());
    var id = $('#submit_list').val();
    var to_list = report_dict[id];
    if (!to_list) {
        $("#list-info").html(red_alert('Report is not available. Please try to refresh the webpage.'));
        $('#submit_list').hide();
    }
    if (!price) {
        $("#total_price").html('(Invalid Price)');
    }
    else {
        var total_price = to_list.get("quantity") * price;
        $("#total_price").html(total_price.toFixed(2));
    }
}

function submit_list() {
    var id = $('#submit_list').val();
    var to_list = report_dict[id];
    if (!to_list) {
        $("#list-info").html(red_alert('Report is not available. Please try to refresh the webpage.'));
        $('#submit_list').hide();
        return;
    }
    var unit_price = Number($("#price").val()),
        moment_avaliableAt = moment($('#available_at').val(), "MM/DD/YYYY");
    if (!unit_price || unit_price <= 0) {
        $("#list-info").html(red_alert('Please enter a valid unit price.'));
        return;
    }
    if (!moment_avaliableAt.isValid()) {
        $("#list-info").html(red_alert('Please select or enter a valid date.'));
        return;
    }
    var reportID = to_list.id,
        listedAvailableAt = moment_avaliableAt.toDate(),
        listedUnitPrice = unit_price;

    to_list.set("listed", true);
    to_list.set("sold", false);
    to_list.set("listedAvailableAt", listedAvailableAt);
    to_list.set("listedUnitPrice", listedUnitPrice);

    $("#list-info").html(blue_alert('Submitting your report. Please wait.'));

    to_list.save(null, {
        success: function (new_report) {
            // Execute any logic that should take place after the object is saved.
            $("#list-info").html(green_alert('Your listing is submitted to the market.'));
            $('#submit_list').hide();
            load_reports();

        },
        error: function (new_report, error) {
            $("#list-info").html(red_alert('Your listing cannot be submitted. Please try again later.'));
        }
    });
}

function handle_buttons_click() {
    $('.list').click(function () {
        $('#submit_list').show();
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        $("#list-info").html(blue_alert('Please enter some additional information about your selling.'));
        $('#submit_list').val(id);
        $('#price').val("");
        $('#available_at').val("");
        $("#total_price").html('(Invalid Price)');
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
        + '<th>Report ID</th>'
        + '<th>Created At</th>'
        + '<th>Type</th>'
        + '<th>Quantity (Kg)</th>'
        + '<th>List</th>'
        + '</tr>'
        + '</thead>');
    table = $('#table').DataTable({
        "columnDefs": [
            {
                "orderable": false,
                "targets": -1,
                "data": null,
                "width": "1%",
                "defaultContent": '<button type="button" class="btn btn-success list" data-toggle="modal" data-target="#more_info">List</button>'
            }],
        "order": [[0, "desc"]]
    });
    for (var i = 0; i < results.length; ++i) {

        var curr_report = results[i];
        table.row.add([curr_report.get('digitalID'),
            moment(curr_report.get('updatedAt')).format('MM/DD/YYYY'),
            curr_report.get('type'),
            curr_report.get('quantity')]);
        table.draw(false);
    }
    handle_buttons_click();
}

$(document).ready(function () {
    load_reports();
    $('.dpicker').datepicker({
        todayBtn: "linked"
    });
});