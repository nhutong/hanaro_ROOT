  $(function(){
              
              $(".add_btn").bind('click',function(){
                  
                 var clickN = $(".add_btn").index($(this))

                  $(this).toggleClass("active");
//                  $(".add_btn").attr('data-num',clickN);
                  
                  
              })
              
          })