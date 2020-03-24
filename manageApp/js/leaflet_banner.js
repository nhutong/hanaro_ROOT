   
          $(function(){
              
               $(".leaflet_banner_hover").click(function(){
                   
                   var noImg = "../images/no_img.png";
                   
                   if($(".ui-state-default img").attr('src') == noImg ){
                            alert("이미지가 없을 때는 숨기기가 작동하지 않습니다.");
                      }else{
                        $(".ui-state-default").children("span").addClass("active");
                      } 
                   
                    });
            
          })