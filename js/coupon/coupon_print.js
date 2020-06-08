$(function(){

		var coupon_no = location.search.split('=')[1];
		getCouponInfo(coupon_no);
})


function couponSize(kk){
    var c = kk;
    $(".coupon_print_lft .coupon01,.coupon_print_lft .coupon02,.coupon_print_lft .coupon03").css("display","none");
    $(".coupon_print_lft .coupon"+c).css("display","block");
}

/*쿠폰정보를 가져옴 200110 김나영*/

function getCouponInfo(coupon_no){

		$.get('/back/05_event/coupon.jsp?coupon_no='+coupon_no,	
		function(result) {
			console.log(result);
			var info = result.list[0];			
			
			var startDate = (info.start_date).substring(5,10);
			var endDate = (info.end_date).substring(5,10);
						
			$('#popPdStart').val(startDate);
			$('#popPdEnd').val(endDate);
			$('#popPdLimit').val(info.limit_qty);		
			$('#popPdCode').val(info.product_code);
			$('#popPdName').val(info.product_name);
			$('#popPdDiscount').val(info.discount_price);
			$('#popPdPrice').val(info.min_price);
//			$('#company_name').append(info.company_name);
//			$('#status_cd').val(info.status_cd);

//			$('#a4Qr').append('<span class="coupon_barcode" id="a4QrSpan" style="display : block; margin : auto;">');
//			$('#a4QrSpan').barcode(info.coupon_code, "code128",{barWidth:1, barHeight:50});
//
//			$('#a3Qr').append('<span class="coupon_barcode" id="a3QrSpan" style="display : block; margin : auto;">');
//			$('#a3QrSpan').barcode(info.coupon_code, "code128",{barWidth:1, barHeight:50});
//
//			$('#r200Qr').append('<span class="coupon_barcode" id="r200QrSpan" style="display : block; margin : auto;">');
//			$('#r200QrSpan').barcode(info.coupon_code, "code128",{barWidth:1, barHeight:50});

			if (info.img_path == null)
			{
//				$('#a4_pd_img').attr("src","/images/thumb.png");
			}else{
				$('#a4_pd_img').append("<img src='/upload/"+info.img_path+"' alt='상품이미지'>");
				
			}

			if(info.coupon_type == 'PRODUCT'){
				$('#price_area').hide();
				$('#product_area').show();
			}else{
				$('#price_area').show();
				$('#product_area').hide();
			}
			
		});
	}

$("#couponPrintApply").on("click",function(e){
	
	e.preventDefault();

	/* A4 세로형 */

	// 상품명
	$("#a4PdName1").empty();
	$("#a4PdName1").append($("#popPdName").val());
	
	//원산지
	$("#a4PdName2").empty();
	$("#a4PdName2").append($("#popPdOrigin").val());
    
    //상품가격
	$("#a4BeforePrice").empty();
	$("#a4BeforePrice").append(comma($("#popPdPrice").val())+"원");
    
    //상품최종가격
	$("#a4AfterPrice").empty();
	$("#a4AfterPrice").append(comma($("#popPdPrice").val()-$("#popPdDiscount").val())+"원");     
    
	// 규격
	$("#a4Count").empty();
	$("#a4Count").append($("#popPdStan").val());

	// 단위당단가
	$("#a4Weight").empty();
	$("#a4Weight").append($("#popPdWeight").val());

    // 수량제한
	$("#a4Limit").empty();
	$("#a4Limit").append($("#popPdLimit").val()+" 한정");

    // 쿠폰할인가 ( DB에 저장되어 여기에 최초로딩시 바인딩되는 쿠폰의 가격이다. 할인이 적용된 상품의 가격이 아니다. )
	$("#a4Discount").empty();
	$("#a4Discount").append(comma($("#popPdDiscount").val())+"원");
	
	//기간 - 시작
	$("#a4StartDate").empty();
	$("#a4StartDate").append($("#popPdStart").val());

	//기간 - 끝
	$("#a4EndDate").empty();
	$("#a4EndDate").append($("#popPdEnd").val());


	/* A3 가로형 */

	// 상품명
	$("#a3PdName1").empty();
	$("#a3PdName1").append($("#popPdName").val());
	
	//원산지
	$("#a3PdName2").empty();
	$("#a3PdName2").append($("#popPdOrigin").val());

    //상품가격
	$("#a3BeforePrice").empty();
	$("#a3BeforePrice").append(comma($("#popPdPrice").val())+"원");    
    
    //상품최종가격
	$("#a3AfterPrice").empty();
	$("#a3AfterPrice").append(comma($("#popPdPrice").val()-$("#popPdDiscount").val())+"원");     
    
	// 규격
	$("#a3Count").empty();
	$("#a3Count").append($("#popPdStan").val());

	// 단위당단가
	$("#a3Weight").empty();
	$("#a3Weight").append($("#popPdWeight").val());

    // 수량제한
	$("#a3Limit").empty();
	$("#a3Limit").append($("#popPdLimit").val()+" 한정");

    // 쿠폰할인가 ( DB에 저장되어 여기에 최초로딩시 바인딩되는 쿠폰의 가격이다. 할인이 적용된 상품의 가격이 아니다. )
	$("#a3Discount").empty();
	$("#a3Discount").append(comma($("#popPdDiscount").val())+"원");
	
	//기간 - 시작
	$("#a3StartDate").empty();
	$("#a3StartDate").append($("#popPdStart").val());

	//기간 - 끝
	$("#a3EndDate").empty();
	$("#a3EndDate").append($("#popPdEnd").val());


	/* 엔드매대형 */
	// 상품명
	$("#r200PdName1").empty();
	$("#r200PdName1").append($("#popPdName").val());
    
    //상품가격
	$("#r200BeforePrice").empty();
	$("#r200BeforePrice").append(comma($("#popPdPrice").val())+"원"); 
    
    //상품최종가격
	$("#r200AfterPrice").empty();
	$("#r200AfterPrice").append(comma($("#popPdPrice").val()-$("#popPdDiscount").val())+"원"); 

	// 규격
	$("#r200Count").empty();
	$("#r200Count").append($("#popPdStan").val());

	// 단위당단가
	$("#r200Weight").empty();
	$("#r200Weight").append($("#popPdWeight").val());

    // 수량제한
	$("#r200Limit").empty();
	$("#r200Limit").append($("#popPdLimit").val()+" 한정");

    // 쿠폰할인가 ( DB에 저장되어 여기에 최초로딩시 바인딩되는 쿠폰의 가격이다. 할인이 적용된 상품의 가격이 아니다. )
	$("#r200Discount").empty();
	$("#r200Discount").append(comma($("#popPdDiscount").val())+"원");
	

	
    if( $("#popPdInfo").val() == ""){
          
       }else{
           $(".pop_pd_info").empty();
	       $(".pop_pd_info").append($("#popPdInfo").val());
       }
    


});

function onPopPrint(){
	$(".coupon_print_rgt").hide();
    $(".coupon03").clone().appendTo(".coupon_print_lft");
    $(".coupon03").clone().appendTo(".coupon_print_lft");
	pagePrintPreview();
	$(".coupon_print_rgt").show();
    $(".coupon03").not(":first").remove();
    
    

}


//function pagePrintPreview(){
 
//          var browser = navigator.userAgent.toLowerCase();
//          if ( -1 != browser.indexOf('chrome') ){
//                     window.print();
//          }else if ( -1 != browser.indexOf('trident') ){
//                     try{
                              //참고로 IE 5.5 이상에서만 동작함
 
                              //웹 브라우저 컨트롤 생성
//                              var webBrowser = '<OBJECT ID="previewWeb" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
 
                              //웹 페이지에 객체 삽입
//                              document.body.insertAdjacentHTML('beforeEnd', webBrowser);
 
                              //ExexWB 메쏘드 실행 (7 : 미리보기 , 8 : 페이지 설정 , 6 : 인쇄하기(대화상자))
//                              previewWeb.ExecWB(7, 1);
 
                              //객체 해제
//                              previewWeb.outerHTML = "";
//                    }catch (e) {
//                              alert("- 도구 > 인터넷 옵션 > 보안 탭 > 신뢰할 수 있는 사이트 선택\n   1. 사이트 버튼 클릭 > 사이트 추가\n   2. 사용자 지정 수준 클릭 > 스크립팅하기 안전하지 않은 것으로 표시된 ActiveX 컨트롤 (사용)으로 체크\n\n※ 위 설정은 프린트 기능을 사용하기 위함임. 설정 후 인터넷을 껐다가 다시 켜주세요.");
//                     }
                    
//          }
          
//}



// var mapContainer = document.getElementById('coupon01');
// document.body.innerHTML = mapContainer.innerHTML;
// window.print();