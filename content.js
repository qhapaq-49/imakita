
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
    //alert("fill");
    if (msg.command == 'summarize'){
	//alert("fall");
	var summary = [];
	// summarize and push
	if (msg.lang == "ja"){
	    summary = preproc_ja(window.getSelection().toString(), msg.summary_number, msg.minimum_length, msg.separator);
	}else{
	    summary = preproc_en(window.getSelection().toString(), msg.summary_number, msg.minimum_length, msg.separator);
	}
	summary_alert = "Language : " + msg.lang +"\n";
	for(var i=0; i<summary.length; ++i){
	    summary_alert += "-> " + summary[i] +".\n\n";
	}
	alert(summary_alert);	
	fill(summary);
    }
    //sendResponse();
});
