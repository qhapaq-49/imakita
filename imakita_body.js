
function product(word_list1, word_list2, word_weight){
    var prod = 0;
    for(var i=0; i<word_list1.length; ++i){
	var inc = word_weight[word_list1[i]] * word_weight[word_list1[i]];
	for(var j=0; j<word_list2.length; ++j){
	    if(word_list1[i] == word_list2[j]){
		prod += inc;
	    }
	}
    }
    return prod;
}

// weighted dissimilarity between sentences
function weighted_dissimilarity(word_list1, word_list2, word_weight){
    if (word_list1.length == 0 || word_list2.length == 0){
	return 0;
    }
    var prod11 = product(word_list1, word_list1, word_weight);
    var prod22 = product(word_list2, word_list2, word_weight);
    var prod12 = product(word_list1, word_list2, word_weight);
    // is it right?
    var cos12 = prod12 / Math.sqrt(0.1 + prod11 * prod22);
    return Math.sqrt(prod11 * prod22 * (1-cos12*cos12)) / word_list1.length / word_list2.length;
}

function greedy_search(threshold, sens_list, word_weight, summary_number, search_ratio){
    var output = [];
    for(var i=0; i<Math.min(sens_list.length, summary_number * search_ratio); ++i){
	var isok = true;
	for(var j=0; j<output.length; ++j){
	    var d = weighted_dissimilarity(
		sens_list[output[j]]["word_list"],
		sens_list[i]["word_list"],
		word_weight
	    );
	    if (d < threshold){
		isok = false;
		break;
	    }
	}
	if (isok){
	    output.push(i);
	}
	// finished
	if (output.length >= summary_number){
	    break;
	}
    }
    return output;
}

function binary_search(sens_list, word_weight, summary_number, search_ratio){
    var threshold = sens_list[0]["importance"] * sens_list[0]["importance"] / 2;
    var step = threshold / 2;
    var output = greedy_search(0, sens_list, word_weight, summary_number, search_ratio);
    var isok = false;
    for (var i=0; i<20; ++i){
	var res = greedy_search(threshold, sens_list, word_weight, summary_number, search_ratio);
	if (res.length < summary_number){
	    //console.log("binary fail " + threshold);
	    threshold -= step;
	}else{
	    isok = true;
	    //console.log("binary ok " + threshold);
	    threshold += step;
	    output = res;
	}
	step = step / 2;
	if( step < 0.1 ){
	    break;
	}
    }
    if (!isok){
	// console.log("warning : binary search failed");
    }

    // convert sorted id to id in the document
    summary = []
    for (var i=0; i<output.length; ++i){
	summary.push(sens_list[output[i]]["id"]);
    }
    // sort
    summary.sort(function(a,b){
        if( a < b ) return -1;
        if( a > b ) return 1;
        return 0;
    });
    return summary;
}
