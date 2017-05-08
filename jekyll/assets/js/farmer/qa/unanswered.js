var Question = Parse.Object.extend("Question");
var count = 0;

function hide_loader() {
    $('#question-container').html('');
}

function add_question(question) {
    var id = question.id;
    var date = moment(question.createdAt).format('MMM Do, HH:mm');
    var content = question.get('question');

    var question_html = '<div class="panel panel-default">'
        + '<div class="panel-heading">'
        + '<div class="row">'
        + '<div class="col-xs-3">'
        + '<div>'
        + date
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="panel-body">'
        + '<b>Question: </b>'
        + '<p>'
        + content
        + '</p>'
        + '<button class="btn btn-danger delete" value="'
        + id
        + '">Delete</button>'
        + '</div>'
        + '</div>';
    $('#question-container').append(question_html);
}

function load_questions() {
    var query = new Parse.Query(Question);
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("solved", false);
    query.descending("createdAt");
    query.find({
        success: function (results) {
            count = results.length;
            if (count === 0) {
                hide_loader();
                $('#info').html(blue_alert('There is no question to display.'));
            }
            else {
                hide_loader();
                display_questions(results);
            }
        },
        error: function (error) {
            hide_loader();
            $("#info").html(red_alert('Cannot load questions. Please try again later.'));
        }
    });
}

function delete_question(button) {
    var id = (button.val());
    var query = new Parse.Query(Question);
    query.get(id, {
        success: function (question) {
            question.destroy({
                success: function (myObject) {
                    $(button).parent().parent().remove();
                    count = count - 1;
                    if (count === 0) {
                        $('#info').html(blue_alert('There is no question to display.'));
                    }
                },
                error: function (question, error) {
                }
            });
        },
        error: function (question, error) {
        },
    });
}

function display_questions(results) {
    for (var i = 0; i < results.length; ++i) {
        add_question(results[i]);
    }
    $('.delete').click(function () {
        delete_question($(this));
    });
}

$(document).ready(function () {
    load_questions();
});