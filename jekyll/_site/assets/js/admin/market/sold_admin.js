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
//  query.equalTo("username", currentUser.get('username'));
    query.equalTo("sold", true);
    query.find({
        success: function (results) {
            create_dict(results);
            create_table(results);
        },
        error: function (error) {
            $("#table-wrapper").html(red_alert("Cannot load sales, please try again later."));
        }
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
        + '<th>Sold At</th>'
        + '<th>Type</th>'
        + '<th>Quantity (Kg)</th>'
      //  + '<th>List</th>'
        + '<th>Sale Comments</th>'
        + '</tr>'
        + '</thead>');
        table = $('#table').DataTable({
          // "columnDefs": [
            //    {
            //        "orderable": false,
            //        "targets": -1,
            //        "data": null,
            //        "width": "1%",
            //      //  "defaultContent": '<button type="button" class="btn btn-success list" data-toggle="modal" data-target="#more_info">List</button>'
            //       "defaultContent": ""
          //      }],
            "order": [[0, "desc"]]
        });
    for (var i = 0; i < results.length; ++i) {

        var curr_report = results[i];
        table.row.add([curr_report.get('digitalID'),
            moment(curr_report.get('soldAt')).format('MM/DD/YYYY'),
            curr_report.get('type'),
            curr_report.get('quantity'),
            curr_report.get('soldComment')]);
        table.draw(false);
    }
  //  handle_buttons_click();
}

$(document).ready(function () {
    load_reports();
});
