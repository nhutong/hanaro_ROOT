
$(function(){
              
     $(".leaflet_new").click(function(){

		var jd_no = getCookie("shop_jb_no");
		if ( jd_no == null || chrLen(jd_no) == 0)
		{
			alert("유효한 장보기 카테고리가 없습니다. 상품대량추가 버튼을 눌러 장보기상품을 제작해주세요.");
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


