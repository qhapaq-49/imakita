
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
	console.log("warning : binary search failed");
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
    console.log(sens_list);
    // console.log(word_weight);
    var summary_id = binary_search(sens_list, word_weight, 5, 5);
    //console.log(summary_id);
    var summary_txt = []
    for (var i=0; i<summary_id.length; ++i){
	summary_txt.push(sentences[summary_id[i]]);
    }
    console.log(summary_txt);
}


preproc_en("I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity.But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself an exile in his own land. And so we've come here today to dramatize a shameful condition.In a sense we've come to our nation's capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the unalienable Rights of Life, Liberty and the pursuit of Happiness. It is obvious today that America has defaulted on this promissory note, insofar as her citizens of color are concerned. Instead of honoring this sacred obligation, America has given the Negro people a bad check, a check which has come back marked insufficient funds.But we refuse to believe that the bank of justice is bankrupt. We refuse to believe that there are insufficient funds in the great vaults of opportunity of this nation. And so, we've come to cash this check, a check that will give us upon demand the riches of freedom and the security of justice.We have also come to this hallowed spot to remind America of the fierce urgency of Now. This is no time to engage in the luxury of cooling off or to take the tranquilizing drug of gradualism. Now is the time to make real the promises of democracy. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial justice. Now is the time to lift our nation from the quicksands of racial injustice to the solid rock of brotherhood. Now is the time to make justice a reality for all of God's children.It would be fatal for the nation to overlook the urgency of the moment. This sweltering summer of the Negro's legitimate discontent will not pass until there is an invigorating autumn of freedom and equality. Nineteen sixty-three is not an end, but a beginning. And those who hope that the Negro needed to blow off steam and will now be content will have a rude awakening if the nation returns to business as usual. And there will be neither rest nor tranquility in America until the Negro is granted his citizenship rights. The whirlwinds of revolt will continue to shake the foundations of our nation until the bright day of justice emerges.But there is something that I must say to my people, who stand on the warm threshold which leads into the palace of justice: In the process of gaining our rightful place, we must not be guilty of wrongful deeds. Let us not seek to satisfy our thirst for freedom by drinking from the cup of bitterness and hatred. We must forever conduct our struggle on the high plane of dignity and discipline. We must not allow our creative protest to degenerate into physical violence. Again and again, we must rise to the majestic heights of meeting physical force with soul force.The marvelous new militancy which has engulfed the Negro community must not lead us to a distrust of all white people, for many of our white brothers, as evidenced by their presence here today, have come to realize that their destiny is tied up with our destiny. And they have come to realize that their freedom is inextricably bound to our freedom.We cannot walk alone.And as we walk, we must make the pledge that we shall always march ahead.We cannot turn back.There are those who are asking the devotees of civil rights, When will you be satisfied? We can never be satisfied as long as the Negro is the victim of the unspeakable horrors of police brutality. We can never be satisfied as long as our bodies, heavy with the fatigue of travel, cannot gain lodging in the motels of the highways and the hotels of the cities. We cannot be satisfied as long as the negro's basic mobility is from a smaller ghetto to a larger one. We can never be satisfied as long as our children are stripped of their self-hood and robbed of their dignity by a sign stating: For Whites Only. We cannot be satisfied as long as a Negro in Mississippi cannot vote and a Negro in New York believes he has nothing for which to vote. No, no, we are not satisfied, and we will not be satisfied until justice rolls down like waters, and righteousness like a mighty stream.I am not unmindful that some of you have come here out of great trials and tribulations. Some of you have come fresh from narrow jail cells. And some of you have come from areas where your quest -- quest for freedom left you battered by the storms of persecution and staggered by the winds of police brutality. You have been the veterans of creative suffering. Continue to work with the faith that unearned suffering is redemptive. Go back to Mississippi, go back to Alabama, go back to South Carolina, go back to Georgia, go back to Louisiana, go back to the slums and ghettos of our northern cities, knowing that somehow this situation can and will be changed.Let us not wallow in the valley of despair, I say to you today, my friends - so even though we face the difficulties of today and tomorrow, I still have a dream. It is a dream deeply rooted in the American dream.I have a dream that one day this nation will rise up and live out the true meaning of its creed: We hold these truths to be self-evident, that all men are created equal.I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood.I have a dream that one day even the state of Mississippi, a state sweltering with the heat of injustice, sweltering with the heat of oppression, will be transformed into an oasis of freedom and justice.I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.I have a dream today!I have a dream that one day, down in Alabama, with its vicious racists, with its governor having his lips dripping with the words of interposition and nullification -- one day right there in Alabama little black boys and black girls will be able to join hands with little white boys and white girls as sisters and brothers.I have a dream today!I have a dream that one day every valley shall be exalted, and every hill and mountain shall be made low, the rough places will be made plain, and the crooked places will be made straight, and the glory of the Lord shall be revealed and all flesh shall see it together.This is our hope, and this is the faith that I go back to the South with.With this faith, we will be able to hew out of the mountain of despair a stone of hope. With this faith, we will be able to transform the jangling discords of our nation into a beautiful symphony of brotherhood. With this faith, we will be able to work together, to pray together, to struggle together, to go to jail together, to stand up for freedom together, knowing that we will be free one day.And this will be the day -- this will be the day when all of God's children will be able to sing with new meaning:My country 'tis of thee, sweet land of liberty, of thee I sing.Land where my fathers died, land of the Pilgrim's pride,From every mountainside, let freedom ring!And if America is to be a great nation, this must become true.And so let freedom ring from the prodigious hilltops of New Hampshire.Let freedom ring from the mighty mountains of New York.Let freedom ring from the heightening Alleghenies of Pennsylvania.Let freedom ring from the snow-capped Rockies of Colorado.Let freedom ring from the curvaceous slopes of California.But not only that:Let freedom ring from Stone Mountain of Georgia.Let freedom ring from Lookout Mountain of Tennessee.Let freedom ring from every hill and molehill of Mississippi.From every mountainside, let freedom ring.And when this happens, when we allow freedom ring, when we let it ring from every village and every hamlet, from every state and every city, we will be able to speed up that day when all of God's children, black men and white men, Jews and Gentiles, Protestants and Catholics, will be able to join hands and sing in the words of the old Negro spiritual:Free at last! Free at last!Thank God Almighty, we are free at last!", 3);
