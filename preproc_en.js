
function preproc_en(text, summary_number, word_list_minimum, not_word_array, separator){
    // https://qiita.com/alucky0707/items/10052866719ba5c5f5d7
    var not_word = not_word_array.reduce(function(m, a, i) {
	m[a] = (m[a] || []).concat(i);
	return m;
    }, {});
    
    var word_weight = {};
    var sens_list = [];
    // separator (bad hack...)
    for(var i=0; i<separator.length; ++i){
	if(separator[i]=="n"){
	    text =text.replace(/\r?\n/g, ".");
	}else{
	    text =text.replace(separator[i], ".");
	}
    }

    var sentences = text.split(".");
    // set word_weight and list
    for(var i=0; i<sentences.length; ++i){
	var word_list_temp = sentences[i].split(" ");
	var sens = {"id":i, "word_list":[], "importance":0};
	for (var j=0; j< word_list_temp.length; ++j){
	    if (word_list_temp[j].length <2 ){continue;}
	    if (!(word_list_temp[j].toLowerCase() in not_word)){
		sens["word_list"].push(word_list_temp[j].toLowerCase());
	    }
	}
	for (var j=0; j< sens["word_list"].length; ++j){
	    if (sens["word_list"][j] in word_weight){
		word_weight[sens["word_list"][j]] += 1;
	    }else{
		word_weight[sens["word_list"][j]] = 1;
	    }
	}
	sens_list.push(sens);
    }
    
    set_importance(sens_list, word_weight, word_list_minimum);
    // console.log(sentences);
    // console.log(sens_list);
    // console.log(word_weight);
    var summary_id = binary_search(sens_list, word_weight, summary_number, 5);
    //console.log(summary_id);
    var summary_txt = []
    for (var i=0; i<summary_id.length; ++i){
	summary_txt.push(sentences[summary_id[i]].replace(/^[\s\n]+/g, "").replace(/[\s\n]+$/g, ""));
    }
    // console.log(summary_txt);
    return summary_txt;
}
