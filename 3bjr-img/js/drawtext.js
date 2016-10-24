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
    var lines = this.get_text().split("\n");

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
