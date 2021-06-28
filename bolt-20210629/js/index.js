/*
 * index.js
 * 
 * Created by FUKUBAYASHI Yuichiro on 2021/06/29
 * Copyright (c) 2021, FUKUBAYASHI Yuichiro
 *
 * last update: <2021/06/29 02:38:56>
 */
$(document).ready(function(){
  var get_text = function() {
    var name = $('#name').val();
    var m1 = $('#m1 option:selected').val();
    var m2 = $('#m2 option:selected').val();
    var m3_m6 = $('input:radio[name="m3-m6"]:checked').val().split(",");
    var m7_m9 = $('input:radio[name="m7-m9"]:checked').val().split(",");
    var m10_m12 = $('input:radio[name="m10-m12"]:checked').val().split(",");
    var m13_m14 = $('input:radio[name="m13-m14"]:checked').val().split(",");
    var m15 = $('input:radio[name="m15"]:checked').val();

    var text_list = [
      "2021/06/29(火)",
      "B.O.L.T Your Choice Online Live",
      "ニコニコ生放送",
      "",
      "M1 " + m1,
      "M2 " + m2,
      "MC"
    ].concat(m3_m6)
        .concat(["MC"])
        .concat(m7_m9)
        .concat(["MC"])
        .concat(m10_m12)
        .concat(["アンコール"])
        .concat(m13_m14)
        .concat([m15, "", "(予想: " + name + ")"]);

    return text_list.join("\n");
  };

  var conf = {
    canvas: $('#canvas')[0],
    img: $('#canvas_img')[0],
    font_size: 40,
    column: 2,
    bold: true,
    fill_style: "#000",
    get_text: get_text,
    debug: false
  };

  var drawtext = new DrawText(conf);

  var init = function(){
    drawtext.set_image({
      "src": "img/base.jpg",
      "topleft": {"x":20, "y": 20},
      "topright": {"x":1780, "y": 20},
      "bottomleft": {"x": 20, "y": 670},
      "bottomright": {"x": 1780, "y": 670}      
    });

    $('#btn_refresh').click(function(){
      drawtext.draw();
    });
  };

  init();
});
