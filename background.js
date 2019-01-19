
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
	"id": "IMAKITA",
	"title": "IMAKITA Summarizer",
	"type": "normal",
	"contexts": ["selection"],
    });    
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    // not so good solution ....
    if(info.selectionText.length < 10){
	if(tab.id>=0){
	    chrome.tabs.sendMessage(tab.id, {"command":"useall"});
	}else{
	    alert("failed to auto selection of text");
	}
	return;
    }

    // summarize and push
    summary = preproc_en(info.selectionText);
    alert(summary);
    if(tab.id>=0){
	chrome.tabs.sendMessage(tab.id, {"command":"fill", "summary":summary});
    }else{
	// alert("failed to fill the document");
    }
});
