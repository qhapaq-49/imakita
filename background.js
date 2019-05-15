
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


chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
	"id": "IMAKITA",
	"title": "IMAKITA Summarizer",
	"type": "normal",
	"contexts": ["selection"],
    });
    chrome.storage.local.set({"lang":"auto", "summary_number":5, "minimum_length":2, "separator":". 。 ．", "no_alert":false, "copy_clipboard":true}, null);
});



chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.storage.local.get(function(obj) {
	var summary_number = 3;
	var minimum_length = 5;
	var separator = [".","。"];
	var lang = "auto";
	var summary = [];
	var no_alert=false;
	var copy_clipboard=true;
	summary_number = obj.summary_number;
	minimum_length = obj.minimum_length;
	no_alert = obj.no_alert;
	copy_clipboard = obj.copy_clipboard;
	// group of separator is given by text split by " ".
	// it is very bad hack...
	separator = obj.separator.split(" ");
	
	var lang_in = obj.lang;
	if (lang_in == "auto"){
	    lang = lang_detect(info.selectionText);
	}else{
	    lang = lang_in;
	}
	if(tab.id < 0){
	    // summarize and push
	    if (lang == "ja"){
		summary = preproc_ja(info.selectionText, summary_number, minimum_length, separator);
	    }else if(lang == "zh"){
		summary = preproc_zh(info.selectionText, summary_number, minimum_length, separator);
	    }else if(lang == "de"){
		summary = preproc_en(info.selectionText, summary_number, minimum_length, not_word_array_de, separator);
	    }else if(lang == "es"){
		summary = preproc_en(info.selectionText, summary_number, minimum_length, not_word_array_es, separator);
	    }else if(lang == "fr"){
		summary = preproc_en(info.selectionText, summary_number, minimum_length, not_word_array_fr, separator);
	    }else{
		summary = preproc_en(info.selectionText, summary_number, minimum_length, not_word_array_en, separator);
	    }
	    summary_alert = "Language : " + lang +"\n";
	    var clip = tab.title + "\n";
	    for(var i=0; i<summary.length; ++i){
		summary_alert += "-> " + summary[i] +".\n\n";
		clip += summary[i]+"\n";
	    }
	    if(!no_alert){
		alert(summary_alert);
	    }
	    if(copy_clipboard){
		saveToClipboard(clip);
	    }
	}else{
	    chrome.tabs.sendMessage(tab.id, {"command":"summarize", "lang":lang, "summary_number":summary_number, "minimum_length":minimum_length, "separator":separator,"title":tab.title + " " + tab.url,"no_alert":no_alert, "copy_clipboard":copy_clipboard});
	}
    });
});

