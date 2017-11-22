$(document).ready(function () {
    hide_loader();
});

function hide_loader() {
	console.log("haha");
	$('#valuechain-container').html('');
	$('#valuechain-content').html('<iframe src = "https://grainportal-blog.herokuapp.com/"></iframe>');
}