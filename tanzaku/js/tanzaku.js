/*
 * tanzaku.js
 * 
 * Created by FUKUBAYASHI Yuichiro on 2012/07/06
 * Copyright (c) 2012, FUKUBAYASHI Yuichiro
 *
 * last update: <2016/07/11 00:56:20>
 */

TANZAKU = {
  N_PER_LINE:26,
  N_LINE:2,
  
  hankaku:new Array("ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾁﾞ",
		        "ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","ｦ","ｧ",
		        "ｨ","ｩ","ｪ","ｫ","ｬ","ｭ","ｮ","ｯ","ｰ","ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ",
		        "ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ",
		        "ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ﾝ"),
  zenkaku:new Array("ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ",
		          "ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","ヲ","ァ",
		          "ィ","ゥ","ェ","ォ","ャ","ュ","ョ","ッ","ー","ア","イ","ウ","エ","オ","カ",
		          "キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ",
		          "ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ",
		          "ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ン"),
  hankaku2: new Array("1","2","3","4","5","6","7","8","9","0",
                      "`","~","!","@","#","$","%","^","&","*",
                      "(",")","-","_","=","+","[","{","}","]",
                      "|",";",":",",","<",".",">","/","?"
                     ),
  zenkaku2: new Array("一","二","三","四","五","六","七","八","九","〇",
                      "｀","〜","！","＠","＃","＄","％","＾","＆","＊",
                      "（","）","−","＿","＝","＋","［","｛","｝","］",
                      "｜","；","：","，","＜","．","＞","／","？"
                     ),
  u2a: function(u_str){
      var u_str_no_fe0f = u_str.replace(/\uFE0F/g,"");
      var array = u_str_no_fe0f.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g);
      return  array === null ? [] : array;
  },

  getTanzaku : function(org_txt){
    var onegai = org_txt;
    onegai = onegai.replace(/[A-Za-z]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 65248);
    });
    while(onegai.match(/[ｦ-ﾝ1234567890\~!@#\$%\^&\*()\-_=+\[\]{}|;:,<.>/?]/)){
      for(var i=0;i<TANZAKU.hankaku.length;i++){
        onegai = onegai.replace(TANZAKU.hankaku[i],TANZAKU.zenkaku[i]);
      }
      for(var i=0;i<TANZAKU.hankaku2.length;i++){
        onegai = onegai.replace(TANZAKU.hankaku2[i],TANZAKU.zenkaku2[i]);
      }
    }
    onegai = onegai.replace(/[ー−―‐〜〜〜]/g, "｜");
    onegai = onegai.replace(/ /g, "　");
    onegai = onegai.replace(/[｛（［「]/g,"⏠");
    onegai = onegai.replace(/[｝）］」]/g,"⏡");

    var lines = onegai.split(/\n/);
    var n_per_line = 0;


    for(var i=0;i<lines.length;i++){
      lines[i] = TANZAKU.u2a(lines[i]);
    }

    for(var i=0;i<lines.length;i++){
	if(lines[i].length>n_per_line){
        n_per_line = lines[i].length;
      }
    }

    var tanzaku = "┏";
    var half_n_lines=Math.floor((lines.length-1)/2);

    for(var i=0; i<half_n_lines; i++){
      tanzaku += "━";
    }
    tanzaku += "┷";
    for(var i=0; i<lines.length-1-half_n_lines;i++){
      tanzaku += "━";
    }

    tanzaku += "┓\n";
    
    for(var i=0;i<n_per_line;i++){
      
      tanzaku+="┃";
      for(var j=lines.length-1;j>=0;j--){
        tanzaku += (lines[j][i] === undefined ? "　" : lines[j][i]);
      }
      
      tanzaku+="┃\n";
    }
    tanzaku += "╰̚";
    for(var i=0;i<lines.length;i++){
      tanzaku += "━";
    }
    tanzaku += "┛⁾⁾";
    
    return tanzaku;
  }  
};
