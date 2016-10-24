/*
* 3bjr-img.js
*
* Created by FUKUBAYASHI Yuichiro on 2016/06/23
* Copyright (c) 2016, FUKUBAYASHI Yuichiro
*
*/
(function(){
  $(document).ready(function(){
    // JSON読み込み完了後に実行
    var init = function(data){
      // 設定
      var conf = {
        canvas: $('#canvas')[0],
        img: $('#canvas_img')[0],
        font_size: function(){return parseInt($('#font_size option:selected').val());},
        font: function(){return $('#font_name option:selected').val();},
        bold: function(){return $('#chk_bold').prop('checked');},
        column: function(){return parseInt($('#num_column option:selected').val());},
        italic: function(){return $('#chk_italic').prop('checked');},
        fill_style: function(){return $('#font_color').val();},
        text_align: function(){return $('input[name="align"]:checked').val();},
        get_text: function(){return $('#textarea').val();},
        debug: false,
        imglist: data.imglist
      };

      // モジュール
      var drawtext = new DrawText(conf);

      // 画像のリスト
      for(var i = 0; i<conf.imglist.length; i++){
        $('#base_img').append("<option>" + conf.imglist[i].label + "</option>");
      }

      // 画像の変更
      var change_image = function(){
        var index = $('#base_img')[0].selectedIndex;
        drawtext.set_image(conf.imglist[index]);
      };

      // canvasの更新
      $('#base_img').change(function(){change_image();});
      $('#textarea').keypress(function(){drawtext.draw();});
      $('#textarea').keyup(function(){drawtext.draw();});
      $('#font_size').change(function(){drawtext.draw();});
      $('#font_name').change(function(){drawtext.draw();});
      $('input[name="align"]').change(function(){drawtext.draw();});
      $('#chk_bold').change(function(){drawtext.draw();});
      $('#chk_italic').change(function(){drawtext.draw();});
      $('#num_column').change(function(){drawtext.draw();});
      $('#font_color').change(function(){drawtext.draw();});

      // 初期
      change_image();
    };

    // 画像リストの取得
    $.ajax({
      dataType: "json",
      url: "./js/imglist.json",
      success: init,
      error: function(a, b, c){console.log(a); console.log(b); console.log(c);}
    });

  });
}());
