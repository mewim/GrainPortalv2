function signup() {
    $("#alert").html('');
    var user = {};
    user.username = $('#username').val();
    user.userType = parseInt($('#userType option:selected').val());
    var phoneNumber = $('#phoneNumber').val();
    phoneNumber = phoneNumber.split(')').join('');
    phoneNumber = phoneNumber.split('(').join('');
    phoneNumber = phoneNumber.split('-').join('');
    if (!phoneNumber || isNaN(phoneNumber)) {
        $("#alert").html('<br>' + red_alert('Please enter a valid phone number.'));
        return;
    }

    user.firstName = $('#firstName').val();
    user.lastName = $('#lastName').val();
    if ($('#country option:selected').val() === 'US') {
        user.country = 'United States';
        user.phoneNumber = '+1' + phoneNumber;
    }
    else if ($('#country option:selected').val() === 'IN') {
        user.country = 'India';
        user.phoneNumber = '+91' + phoneNumber;
    }
    var city = $('#city').val();
    if (city) {
        user.city = city;
    }
    var state = $('#state').val();
    if (state) {
        user.state = state;
    }
    var address = $('#address').val();
    if (address) {
        user.address = address;
    }
    var zipCode = $('#zipCode').val();
    if (zipCode) {
        user.zipCode = zipCode;
    }
    var email = $('#email').val();
    if (email) {
        user.email = email;
    }
    $.ajax({
        url: '/userapi/create',
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'POST',
        data: JSON.stringify(user),
        success: function (result) {
            if (result.success) {
                $("#alert").html('<br>' + green_alert('Your username and password is sent to your phone, please login ' + '<a href="/login">here</a>' + '.'));
            }
            else{
                $("#alert").html('<br>' + red_alert(result.message));
            }
        },
        error: function (xhr, status, error) {
            $("#alert").html('<br>' + red_alert('Network error. Please try again later.'));
        }
    });
}