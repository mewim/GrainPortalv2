$(document).ready(function () {
    load_info();
});

/*
 * Validate user change.
 * @param user: information of the user we are creating.
 * @return {success: Boolean, message: String, user: user object}
 */
function validateUserInfo(user) {
    if (!user.firstName) {
        return {success: false, message: 'First name cannot be empty.'};
    }
    if (!validator.isAlpha(user.firstName)) {
        return {success: false, message: 'First name can contain only letters.'};
    }

    if (!user.lastName) {
        return {success: false, message: 'Last name cannot be empty.'};
    }
    if (!validator.isAlpha(user.lastName)) {
        return {success: false, message: 'Last name can contain only letters.'};
    }

    if (user.city) {
        if (!validator.isAlpha(user.city)) {
            return {success: false, message: 'City can contain only letters.'};
        }
    }

    if (user.state) {
        if (!validator.isAlpha(user.state)) {
            return {success: false, message: 'State can contain only letters.'};
        }
    }

    if (user.zipCode) {
        if (!validator.isNumeric(user.zipCode)) {
            return {success: false, message: 'Zip code can contain only numbers.'};
        }
    }

    if (user.email) {
        if (!validator.isEmail(user.email)) {
            return {success: false, message: 'Invalid e-mail address.'};
        }
        else {
            user.email = user.email.toLowerCase();
        }
    }
    return {success: true, message: null};
}

function load_info() {
    var username = currentUser.get("username");
    $("#username").html(username);

    var phoneNumber = currentUser.get("phoneNumber");
    $("#phoneNumber").html(phoneNumber);

    var firstName = currentUser.get("firstName");
    $("#firstName").val(firstName);

    var lastName = currentUser.get("lastName");
    $("#lastName").val(lastName);

    var country = currentUser.get("country");
    $("#country").html(country);

    var state = currentUser.get("state");
    if(state){
        $("#state").val(state);
    }

    var city = currentUser.get("city");
    if(city){
        $("#city").val(city);
    }

    var address = currentUser.get("address");
    if (address) {
        $("#address").val(address);
    }

    var zipCode =  currentUser.get("zipCode");
    if (zipCode) {
        $("#zipCode").val(zipCode);
    }

    var email =  currentUser.get("email");
    if (email) {
        $("#email").val(email);
    }
}

function save(){
    $("#alert").html('');
    var user ={};
    user.firstName = $('#firstName').val();
    user.lastName = $('#lastName').val();
    user.state = $('#state').val();
    user.city = $('#city').val();
    user.address = $('#address').val();
    user.zipCode = $('#zipCode').val();
    user.email = $("#email").val();

    var validate_user = validateUserInfo(user);
    if(validate_user.success){
        currentUser.set("firstName", user.firstName);
        currentUser.set("lastName", user.lastName);
        currentUser.set("state", user.state);
        currentUser.set("city", user.city);
        currentUser.set("address", user.address);
        currentUser.set("zipCode", user.zipCode);
        currentUser.set("email", user.email);
        currentUser.save(null, {
            success: function (currentUser) {
                // Execute any logic that should take place after the object is saved.
                $("#alert").html('<br>' + green_alert('Your user profile is successfully updated.'));
            },
            error: function (currentUser, error) {
                $("#alert").html('<br>' + red_alert('Your user profile cannot be updated, please try again later.'));
            }
        });
    }
    else{
        $("#alert").html('<br>' + red_alert(validate_user.message));
    }
}