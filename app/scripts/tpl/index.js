/*TMODJS:{"version":43,"md5":"e184869691a1d9d84d3a5843ca2ffde6"}*/
define(function(require) {
    return require("./template")("index", function($data) {
        "use strict";
        var $utils = this, $each = ($utils.$helpers, $utils.$each), lists = $data.lists, $escape = ($data.value, 
        $data.index, $utils.$escape), $out = ($data.$value, $data.$index, "");
        return $out += '<div class="slider-container" id="slider-container"> ', $each(lists, function(value, index) {
            $out += ' <div data-index="', $out += $escape(index), $out += '" class="slider-item ', 
            $out += $escape(index > 0 ? "" : "active"), $out += '"> <a class="jump" href="', 
            $out += $escape(value.storm), $out += '"> ', 1 == value.img_status ? ($out += ' <img src="', 
            $out += $escape(value.img_url), $out += '" width="270" height="184" /> ') : 2 == value.img_status && ($out += ' <img src="', 
            $out += $escape(value.loadfail), $out += '" width="270" height="184" /> '), $out += ' <div class="pointer dn abso player-hander"> <div class="player_btn"><img class="fixpng" src="images/player_min_btn.png" /> </div> <div class="player_btn_on"><img class="fixpng" src="images/player_min_btn_on.png" /></div> </div> ', 
            "720P" == value.hd_type && ($out += ' <div class="abso fixpng p720"></div> '), $out += ' <div class="abso fixpng title-head"> <div class="title-bar"> <h3> <b>', 
            $out += $escape(value.title), $out += "</b> ", 2 == value.movieType && ($out += " ", 
            1 == value.complete_status ? ($out += " <em>热播至", $out += $escape(value.location), 
            $out += "集</em> ") : 2 == value.complete_status && ($out += " <em>", $out += $escape(value.location), 
            $out += "集全</em> "), $out += " "), $out += ' <span class="cl icon-box"> <span class="fl pointer sp add-list" data-storm="', 
            $out += $escape(value.storm), $out += '" data-type="add-list"></span> <span class="fr pointer sp add-favorite" data-storm="', 
            $out += $escape(value.storm), $out += '" data-type="add-favorite"></span> </span> </h3> <p class="des">', 
            $out += $escape(value.brief), $out += '</p> <div class="', $out += $escape(index > 0 ? "" : "fixpng"), 
            $out += ' video-view">', $out += $escape(value.movie_click), $out += "</div> </div> </div> </a> </div> ";
        }), $out += ' </div> <div class="cl abso change-tips" id="change-tips"> <ul class="fr"> ', 
        $each(lists, function($value, $index) {
            $out += " ", lists.length > 1 && ($out += ' <li data-index="', $out += $escape($index), 
            $out += '" class="', $out += $escape($index > 0 ? "" : "active"), $out += '"><a href="', 
            $out += $escape($value.storm), $out += '">', $out += $escape($index), $out += "</a></li> "), 
            $out += " ";
        }), $out += " </ul> </div>", new String($out);
    });
});