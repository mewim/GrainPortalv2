var Question = Parse.Object.extend("Question");

function hide_loader() {
    $('#question-container').html('');
}

function add_question(question) {
    var date = moment(question.createdAt).format('MMM Do, HH:mm');
    var content = question.get('question');
    var answer = question.get('answer');
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
        +'<hr>'
        + '</p>'
        + '<b>Answer: </b>'
        + '<p>'
        + answer
        + '</p>'
        + '</div>'
        + '</div>';
    $('#question-container').append(question_html);
}

function load_questions() {
    var query = new Parse.Query(Question);
    query.equalTo("username", currentUser.get('username'));
    query.equalTo("solved", true);
    query.descending("updatedAt");
    query.find({
        success: function (results) {
            var count = results.length;
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


function display_questions(results) {
    for (var i = 0; i < results.length; ++i) {
        add_question(results[i]);
    }
}

$(document).ready(function () {
    load_questions();
});