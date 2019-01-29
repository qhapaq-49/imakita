var counter = function(str,seq){
    return str.split(seq).length - 1;
}

function lang_detect(str){
    var lang_names = [
	"ja",
	"en",
    ]
    var counts = [
	counter(str,/は|を|が|に/g), // ja
	counter(str,/\sthe\s|\sa\s|\san\s|\sThe\s|\sA\s|An\s/g), // en
    ];

    var maxc = -1;
    var maxid = -1;
    for(var i=0;i<counts.length;++i){
	if (counts[i]>maxc){
	    maxc = counts[i];
	    maxid = i;
	}
    }
    //console.log(counts);
    //console.log(lang_names[maxid]);
    return lang_names[maxid];
}

lang_detect("我々は宇宙人である");
lang_detect("This is a pen and that is the pen");
