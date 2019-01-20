$(function () {
    chrome.storage.local.get(function(obj) {
	if ("summary_number" in obj) {
	    $("input[name='summary_number']").val(obj.summary_number);
	}
	if ("minimum_length" in obj) {
	    $("input[name='minimum_length']").val(obj.minimum_length);
	}
	if ("lang" in obj) {
	    $("select[name='lang']").val(obj.lang);
	}
	if ("separator" in obj) {
	    $("select[name='separator']").val(obj.separator);
	}

	$("#register").on("click", function() {
	    update_settings();
	});
    });
});

function update_settings() {
    alert("updated");
    let obj = {};
    obj.summary_number = $("input[name='summary_number']").val();
    obj.minimum_length = $("input[name='minimum_length']").val();
    obj.lang = $("select[name='lang']").val();
    obj.separator = $("select[name='separator']").val();
    chrome.storage.local.set(obj, function(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {type: "update"}, null);
	});
  });
}

