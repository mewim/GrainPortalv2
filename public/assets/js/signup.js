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
      city: {
        identifier: 'city',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your city'
        }]
      },
      state: {
        identifier: 'state',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your state'
        }]
      },
      zipcode: {
        identifier: 'zipcode',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your zipcode'
        }]
      },
      password1: {
        identifier: 'password1',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your password again to confirm'
        }]
      },
      address: {
        identifier: 'address',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your address'
        }]
      },
      email: {
        identifier: 'email',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your e-mail'
        }, {
          type: 'email',
          prompt: 'Please enter a valid e-mail'
        }]
      },
      firstname: {
        identifier: 'firstname',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your firstname'
        }, ]
      },
      email: {
        identifier: 'email',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your e-mail'
        }, {
          type: 'email',
          prompt: 'Please enter a valid e-mail'
        }]
      },
      lastname: {
        identifier: 'lastname',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your lastname'
        }, ]
      },
      password: {
        identifier: 'password',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your password'
        }, {
          type: 'length[8]',
          prompt: 'Your password must be at least 8 characters'
        }]
      }
    }
  });
});

  function submit_form(fields){
    console.log(fields);
    var user = new Parse.User();
    user.set("username", fields.username.toLowerCase());
	//shu add userid
	user.set("userid",fields.userid);
    user.set("password", fields.password);
    user.set("email", fields.email.toLowerCase());
    user.set("firstName", fields.first_name);
    user.set("lastName", fields.last_name);
    user.set("address", fields.address);
    user.set("city", fields.city);
    user.set("state", fields.state);
    user.set("zipCode", fields.zipcode);
  // Other fields can be set just like with Parse.Object
  user.signUp(null, {
    success: function(user) {
      console.log('Success');
    },
    error: function(user, error) {
      console.log(arguments)
      // Show the error message somewhere and let the user try again.
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