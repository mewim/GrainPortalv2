var Question = Parse.Object.extend("Question");
var table = null;

function submit() {
    var question = $('#question').val();
    if (!question) {
        $("#alert").html(red_alert('Please enter your question.'));
        return;
    }
    var new_question = new Question();
    new_question.set("question", question);
    new_question.set("username", currentUser.get('username'));
    new_question.set("solved", false);
    $("#alert").html(blue_alert('Submitting your question. Please wait.'));
    new_question.save(null, {
        success: function (new_question) {
            // Execute any logic that should take place after the object is saved.
            $("#alert").html(green_alert('Your question is submitted.'));
        },
        error: function (new_question, error) {
            $("#alert").html(red_alert('Your question cannot be submitted. Please try again later.'));
        }
    });
}

function reset() {
    $("#alert").html(blue_alert('Submit your question to the university. A researcher will answer it as soon as possible.'));
    $('#question').val('');
}

$(document).ready(function () {
});