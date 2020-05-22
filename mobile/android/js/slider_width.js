$(function(){
              
              var slideW = $(".mobile_slider").outerWidth();
              var aniboxW = $(".slider_ani_box li").length;
              
              $(".slider_ani_box").width(slideW*aniboxW);
              $(".slider_ani_box").css("margin-left",-slideW);
              $(".slider_ani_box li img").width(slideW);
    
             
          
          })