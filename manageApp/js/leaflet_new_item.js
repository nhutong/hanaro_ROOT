
$(function(){
              
     $(".leaflet_new").click(function(){

		var jd_no = getCookie("jd_no");
		if ( jd_no == null || chrLen(jd_no) == 0)
		{
			alert("유효한 전단이 없습니다. 새로운 전단제작하기 버튼을 눌러 전단을 제작해주세요.");
			return false;
		}

            $("#nh_leaflet").contents().find(".thumb_wrap, .product_detail,.item_list_banner_wrap").css("background-color","#fff");
           $("#nh_leaflet").contents().find(".thumb_wrap").css("border","0");
            $("#nh_leaflet").contents().find(".bx-wrapper,.date_item_wrap").css("border","0");   
           $("#leafletEditWrap").css("right","0");
           $(".black_modal").show();
           //2020-03-20 추가 김나영
           $(".new_item_wrap").show();
         //2020-03-20 추가 김나영
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".new_item_wrap").toggleClass("active");
                
	});
                            
	$(".cls_btn").click(function(){
		$(".new_item_wrap").removeClass("active");
	})
                            
	$('#order_deactive').on('click', function(){                  
		$('.deact_empty').children("input").attr('disabled', $(this).is(':checked'));       
	});

          
          
})



