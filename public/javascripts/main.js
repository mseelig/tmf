
$(document).ready(function() {
	
	$("#quit").bind("click", UICallbacks.quit); // when the quit button is clicked

	// function for when the window is resized
	$(window).bind('resize', UICallbacks.resizeWindowMain).trigger('resize');
});
