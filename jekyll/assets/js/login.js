$(document)
.ready(function() {
  $('.ui.form')
  .form({
    onSuccess: function(event, fields) {
      event.preventDefault();
      submit_form(fields);
    },
    fields: {
      username: {
        identifier: 'username',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your username'
        }]
      },
      password: {
        identifier  : 'password',
        rules: [
        {
          type   : 'length[8]',
          prompt : 'Your password must be at least 8 characters'
        }
        ]
      }
    }
  });
});

function submit_form(fields){
    console.log(fields);
    Parse.User.logIn(fields.username.toLowerCase(), fields.password, {
      success: function(user) {
        // Do stuff after successful login.
        console.log('Success');
        window.location = '/';
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        $(".ui.error.message").empty().append(
          $('<ul class="list">').append(
            $('<li>').append(
              error.message
              )
            )
          ).show();
      }
  });
}