$(document).ready(function () {
    hide_loader();
});

function hide_loader() {
	$('#valuechain-content').html('<iframe src = "https://grainportal-blog.herokuapp.com/"></iframe>');
	$('#valuechain-container').html('');
}