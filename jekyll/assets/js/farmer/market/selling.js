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

function compute_total_price() {
    var price = Number($("#price").val());
    var id = $('#submit_sale').val();
    var to_list = report_dict[id];
    if (!to_list) {
        $("#sale-info").html(red_alert('Information is not available. Please try to refresh the webpage.'));
        $('#submit_sale').hide();
    }
    if (!price) {
        $("#total_price").html('(Invalid Price)');
    }
    else {
        var total_price = to_list.get("quantity") * price;
        $("#total_price").html(total_price.toFixed(2));
    }
}




function submit_sale() {
    var id = $('#submit_sale').val();
    var to_list = report_dict[id];
    if (!to_list) {
        $("#sale-info").html(red_alert('Information is not available. Please try to refresh the webpage.'));
        $('#submit_sale').hide();
        return;
    }
    var comment = $('#comments').val();
    var unit_price = Number($("#price").val()),
        moment_soldAt = moment($('#sold_on').val(), "MM/DD/YYYY");
    if (!moment_soldAt.isValid()) {
            $("#sale-info").html(red_alert('Please select or enter a valid date.'));
            return;
        }
    if (!unit_price || unit_price <= 0) {
        $("#sale-info").html(red_alert('Please enter a valid unit price.'));
        return;
    }    
    if(!comment){
      $("#sale-info").html(red_alert('Please comment on the sale.'));
      return;
    }


    var reportID = to_list.id,
        soldAt = moment_soldAt.toDate(),
        soldUnitPrice = unit_price;

    to_list.set("listed", false);
    to_list.set("sold", true);
    to_list.set("soldAt", soldAt);
    to_list.set("soldUnitPrice", soldUnitPrice);
    to_list.set("soldComment",comment);

    $("#sale-info").html(blue_alert('Submitting your sale. Please wait.'));

    to_list.save(null, {
        success: function (new_report) {
            // Execute any logic that should take place after the object is saved.
            $("#sale-info").html(green_alert('Your sale has been submitted.'));
            $('#submit_sale').hide();
            load_reports();

        },
        error: function (new_report, error) {
            $("#sale-info").html(red_alert('Your sale was not submitted. Please try again later.'));
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

    $('.sold').click(function () {
        $('#submit_sale').show();
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        $("#sale-info").html(blue_alert('Please enter some additional information about your sale.'));
        $('#submit_sale').val(id);
        $('#price').val("");
        $('#sold_on').val("");
        $('#comments').val("");
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
        + '<th>Available At</th>'
        + '<th>Type</th>'
        + '<th>Quantity (Kg)</th>'
        + '<th>Unit Price</th>'
        + '<th>Total Price</th>'
        + '<th>Sold</th>'
        + '<th>Remove</th>'
        + '</tr>'
        + '</thead>');
    table = $('#table').DataTable({
        "columnDefs": [
             {
                 "orderable": false,
                "targets": -2,
                 "data": null,
                 "width": "1%",
                 "defaultContent": '<button type="button" class="btn btn-success sold" data-toggle="modal" data-target="#more_info">Sold</button>'
             },
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
