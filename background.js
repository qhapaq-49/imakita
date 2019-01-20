
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
	"id": "IMAKITA",
	"title": "IMAKITA Summarizer",
	"type": "normal",
	"contexts": ["selection"],
    });
});



chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.storage.local.get(function(obj) {
	var summary_number = 3;
	var minimum_length = 5;
	var separator = [".","。"];
	var lang = "en";
	summary_number = obj.summary_number;
	minimum_length = obj.minimum_length;
	// group of separator is given by text split by " ".
	// it is very bad hack...
	separator = obj.separator.split(" ");
	alert(separator);
	lang = obj.lang;
	// not so good solution ....
	if(info.selectionText.length < 20){
	    if(tab.id>=0){
		chrome.tabs.sendMessage(tab.id, {"command":"useall"});
	    }else{
		alert("failed to auto selection of text");
	    }
	    return;
	}

	//getinfo();
	
	// summarize and push
	if (lang == "ja"){
	    summary = preproc_ja(info.selectionText, summary_number, minimum_length, separator);
	}else{
	    summary = preproc_en(info.selectionText, summary_number, minimum_length, separator);
	}
	summary_alert = "";
	for(var i=0; i<summary.length; ++i){
	    summary_alert += "-> " + summary[i] +".\n\n";
	}

	alert(summary_alert);
	if(tab.id>=0){
	    chrome.tabs.sendMessage(tab.id, {"command":"fill", "summary":summary});
	}else{
	    // alert("failed to fill the document");
	}
    });
});
