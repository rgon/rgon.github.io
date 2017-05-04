//Usage: 
//onScrollDown($("header.header2"), $(".headerTriggerElement"));
function onScrollDown(targetElement, triggerElement, customClass, updateRate) {
    console.log("OnScrollDown: Element Set Up.");
	$("body").on("scroll", function() {
		//Reduce calculations and thus increase performance
		if(!updateRate)
			updateRate = 600;
		if(!customClass)
			customClass = "scrolled";
		
		setTimeout(function() {
			if(parseInt($(document).scrollTop()) >= parseInt(triggerElement.offset().top)) {
                console.log("OnScrollDown: Triggered.");
				targetElement.addClass(customClass);
			} else {
				targetElement.removeClass(customClass);
			}
		}, updateRate);
	});
}