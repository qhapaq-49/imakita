
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
	"id": "IMAKITA",
	"title": "IMAKITA Summarizer",
	"type": "normal",
	"contexts": ["selection"],
    });
});

chrome.storage.local.set({"lang":"auto", "summary_number":5, "minimum_length":2, "separator":". 。 ．"}, null);

chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.storage.local.get(function(obj) {
	var summary_number = 3;
	var minimum_length = 5;
	var separator = [".","。"];
	var lang = "auto";
	var summary = [];
	summary_number = obj.summary_number;
	minimum_length = obj.minimum_length;
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
	    for(var i=0; i<summary.length; ++i){
		summary_alert += "-> " + summary[i] +".\n\n";
	    }
	    alert(summary_alert);
	}else{
	    chrome.tabs.sendMessage(tab.id, {"command":"summarize", "lang":lang, "summary_number":summary_number, "minimum_length":minimum_length, "separator":separator});
	}
    });
});
