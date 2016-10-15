$(document)
.ready(function() {
  var currentUser = Parse.User.current();
  if (currentUser) {
    // Change username on topbar and show page.
    $("#header_username").text(currentUser.getUsername());
    $('body').show();
  } else {
    // Go to the login page.
    window.location = '/login';
  }
});