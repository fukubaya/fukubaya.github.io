/*
* drawtext.js
*
* Created by FUKUBAYASHI Yuichiro
* Copyright (c) 2016, FUKUBAYASHI Yuichiro
*
*/
(function(global){
  "use strict";

  var clear_canvas = function(canvas, ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  var to_function = function(obj){
    if(typeof(obj) == "function"){
      return obj;
    }
    return function(){return obj;};
  }

  var intl_div = function(p, q, m, n){
    return {x: (n * p.x + m * q.x) / (m + n),
            y: (n * p.y + m * q.y) / (m + n)};
  };

  function DrawText(conf){
    this.canvas = conf.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.img = conf.img || null;
    this.debug = conf.debug || false;

    this.get_font_size = to_function(conf.font_size || 12);
    this.get_font = to_function(conf.font || '"Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", Meiryo, メイリオ, Osaka, "MS PGothic", arial, helvetica, sans-serif');
    this.get_column = to_function(conf.column || 1);
    this.enable_bold = to_function(conf.bold || false);
    this.enable_italic = to_function(conf.italic || false);
    this.get_fill_style = to_function(conf.fill_style || "#000000");
    this.get_text_align = to_function(conf.text_align || "left");
    this.get_text_valign = to_function(conf.text_valign || "horizontal");
    this.get_text = to_function(conf.get_text);

    this.imagedata = null;
    this.topleft = 0;
    this.topright = 0;
    this.bottomleft = 0;
    this.bottomright = 0;
  };

  DrawText.prototype.draw = function(){
    clear_canvas(this.canvas, this.ctx);

    var font_size = this.get_font_size();
    var line_height = font_size * 1.2;
    var num_column = this.get_column();
    var text = this.get_text();
    if(this.get_text_valign() == "vertical"){
      text = getTategaki(text);
    }
    var lines = text.split("\n");

    var w_top = this.topright.x - this.topleft.x;
    var h_left = this.bottomleft.y - this.topleft.y;

    this.ctx.drawImage(this.imagedata, 0, 0);
    this.ctx.fillStyle = this.get_fill_style();
    this.ctx.font = this.get_font_size() + "px " + this.get_font();
    if(this.enable_bold()){
      this.ctx.font = "bold " + this.ctx.font;
    }
    if(this.enable_italic()){
      this.ctx.font = "italic " + this.ctx.font;
    }
    this.ctx.textBaseline = 'top';

    this.ctx.textAlign = this.get_text_align();
    this.ctx.save();

    // cliping path
    this.ctx.beginPath();
    this.ctx.moveTo(this.topleft.x, this.topleft.y);
    this.ctx.lineTo(this.topright.x, this.topright.y);
    this.ctx.lineTo(this.bottomright.x, this.bottomright.y);
    this.ctx.lineTo(this.bottomleft.x, this.bottomleft.y);
    this.ctx.closePath();
    this.ctx.clip();
    if(this.debug){
      this.ctx.strokeStyle = "red";
      this.ctx.stroke();

      // line column
      for(var i = 0; i < num_column - 1 ; i++){
        var c_top = intl_div(this.topleft, this.topright, i + 1, num_column - i - 1);
        var c_bottom = intl_div(this.bottomleft, this.bottomright, i + 1, num_column - i - 1);
        this.ctx.beginPath();
        this.ctx.moveTo(c_top.x, c_top.y);
        this.ctx.lineTo(c_bottom.x, c_bottom.y);
        this.ctx.stroke();
      }
    }

    // measure text width of each line
    var lines_width = [];
    for(var i = 0; i < lines.length; i++){
      lines_width.push(this.ctx.measureText(lines[i]).width);
    }

    // max lines per column
    var lines_per_column = Math.floor(h_left/line_height);

    // column width
    var w_column = w_top/num_column;

    // draw texts
    for(var i = 0; i < lines.length; i++){
      var col = Math.floor(i/lines_per_column);
      var row = i % lines_per_column;
      var column_p = {
        topleft: intl_div(this.topleft, this.topright, col, num_column - col),
        topright: intl_div(this.topleft, this.topright, col + 1, num_column - col - 1),
        bottomleft: intl_div(this.bottomleft, this.bottomright, col, num_column - col),
        bottomright: intl_div(this.bottomleft, this.bottomright, col + 1, num_column - col - 1)
      };
      var column_h_right = column_p.bottomright.y - column_p.topright.y;
      var column_h_left = column_p.bottomleft.y - column_p.topleft.y;

      var line_left_y = column_p.topleft.y + (row * line_height);
      var line_right_y = column_p.topright.y + (row * line_height) * (column_h_right/column_h_left);
      var line_left_x = column_p.topleft.x - (row * line_height) * (column_p.topleft.x - column_p.bottomleft.x)/column_h_left;
      var line_right_x = column_p.topright.x - (row * line_height) * (column_p.topright.x - column_p.bottomright.x)/column_h_left;

      var offset_x = line_left_x;
      var offset_y = line_left_y;
      if(this.ctx.textAlign == 'center'){
        offset_x = (line_left_x + line_right_x) / 2;
        offset_y = (line_left_y + line_right_y) / 2;
      }else if(this.ctx.textAlign == 'right'){
        offset_x = line_right_x;
        offset_y = line_right_y;
      }

      this.ctx.save();
      this.ctx.transform(
        1.0,
        (line_right_y - line_left_y)/(w_top/num_column),
        (column_p.bottomleft.x - column_p.topleft.x)/column_h_left,
        1.0,
        offset_x,
        offset_y
      );

      this.ctx.fillText(lines[i], 0, 0, ((w_top - font_size * 0.5)/ num_column) * lines_width[i] / Math.max.apply(null, lines_width));
      this.ctx.restore();
    }
    this.ctx.restore();

    if(this.img){
      this.img.src = this.canvas.toDataURL();
    }
  };
  DrawText.prototype.set_image = function(img){
    if(this.imagedata !== null && this.imagedata.src == img.src){
      this.draw();
      return;
    }
    this.imagedata = new Image();
    this.imagedata.src = img.src;
    this.topleft = img.topleft;
    this.topright = img.topright;
    this.bottomleft = img.bottomleft;
    this.bottomright = img.bottomright;
    var drawtext = this;
    this.imagedata.onload = function(){
      drawtext.canvas.width = this.width;
      drawtext.canvas.height = this.height;
      drawtext.draw();
    };
  };

  var hankaku = new Array("ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾁﾞ",
  		                    "ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","ｦ","ｧ",
  		                    "ｨ","ｩ","ｪ","ｫ","ｬ","ｭ","ｮ","ｯ","ｰ","ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ",
  		                    "ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ",
  		                    "ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ﾝ");
  var zenkaku = new Array("ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ",
  		                        "ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ","ヲ","ァ",
  		                        "ィ","ゥ","ェ","ォ","ャ","ュ","ョ","ッ","ー","ア","イ","ウ","エ","オ","カ",
  		                        "キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ",
  		                        "ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ",
  		                        "ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ン");
  var hankaku2 = new Array("1","2","3","4","5","6","7","8","9","0",
                          "`","~","!","@","#","$","%","^","&","*",
                          "(",")","-","_","=","+","[","{","}","]",
                          "|",";",":",",","<",".",">","/","?");
  var zenkaku2 = new Array("１","２","３","４","５","６","７","８","９","０",
                          "｀","〜","！","＠","＃","＄","％","＾","＆","＊",
                          "（","）","−","＿","＝","＋","［","｛","｝","］",
                          "｜","；","：","，","＜","．","＞","／","？");

  // 半角を全角に変換する
  var han2zen = function(org_txt){
    var zenkaku_txt = org_txt;
    zenkaku_txt = zenkaku_txt.replace(/[A-Za-z]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 65248);
    });
    while(zenkaku_txt.match(/[ｦ-ﾝ1234567890\~!@#\$%\^&\*()\-_=+\[\]{}|;:,<.>/?]/)){
      for(var i=0;i<hankaku.length;i++){
        zenkaku_txt = zenkaku_txt.replace(hankaku[i], zenkaku[i]);
      }
      for(var i=0;i<hankaku2.length;i++){
        zenkaku_txt = zenkaku_txt.replace(hankaku2[i],zenkaku2[i]);
      }
    }
    zenkaku_txt = zenkaku_txt.replace(/[ー−―‐〜〜〜]/g, "｜");
    zenkaku_txt = zenkaku_txt.replace(/ /g, "　");
    zenkaku_txt = zenkaku_txt.replace(/[｛（［「]/g,"⏠");
    zenkaku_txt = zenkaku_txt.replace(/[｝）］」]/g,"⏡");
    return zenkaku_txt;
  };

  // 絵文字入り文字列の処理
  var u2a = function(u_str){
    var u_str_no_fe0f = u_str.replace(/\uFE0F/g,"");
    var array = u_str_no_fe0f.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g);
    return  array === null ? [] : array;
  };

  // 縦書きに変換
  var getTategaki = function(org_txt){
    var zenkaku_txt = han2zen(org_txt);
    var lines = zenkaku_txt.split(/\n/);

    for(var i=0;i<lines.length;i++){
      lines[i] = u2a(lines[i]);
    }

    var n_per_line = 0;  // 1行あたりの文字数
    for(var i=0;i<lines.length;i++){
      if(lines[i].length>n_per_line){
        n_per_line = lines[i].length;
      }
    }

    var tategaki = "";
    for(var i=0;i<n_per_line;i++){
      for(var j=lines.length-1;j>=0;j--){
        tategaki += (lines[j][i] === undefined ? "　" : lines[j][i]);
      }
      tategaki+="\n";
    }
    return tategaki;
  };


  if("process" in global){
    module["exports"] = DrawText;
  }
  global["DrawText"] = DrawText;

})((this || 0).self || global);
