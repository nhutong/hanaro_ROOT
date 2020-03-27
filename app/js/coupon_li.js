$(function(){

			$("#coupon_list_wrap>div:not(:first), .tab_list_wrap>div:not(:first)").hide();

            $(".coupon_choice li, .tab_choice li").click(function(){
               c = $(this).attr("data-new");
                $("#coupon_list_wrap>div, .tab_list_wrap>div ").hide();
                $("#list_"+c).show();
                $(".coupon_choice li, .tab_choice li").removeClass("active");
                $(this).addClass("active");
            })



})