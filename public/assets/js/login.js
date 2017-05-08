function login() {
    $("#alert").html('');
    var username = $("#username").val();
    var password = $("#password").val();
    if (!username) {
        $("#alert").html('<br>' + red_alert('Please enter your username.'));
    }
    else if (!password || password.length < 8) {
        $("#alert").html('<br>' + red_alert('Your password must be at least 8 characters.'));
    }
    else {
        Parse.User.logIn(username.toLowerCase(), password, {
            success: function (user) {
                // Do stuff after successful login.
                var userType = user.get("userType");
                if (userType === 1) {
                    window.location = '/farmer/';
                }
                else if (userType === 2) {
                    window.location = '/trader/';
                }
                else if (userType === 0) {
                    window.location = '/admin/';
                }
            },
            error: function (user, error) {
                // The login failed. Check error to see why.
                $("#alert").html('<br>' + red_alert(error.message));
            }
        });
    }
}

function reset() {
    $("#alert").html('');
    var username = $("#username").val();
    if (!username) {
        $("#alert").html('<br>' + red_alert('Please enter your username.'));
    }
    $.ajax({
        url: '/userapi/request_new',
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'POST',
        data: JSON.stringify({username: username}),
        success: function (result) {
            if (result.success) {
                $("#alert").html('<br>' + green_alert(result.message));
            }
            else {
                $("#alert").html('<br>' + red_alert(result.message));
            }
        },
        error: function (xhr, status, error) {
            $("#alert").html('<br>' + red_alert('Network error. Please try again later.'));
        }
    });
}