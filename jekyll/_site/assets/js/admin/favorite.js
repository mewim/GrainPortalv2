var FarmerProfile = Parse.Object.extend("User");

var table = null;
var detail = null;
var report_dict = {};
var current_user; // current farmer actually, anyway = =+
let DEBUG = true;

$(document).ready(function () {
	load_reports();
});


function load_reports() {
	var query = new Parse.Query(FarmerProfile);
	query.equalTo("userType", 1);
	query.equalTo("favorite", true);
	query.ascending("firstName");
	query.find({
		success: function (results) {
							 create_dict(results);
							 create_table(results);
		},
		error: function (error) {
			$("#table-wrapper").html(red_alert("Cannot load listings, please try again later."));
		}
	});
}

function create_dict(results) {
	for (var i = 0; i < results.length; ++i){
		var curr_report = results[i];
		report_dict[curr_report.id] = curr_report;
	}
}

function create_detail(id){
	target = report_dict[id];
	$('#detail-wrapper').html(
			'<table id="detail-table" class = "table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
			+ '<thead>'
			+ '<tr>'
			+ '<th>The</th>'
			+ '<th>Profile</th>'
			+ '</tr>'
	);
	detail = $('#detail-table').DataTable({
		"columnDefs": [
			{
				"targets": [0, 1],
				"defaultContent": "Unknown",
			},
		],
	});
	detail.row.add(["Address", target.get("address")]);
	detail.draw(false);
	detail.row.add(["Phone Number", target.get("phoneNumber")]);
	detail.draw(false);
	detail.row.add(["Email", target.get("email")]);
	detail.draw(false);

}

function create_table(results) {
	$('#table-wrapper').html(
			'<table id="table" class = "table table-striped table-bordered table-hover" cellspacing="0" width="100%">'
			+ '<thead>'
			+ '<tr>'
			+ '<th>Profile ID</th>'
			+ '<th>First Name</th>'
			+ '<th>Last Name</th>'
			+ '<th>City</th>'
			+ '<th>State</th>'
			+ '<th>Country</th>'
			+ '<th>Phone</th>'
			+ '<th>Email</th>'
			+ '<th>Detail</th>'
			+ '<th>Contact</th>'
			+ '</tr>'
	);
	table = $('#table').DataTable({
		"columnDefs": [
		  {
				"targets": [0],
				"visible": false,
				"searchable": false,
			},
			{
				"orderable":false,
				"targets": -2,
				"data":null,
				"width": "1%",
				"defaultContent":'<button type="button" class="btn btn-primary detail">Get Detail</button>',
			},
			{
				"orderable": false,
				"targets":-1,
				"data":null,
				"width": "1%",
				"defaultContent": '<button type="button" class="btn btn-success contact" data-toggle="modal" data-target="#more_info">Contact Farmer</button>',
			},
			{
				"targets": [1, 2, 3, 4, 5, 6, 7],
				"defaultContent": "Unknown",
			},
		],
	});

	for (var i = 0; i < results.length; ++i){
		var curr_report = results[i];
		table.row.add(
			[
				curr_report.id,
				curr_report.get('firstName'),
				curr_report.get('lastName'),
				curr_report.get('city'),
				curr_report.get('state'),
				curr_report.get('country'),
				curr_report.get('phoneNumber'),
				curr_report.get('email'),
			]
		);
		table.draw(false);
	}
	handle_buttons_click();
}

function handle_buttons_click() {
    $('.detail').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        show_detail(id);
    });
    $('.contact').click(function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var id = data[0];
        contact_clicked(id);
    });
    $('.goback').click(function () {
			toggleview();
			load_reports();
    });
}

function button_load(){

	var button = $('a');
	if (DEBUG == true){
		console.log("func button_load start");
	}
	if (current_user.get("favorite") == true){
		$("#a").removeclass('glyphicon-star-empty');
		$("#a").addclass('glyphicon-star');
		if (DEBUG) {
			console.log("icon off!");
		}
	} else {
		$("#a").removeClass('glyphicon-star');
		$("#a").addClass('glyphicon-star-empty');
		if (DEBUG) {
			console.log("icon on!");
		}
	}
}

// temp-flip-button
// still a unqiue one
// we need a deeper logic behind this
function button_toggle(){

	var button = $('a');
	if (DEBUG == true){
		console.log("func button_toggle start");
	}
	if (current_user.get("favorite") == true){
		current_user.set("favorite", false);
		button.attr("glyphicon-star", "glyphicon-star-empty")
		$("#a").removeClass('glyphicon-star');
		$("#a").addClass('glyphicon-star-empty');
		if (DEBUG) {
			console.log("icon off!");
		}
	} else {
		current_user.set("favorite", true);
		$("#a").removeClass('glyphicon-star-empty');
		$("#a").addClass('glyphicon-star');
		if (DEBUG) {
			console.log("icon on!");
		}
	}

	current_user.save();

	if (DEBUG == true){
		console.log("func button_toggle end");
	}
}


function show_detail(id){
    var target = report_dict[id];
    if (target) {
			current_user = target;
			if (DEBUG) {
				console.log("current_user");
				console.log(current_user);
			}
			hard_code_selfile(id);
			$(".tableview").toggle();
			$(".detailview").toggle();
			$("#detail_header").html(
				'<h1 class="page-header" id="detail_header">'
				+ target.get("firstName") + " " + target.get("lastName")
				+	'<button type="button" class="btn btn-info favorite-button" id="favorite-button" onclick="button_toggle()" >'
				+			'<span class="glyphicon glyphicon-star-empty" id="a" ></span>'
				+			'Favorite'
				+	'</button>'
				+'</h1>'
			);
			button_load();
			create_detail(id);
    }
}

function hard_code_selfile(id){
	var target = report_dict[id];
	var email = target.get("email");
	console.log(email);
	if (email == "cliu81@illinois.edu"){
		$("#selfile-img").attr("src", "/assets/img/special_selfile.png");
	}
	if (email == "kwu18@illinois.edu"){
		$("#selfile-img").attr("src", "/assets/img/special_selfile.jpg");
	}
}

function toggleview(){
			$(".tableview").toggle();
			$(".detailview").toggle();
			$('#detail-wrapper').html("wkl");
			detail = null;
}


function contact_clicked(id){
    $("#contact-info").html(blue_alert("Send a message to farmer."));
    $("#submit_message").val(id);
    $("#submit_message").show();
    var listing = report_dict[id];
    if(!listing){
        $("#contact-info").html(red_alert("Invalid listing. Please try to refresh the webpage."));
        $("#submit_message").hide();
        return;
    }
    $('#message').val(
          "Hello, My name is "
        + currentUser.get("firstName")
        +" "
        + currentUser.get("lastName")
        + "."
    );
}

function submit_message(){
    var id = $("#submit_message").val();
    var content = $('#message').val();
    if(!content){
        $('#contact-info').html(red_alert("Please enter your message to send."));
        return;
    }
    var listing = report_dict[id];
    if(!listing){
        $("#contact-info").html(red_alert("Invalid listing. Please try to refresh the webpage."));
        $("#submit_message").hide();
        return;
    }
    var seller_username = listing.get("username");
    var message = {type: 2, content:content, username:seller_username};
    $.ajax({
        url: '/send_message',
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'POST',
        data: JSON.stringify(message),
        success: function (result) {
            if (result.success) {
                $("#contact-info").html(green_alert('Your message is sent to farmer.'));
            }
            else{
                $("#contact-info").html(red_alert(result.message));
            }
        },
        error: function (xhr, status, error) {
            $("#contact-info").html(('Network error. Please try again later.'));
        }
    });
}
