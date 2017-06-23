var Notification = Parse.Object.extend("Notification");
var count = 0;

function hide_loader() {
    $('#message-container').html('');
}

function add_notification(notification) {

    var id = notification.id;
    var date = moment(notification.createdAt).format('MMM Do, HH:mm');
    var content = notification.get('content');
    var raw_type = notification.get('type');
    var type = '';

    switch (raw_type) {
        case 1:
            type = 'Researcher Notification';
            break;
        case 2:
            type = 'Trading Notification';
            break;
        case 3:
            type = 'Sensor Alert';
            break;
        case 4:
            type = 'Other';
            break;
        default:
            break;
    }

    var notification_html = '<div class="panel panel-default">'
        + '<div class="panel-heading">'
        + '<div class="row">'
        + '<div class="col-xs-3">'
        + '<div>'
        + date
        + '</div>'
        + '</div>'
        + '<div class="col-xs-9 text-right">'
        + '<div>'
        + type
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="panel-body">'
        + '<p>'
        + content
        + '</p>'
        + '</div>'
        + '</div>';
    $('#message-container').append(notification_html);
}

function load_notifications() {
    var query = new Parse.Query(Notification);
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("archived", true);
    query.descending("createdAt");
    query.find({
        success: function (results) {
            count = results.length;
            if (count === 0) {
                hide_loader();
                $('#info').html(blue_alert('There is no notification to display.'));
            }
            else {
                hide_loader();
                display_notifications(results);
            }
        },
        error: function (error) {
            hide_loader();
            $("#info").html(red_alert('Cannot load notifications. Please try again later.'));
        }
    });
}

function display_notifications(results) {
    for (var i = 0; i < results.length; ++i) {
        add_notification(results[i]);
    }
}

$(document).ready(function () {
    load_notifications();
});