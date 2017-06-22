var Question = Parse.Object.extend("Question");
var count = 0;

function hide_loader() {
    $('#question-container').html('');
}

function add_question(question) {
    var id = question.id;
    var date = moment(question.createdAt).format('MMM Do, HH:mm');
    var content = question.get('question');

    var question_html = '<div class="panel panel-default"'
        + 'id="'
        + id
        + '">'
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
        + '<button class="btn btn-success answer" data-toggle="modal" data-target="#more_info" value="'
        + id
        + '">Answer</button>'
        + '</div>'
        + '</div>';
    $('#question-container').append(question_html);
}

function load_questions() {
    var query = new Parse.Query(Question);
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

function submit_answer(){
    var id = $("#submit_answer").val();
    
    var content = $('#answer-text').val();
    if(!content){
        $('#answer-info').html(red_alert("Please enter your message to send."));
        return;
    }
    var query = new Parse.Query(Question);
    query.get(id, {
        success: function (question) {
            $("#submit_answer").hide();
            question.set("answer", content);
            question.set("solved", true);
            question.save(null, {
                success: function (new_question) {
                    // Execute any logic that should take place after the object is saved.
                    $("#answer-info").html(green_alert('Your answer is submitted.'));
                    $('#' + id).remove();
                },
                error: function (new_question, error) {
                    $("#answer-info").html(red_alert('Your answer cannot be submitted. Please try again later.'));
                    $("#submit_answer").show();
                }
            });
        },
        error: function (question, error) {
            $("#answer-info").html(red_alert('Your answer cannot be submitted. Please try again later.'));
        }
    });
}

// function answer_question(button) {
//     console.log('try');
//     // var id = (button.val());
//     // var query = new Parse.Query(Question);
//     // query.get(id, {
//     //     success: function (question) {
//     //         question.destroy({
//     //             success: function (myObject) {
//     //                 $(button).parent().parent().remove();
//     //                 count = count - 1;
//     //                 if (count === 0) {
//     //                     $('#info').html(blue_alert('There is no question to display.'));
//     //                 }
//     //             },
//     //             error: function (question, error) {
//     //             }
//     //         });
//     //     },
//     //     error: function (question, error) {
//     //     },
//     // });
// }

function answer_clicked(id){
    $("#answer-info").html(blue_alert("Type the answer below."));
    $("#submit_answer").val(id);
    $("#submit_answer").show();
    $('#answer-text').val("");
}


function display_questions(results) {
    for (var i = 0; i < results.length; ++i) {
        add_question(results[i]);
    }
    $('.answer').click(function () {
        var id = $(this).val();
        answer_clicked(id);
    });
}

$(document).ready(function () {
    load_questions();
});