var counter = function(str,seq){
    return str.split(seq).length - 1;
}

function lang_detect(str){
    var lang_names = [
	"ja",
	"en",
	"de",
	"es",
	"fr",
    ]
    var counts = [
	counter(str,/は|を|が|に/g), // ja
	counter(str,/\sthe\s|\sa\s|\san\s|\sThe\s|\sA\s|An\s/g), // en
	counter(str,/\sder\s|\sdas\s|\sdie\s|\sist\s|\sbist\s|\ser\s/g), // de
	counter(str,/\sel\s|\sla\s|\slos\s|\slas\s|\slo\s|\ses\s/g), // es
	counter(str,/\sle\s|\sla\s|\sles\s|\sil\s|\sils\s|\ssont\s/g), // fr
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
