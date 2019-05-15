
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
    if (msg.command == 'summarize'){
	//alert("fall");
	var summary = [];
	// summarize and push
	if (msg.lang == "ja"){
	    summary = preproc_ja(window.getSelection().toString(), msg.summary_number, msg.minimum_length, msg.separator);
	}else if(msg.lang == "zh"){
	    summary = preproc_zh(window.getSelection().toString(), msg.summary_number, msg.minimum_length, msg.separator);
	}else if(msg.lang == "de"){
	    summary = preproc_en(window.getSelection().toString(), msg.summary_number, msg.minimum_length, not_word_array_de, msg.separator);
	}else if(msg.lang == "es"){
	    summary = preproc_en(window.getSelection().toString(), msg.summary_number, msg.minimum_length, not_word_array_es, msg.separator);
	}else if(msg.lang == "fr"){
	    summary = preproc_en(window.getSelection().toString(), msg.summary_number, msg.minimum_length, not_word_array_fr, msg.separator);
	}else{
	    summary = preproc_en(window.getSelection().toString(), msg.summary_number, msg.minimum_length, not_word_array_en, msg.separator);
	}
	summary_alert = "Language : " + msg.lang +"\n";
	//alert(msg.title);
	var clip = msg.title+"\n";
	    
	for(var i=0; i<summary.length; ++i){
	    summary_alert += "-> " + summary[i] +".\n\n";
	    clip += summary[i] +".\n";
	}
	if (msg.copy_clipboard){
	    saveToClipboard(clip);
	}
	if (!msg.no_alert){
	    alert(summary_alert);
	}

	fill(summary);
    }
});


function saveToClipboard(str) {
    var textArea = document.createElement("textarea");
    textArea.style.cssText = "position:absolute;left:-100%";
    document.body.appendChild(textArea);
    textArea.value = str;
    textArea.select();
    document.execCommand("copy");
    //alert("copied" +textArea.value);    
    document.body.removeChild(textArea);
}
