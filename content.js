
function fill(summary){
    let color = "#ffff00";
    let colorf = "#000000";
    for(var i=0; i<summary.length; ++i){
	var txt = $("body").text();
	//alert(summary[i]);
	//alert(txt.indexOf(summary[i]));
	$("body").highlight(summary[i]);
    }
    $(".highlight-ext").css("background-color", color);
    $(".highlight-ext").css("color", colorf);
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command == 'useall'){
	// looks not so good
	summary = preproc_en($("body").text());
	alert(summary);
	fill(summary);
    }
    if (msg.command == 'fill') {
	fill(msg.summary);
    }
    //sendResponse();
});
