$(document).ready(function() {
	$(".delete-button").click(function(e) {
		$(this).parent().fadeOut("fast");
	});
});

function deletePost(id) {
	$.get("/deletePost/"+id, function(response) {
		alert(response);
	});	
};