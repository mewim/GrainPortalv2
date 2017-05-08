var FarmerReport = Parse.Object.extend("FarmerReport");

var table = null;
var report_dict = {};

function remove_report(id, row) {
    var to_delete = report_dict[id];
    if (to_delete) {
        to_delete.set('listed', false);
        to_delete.save(null, {
            success: function () {
                row.remove().draw();
            },
            error: function (myObject, error) {
            }
        });
    }
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
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("listed", true);
    query.equalTo("sold", false);
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

function handle_buttons_click() {
    $('.remove').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        remove_report(id, row);
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
        + '<th>Available At</th>'
        + '<th>Type</th>'
        + '<th>Quantity (Kg)</th>'
        + '<th>Unit Price</th>'
        + '<th>Total Price</th>'
        // + '<th>Sold</th>'
        + '<th>Remove</th>'
        + '</tr>'
        + '</thead>');
    table = $('#table').DataTable({
        "columnDefs": [
            // {
            //     "orderable": false,
            //     "targets": -2,
            //     "data": null,
            //     "width": "1%",
            //     "defaultContent": '<button type="button" class="btn btn-success list" data-toggle="modal" data-target="#more_info">Sold</button>'
            // },
            {
                "orderable": false,
                "targets": -1,
                "data": null,
                "width": "1%",
                "defaultContent": '<button type="button" class="btn btn-danger remove">Remove</button>'
            }],
        "order": [[0, "desc"]]
    });
    for (var i = 0; i < results.length; ++i) {

        var curr_report = results[i];
        table.row.add([curr_report.get('digitalID'),
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
    $('.dpicker').datepicker({
        todayBtn: "linked"
    });
});