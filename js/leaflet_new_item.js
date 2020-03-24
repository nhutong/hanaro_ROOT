
$(function(){
              
     $(".leaflet_new").click(function(){

		var jd_no = getCookie("jd_no");
		if ( jd_no == null || chrLen(jd_no) == 0)
		{
			alert("유효한 전단이 없습니다. 새로운 전단제작하기 버튼을 눌러 전단을 제작해주세요.");
			return false;
		}

        $(".leaflet_edit_wrap").children("div").removeClass("active");
        $("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a>img, .price, .price2, .product,.item_list_banner_wrap").css("background-color","#fff");
        $("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
        $(".new_item_wrap").show();
                
	});
                            
	$(".cls_btn").click(function(){
		$(".new_item_wrap").hide();
	})
                            
	$('#order_deactive').on('click', function(){                  
		$('.deact_empty').children("input").attr('disabled', $(this).is(':checked'));       
	});

          
          
})


