var Notification = Parse.Object.extend("Notification");
var FarmerReport = Parse.Object.extend("FarmerReport");
var Sensor = Parse.Object.extend("Sensor");

function count_notification(){
    var query = new Parse.Query(Notification);
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("archived", false);
    query.count({
        success: function (count) {
            $('#notification-count').html(count);
        },
        error: function (error) {
        }
    });
}

function count_report(){
    var query = new Parse.Query(FarmerReport);
    query.equalTo("username", currentUser.get('username'));
    query.count({
        success: function (count) {
            $('#report-count').html(count);
        },
        error: function (error) {
        }
    });
}

function count_listing(){
    var query = new Parse.Query(FarmerReport);
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("listed", true);
    query.equalTo("sold", false);
    query.count({
        success: function (count) {
            $('#listing_count').html(count);
        },
        error: function (error) {
        }
    });
}

function count_sensor(){
    var query = new Parse.Query(Sensor);
    query.equalTo("username", currentUser.get('username'));
    query.count({
        success: function (count) {
            $('#sensor_count').html(count);
        },
        error: function (error) {
        }
    });
}

function load_report(){
    var query = new Parse.Query(FarmerReport);
    query.equalTo("username", currentUser.get('username'));
    query.descending("createdAt");
    query.limit(10);
    query.find({
        success: function (result) {
            result.reverse();
            var graph_data = [];
            for(var i = 0; i < result.length; ++i){
                graph_data[i] = {
                  id: result[i].get("digitalID"),
                  date: result[i].get("createdAt"),
                  quantity: result[i].get("quantity")
                };
            }
            draw_yields(graph_data);
        },
        error: function (error) {
        }
    });
}
function draw_yields(graph_data){
    $('#yield_graph').html('');
    $('#yield_graph').height(400);
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'yield_graph',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: graph_data,
        // The name of the data record attribute that contains x-values.
        xkey: 'date',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['quantity'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Quantity'],

        xLabelFormat : function (x) {return moment(x.src.date).format('MM/DD/YYYY'); },

        parseTime:false,

        resize: true
    });
}

$(document).ready(function () {
    count_notification();
    count_report();
    count_listing();
    count_sensor();
    load_report();
});