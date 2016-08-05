/*
* main.js
*
* Created by FUKUBAYASHI Yuichiro
* Copyright (c) 2016, FUKUBAYASHI Yuichiro
*
*/
(function(global){
  "use strict";

  $(document).ready(function(){
    var conf = {
      canvas: $('#canvas')[0],
      img: $('#canvas_img')[0],
      get_font_size: function(){return parseInt($('#font_size option:selected').val());},
      get_text: function(){return $('#textarea').val();},
      img_w_upper: 768,
      img_h_upper: 543
    };

    var drawmincho = new DrawMincho(conf);

    $('#base_img').change(function(e){
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(){
        drawmincho.set_image(reader.result);
      };
    });
    $('#btn_draw').click(function(){drawmincho.draw();});

  });
})((this || 0).self || global);
