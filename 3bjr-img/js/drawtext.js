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

  function DrawText(conf){
    this.canvas = conf.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.img = conf.img || null;
    this.debug = conf.debug || false;

    this.get_font_size = to_function(conf.font_size || 12);
    this.get_font = to_function(conf.font || '"Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", Meiryo, メイリオ, Osaka, "MS PGothic", arial, helvetica, sans-serif');
    this.enable_bold = to_function(conf.bold || false);
    this.enable_italic = to_function(conf.italic || false);
    this.get_fill_style = to_function(conf.fill_style || "#000000");
    this.get_text_align = to_function(conf.text_align || "left");
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
    var lines = this.get_text().split("\n");

    var w_top = this.topright.x - this.topleft.x;
    var h_left = this.bottomleft.y - this.topleft.y;
    var h_right = this.bottomright.y - this.topright.y;

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

    // measure text width of each line
    var lines_width = [];
    for(var i = 0; i < lines.length; i++){
      lines_width.push(this.ctx.measureText(lines[i]).width);
    }

    // draw texts
    for(var i = 0; i < lines.length; i++){
      var line_left_y = this.topleft.y + (i * font_size * 1.2);
      var line_right_y = this.topright.y + (i * font_size * 1.2) * (h_right/h_left);
      var line_left_x = this.topleft.x - (i * font_size * 1.2) * (this.topleft.x - this.bottomleft.x)/h_left;
      var line_right_x = this.topright.x - (i * font_size * 1.2) * (this.topright.x - this.bottomright.x)/h_left;

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
        (line_right_y - line_left_y)/w_top,
        (this.bottomleft.x - this.topleft.x)/h_left,
        1.0,
        offset_x,
        offset_y
      );

      this.ctx.fillText(lines[i], 0, 0, w_top * lines_width[i] / Math.max.apply(null, lines_width));
      this.ctx.restore();
    }
    this.ctx.restore();

    if(this.debug){
      this.ctx.strokeStyle = "red";
      this.ctx.stroke();
    }

    if(this.img){
      this.img.src = this.canvas.toDataURL();
    }
  };
  DrawText.prototype.set_image = function(img){
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

  if("process" in global){
    module["exports"] = DrawText;
  }
  global["DrawText"] = DrawText;

})((this || 0).self || global);
