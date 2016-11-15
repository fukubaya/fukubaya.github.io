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
        fill_style: function(){return $('#colorpicker').spectrum('get').toHex();},
        text_align: function(){return $('input[name="align"]:checked').val();},
        text_valign: function(){return $('input[name="valign"]:checked').val();},
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
      $('#font_size').change(function(){drawtext.draw();});
      $('#font_name').change(function(){drawtext.draw();});
      $('input[name="align"]').change(function(){drawtext.draw();});
      $('input[name="valign"]').change(function(){drawtext.draw();});
      $('#chk_bold').change(function(){drawtext.draw();});
      $('#chk_italic').change(function(){drawtext.draw();});
      $('#num_column').change(function(){drawtext.draw();});
      $('#colorpicker').change(function(){drawtext.draw();});
      $('#btn_refresh').click(function(){drawtext.draw();});

      // 初期
      change_image();
    };
    // カラーピッカー
    $('#colorpicker').spectrum({
      showPaletteOnly: true,
      togglePaletteOnly: true,
      togglePaletteMoreText: 'more',
      togglePaletteLessText: 'less',
      hideAfterPaletteSelect:true,
      color: '#666',
      palette: [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
      ]
    });

    // 画像リストの取得
    $.ajax({
      dataType: "json",
      url: "./js/imglist.json",
      success: init,
      error: function(a, b, c){console.log(a); console.log(b); console.log(c);}
    });

  });
}());
