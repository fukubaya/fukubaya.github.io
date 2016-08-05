/*
* mincho.js
*
* Created by FUKUBAYASHI Yuichiro
* Copyright (c) 2016, FUKUBAYASHI Yuichiro
*
*/
(function(global){
  "use strict";

  var get_font = function(font_size){
    return font_size + 'px "HGP平成明朝体W9", "HGS平成明朝体W9", "HGP平成明朝体W9", "平成明朝", "游明朝", "Yu Mincho", "游明朝体", "YuMincho", "ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "HiraMinProN-W3", "HGS明朝E", "ＭＳ Ｐ明朝", "MS PMincho", serif';
  };

  var clear_canvas = function(canvas, ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function DrawMincho(conf){
    // canvas
    this.canvas = conf.canvas;

    // context
    this.ctx = this.canvas.getContext('2d');

    // canvasで描画した結果を画像に変換した結果を表示するimg
    this.img = conf.img;

    // フォントサイズを取得する関数
    this.get_font_size = conf.get_font_size;

    // 描画するテキストを取得する関数
    this.get_text = conf.get_text;

    // ベースとなる画像データ
    this.imagedata = null;

    // 画像の幅，高さの上限値
    this.img_w_upper = conf.img_w_upper;
    this.img_h_upper = conf.img_h_upper;
  };

  DrawMincho.prototype.draw = function(){
    var font_size = this.get_font_size();
    var font_color = "#ffffff";
    var lines = this.get_text().split("\n");
    var padding_bottom = font_size * 0.5;
    var line_height = font_size * 1.05;

    clear_canvas(this.canvas, this.ctx);

    // 画像の描画
    this.ctx.drawImage(this.imagedata, 0, 0,
      this.canvas.width, this.canvas.height);

    // テキスト描画の設定
    this.ctx.fillStyle = font_color;
    this.ctx.font = get_font(font_size);
    this.ctx.textBaseline = 'bottom';
    this.ctx.textAlign = "center";
    this.ctx.save();

    // テキストの描画
    for(var i = 0; i < lines.length; i++){
      this.ctx.fillText(
        lines[i],
        canvas.width/2,
        canvas.height - padding_bottom - ((lines.length - i - 1) * line_height),
        canvas.width);
    }
    this.ctx.restore();

    // imgに画像データをdataスキームで渡す
    this.img.src = this.canvas.toDataURL();
  };

  DrawMincho.prototype.set_image = function(imgurldata){
    // 画像をセットする
    this.imagedata = new Image();
    this.imagedata.src = imgurldata;

    // 以下のイベントハンドラ内に渡すために変数に渡す
    var _this = this;

    // 画像の読み込みが完了したら実行
    this.imagedata.onload = function(){
      // 幅，高さの上限を越さないように計算
      var w_scale = 1.0;
      var h_scale = 1.0;
      if(this.width > _this.img_w_upper){
        w_scale = _this.img_w_upper / this.width;
      }
      if(this.height > _this.img_h_upper){
        h_scale = _this.img_h_upper / this.height;
      }
      var scale = w_scale < h_scale ? w_scale : h_scale;
      _this.canvas.width = this.width * scale;
      _this.canvas.height = this.height * scale;

      // 描画
      _this.draw();
    };
  };

  if("process" in global){
    module["exports"] = DrawMincho;
  }
  global["DrawMincho"] = DrawMincho;

})((this || 0).self || global);
