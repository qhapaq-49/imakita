
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

function preproc_en(text, word_list_minimum){
    var not_word_array = ["reuters","ap","jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec","tech","news","index","mon","tue","wed","thu","fri","sat","'s","a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","amid","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","e.g.","eight","either","else","elsewhere","enough","entirely","especially","et","etc","etc.","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","i.e.","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","knows","known","l","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","mr.","ms.","much","must","my","myself","n","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero"];
    // https://qiita.com/alucky0707/items/10052866719ba5c5f5d7
    var not_word = not_word_array.reduce(function(m, a, i) {
	m[a] = (m[a] || []).concat(i);
	return m;
    }, {});
    
    var word_weight = {};
    var sens_list = [];
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
    
    // give importance
    for(var i=0; i<sentences.length; ++i){
	for (var j=0; j< sens_list[i]["word_list"].length; ++j){
	    var ww = word_weight[sens_list[i]["word_list"][j]];
	    sens_list[i]["importance"] += ww;
	}
	// is it right?
	if(sens_list[i]["word_list"].length > 0){
	    sens_list[i]["importance"] = sens_list[i]["importance"] / sens_list[i]["word_list"].length;
	}
	if (sens_list[i]["word_list"].length < word_list_minimum){
	    sens_list[i]["importance"] = 0;
	}
    }
    // sort

    sens_list.sort(function(a,b){
	if(a.importance>b.importance) return -1;
	if(a.importance<b.importance) return 1;
	return 0;
    });
    
    // console.log(sentences);
    // console.log(sens_list);
    // console.log(word_weight);
    var summary_id = binary_search(sens_list, word_weight, 5, 5);
    //console.log(summary_id);
    var summary_txt = []
    for (var i=0; i<summary_id.length; ++i){
	summary_txt.push(sentences[summary_id[i]]);
    }
    // console.log(summary_txt);
    return summary_txt;
}
