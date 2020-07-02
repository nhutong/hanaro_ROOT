$(function(){

	getHeader();
	getLeft();
	getLeftMenu('event');

	var coupon_no = location.search.split('=')[1];

	getCouponInfo(coupon_no);

	var today = new Date();
	var year = today.getFullYear();
	var month = leadingZeros(today.getMonth()+1,2);
	var day = leadingZeros(today.getDate(),2);

	$("#popPdStartDate").val(year+'-'+month+'-'+day);
	$("#popPdEndDate").val(year+'-'+month+'-'+day);	

	couponSize('01','A4');

})


function couponSize(kk, ss){

	//var printSize = $("#printSize").val();
	//var printOrientation = $('#printOrientation').val();
	//$("#printSize").val();
	//$('#printOrientation').val();
	//var width = $("#width").val();
	//var height = $("#height").val();
	//var couponDiv = $("#couponDiv").val();
		
	var c = kk;
	var size = ss;

	$("#couponDiv").val(".coupon"+c);

    $(".coupon_print_lft .coupon01,.coupon_print_lft .coupon02,.coupon_print_lft .coupon03").css("display","none");
	$(".coupon_print_lft .coupon"+c).css("display","block");
		
	$("#printSize").val(size);

	if ( kk == '01' ){ //세로형
		$('#printOrientation').val('portrait');
		var a4_width="202mm";
		var a4_height="288mm";
		var a3_width="288mm";
		var a3_height="404mm";			
	}else if( kk == '02' ){ //가로형
		$('#printOrientation').val('landscape');
		var a4_width="288mm";
		var a4_height="200mm";
		var a3_width="400mm";
		var a3_height="288mm";		
	}else{ //세로형(엔드매대형)
		$('#printOrientation').val('portrait');
		var a4_width="202mm";
		var a4_height="288mm";
		var a3_width="288mm";
		var a3_height="404mm";			
	}
	
	if( size == 'A4' ){
		$("#printSize").val('A4');
		$("#width").val(a4_width);
		$("#height").val(a4_height);
		$(".coupon_print_lft .coupon"+c).css("font-size","14px");				
	}else{
		$("#printSize").val('A3');
		$("#width").val(a3_width);
		$("#height").val(a3_height);			
		$(".coupon_print_lft .coupon"+c).css("font-size","20px");				
	}				

	if ( kk == '03' ){ //세로형	
	}else{
		$(".coupon_print_lft .coupon"+c).css("width",$("#width").val());
		$(".coupon_print_lft .coupon"+c).css("height",$("#height").val());		
	}

	//console.log($("#printSize").val()+"/"+$('#printOrientation').val());

	// console.log($("#coupon_print_lft").outerWidth()+"/"+$("#coupon_print_lft").outerHeight());
}

/*쿠폰정보를 가져옴 200110 김나영*/

function getCouponInfo(coupon_no){

		$.get('/back/05_event/coupon.jsp?coupon_no='+coupon_no,	
		function(result) {
			console.log(result);
			var info = result.list[0];			
						
			$('#popPdCouponNo').val(info.coupon_no);
			$('#popPdCode').val(info.product_code);
			$('#popPdName').val(info.product_name);
			$('#popPdPrice').val(info.min_price);
			$('#popPdWeight').val(info.weight);
			$('#popPdUnitPrice').val(info.unit_price);
			$('#popPdOrigin').val(info.origin);
			$('#popPdDiscount').val(info.discount_price);

			$('#popPdStartDate').val(info.start_date);
			var start = (info.start_date).substring(5,7).replace(/(^0+)/, "").concat( "/" , (info.start_date).substring(8,10).replace(/(^0+)/, "") );
			$('#popPdStart').val(start);

			$('#popPdEndDate').val(info.end_date);			
			var end = (info.end_date).substring(5,7).replace(/(^0+)/, "").concat( "/" , (info.end_date).substring(8,10).replace(/(^0+)/, "") );
			$('#popPdEnd').val(end);

			$('#popPdLimit').val(info.limit_qty);
			$('#popPdEtcInfo').val(info.etc_info);												

			if (info.img_path == null){
			}else{
				$('#a4_pd_img').append("<img src='/upload/"+info.img_path+"' alt='상품이미지'>");
				$('#a3_pd_img').append("<img src='/upload/"+info.img_path+"' alt='상품이미지'>");				
			}

			if(info.coupon_type == 'PRODUCT'){
				$('#price_area').hide();
				$('#product_area').show();
			}else{
				$('#price_area').show();
				$('#product_area').hide();
			}

			couponPrintApply();
			
		});
	}

//저장하기
$("#couponPrintSave").on("click",function(e){
	e.preventDefault();	
	var formData = {
		coupon_no : $('#popPdCouponNo').val(),
		product_code : $('#popPdCode').val(),
		product_name : $('#popPdName').val(),
		min_price : $('#popPdPrice').val(),
		weight : $('#popPdWeight').val(),
		unit_price : $('#popPdUnitPrice').val(),
		origin : $('#popPdOrigin').val(),
		discount_price : $('#popPdDiscount').val(),
		start_date : $('#popPdStartDate').val(),
		end_date : $('#popPdEndDate').val(),
		limit_qty : $('#popPdLimit').val(),
		etc_info : $('#popPdEtcInfo').val(),
		lst_no : getCookie("userNo")
	} ;
	// console.log(formData);
	$.post( '/back/05_event/couponPrint.jsp',
	formData, 			
	function(resultJSON){
		if(resultJSON['update'] > 0){
			alert('저장이 완료되었습니다');
			couponPrintApply();			
		}else {
			console.log(resultJSON['error']);
			alert("저장 중 에러가 발생하였습니다.");
		}
	});	
});

$("#popPdStartDate").on("change",function(e){
	e.preventDefault();
	var start = $("#popPdStartDate").val().substring(5,7).replace(/(^0+)/, "").concat( "/" ,  $("#popPdStartDate").val().substring(8,10).replace(/(^0+)/, "") );
	$('#popPdStart').val(start);
});

$("#popPdEndDate").on("change",function(e){
	e.preventDefault();
	var end = $("#popPdEndDate").val().substring(5,7).replace(/(^0+)/, "").concat( "/" , $("#popPdEndDate").val().substring(8,10).replace(/(^0+)/, "") );
	$('#popPdEnd').val(end);		
});

//적용하기
$("#couponPrintApply").on("click",function(e){
	e.preventDefault();
	couponPrintApply();    
});

function couponPrintApply(){

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
	$("#a4Limit").append($("#popPdLimit").val());

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
	$("#a3Limit").append($("#popPdLimit").val());

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
	$("#r200Limit").append($("#popPdLimit").val());

    // 쿠폰할인가 ( DB에 저장되어 여기에 최초로딩시 바인딩되는 쿠폰의 가격이다. 할인이 적용된 상품의 가격이 아니다. )
	$("#r200Discount").empty();
	$("#r200Discount").append(comma($("#popPdDiscount").val())+"원");
	
    if( $("#popPdInfo").val() == "" || $("#popPdInfo").val() == undefined ){
	}else{
		$(".pop_pd_info").empty();
		$(".pop_pd_info").append($("#popPdInfo").val());
	}
}

$("#couponPrintPrint").on("click",function(e){
	e.preventDefault();
	//var width = $("#coupon_print_lft").outerWidth();
	//var height = $("#coupon_print_lft").outerHeight();

	var width = $( $("#couponDiv").val() ).outerWidth();
	var height = $( $("#couponDiv").val() ).outerHeight();

	//var width = $("#width").val();
	//var height = $("#height").val();	
	var printSize = $("#printSize").val();
	var printOrientation = $('#printOrientation').val();

	// alert($("#coupon_print_lft").outerHeight());
	// alert($("#coupon_print_lft").outerWidth());
	//$("#coupon_print_lft").outerHeight()

	/** 프린트 버튼 클릭 시 이벤트 */
    var $container = $("#coupon_print_lft").clone();  // 프린트 할 특정 영역 복사
	// console.log("aaaa");
	// console.log($("style"));

	var cssText = "";

    for ( var node in $("style") ) {
		console.log(node);
        cssText += node.innerHTML;
	}
	
    /** 팝업 */
    var innerHtml = $container[0].innerHTML;
	var popupWindow = window.open("", "_blank", "width="+width+"px,height="+height+"px");
	//var popupWindow = window.open("", "_blank", "width=500px,height=600px");

	//$('head').append('<style>@page{size: landscape;}</style>')
	// cssText = "@page{size: landscape;}";
	// cssText = "@media print{@page {size: landscape}}";
	// cssText = "@media print { html, body { width: 297mm; height: 210mm; } }";

    //size: A3;
    //size: landscape;
	//margin: 0;    	
	var text = "";

	text += "<!DOCTYPE html>"+
		"<html>"+
			"<link href='../css/common.css'        rel='stylesheet'>"+
			"<link href='../css/index.css'         rel='stylesheet'>"+
			"<link href='../css/page_print.css'    rel='stylesheet'>"+
			"<link href='../css/bootstrap.min.css' rel='stylesheet'>"+
			"<link href='../css/all.css'           rel='stylesheet'>"+
			"<head>"+
			//"<style>"+cssText+"</style>"+
			"</head>"+
			"<body>";

	if ( $("#couponDiv").val() == '.coupon03' ){
		text += "<div>"+innerHtml+"</div>"+
				"<div>"+innerHtml+"</div>"+
				"<div>"+innerHtml+"</div>"+
				"<div>"+innerHtml+"</div>"+								
			    "<div>"+innerHtml+"</div>";
	}else{
		text += "<div>"+innerHtml+"</div>";
	}

	text += "</body></html>";

    popupWindow.document.write(text);

    popupWindow.document.close();
    popupWindow.focus();

    /** 1초 지연 */
    // setTimeout(() => {
    //     popupWindow.print();         // 팝업의 프린트 도구 시작
    //     popupWindow.close();         // 프린트 도구 닫혔을 경우 팝업 닫기
	// }, 1000);	
	
	setTimeout(function() {
        // popupWindow.print();         // 팝업의 프린트 도구 시작
        // popupWindow.close();         // 프린트 도구 닫혔을 경우 팝업 닫기
	}, 1000);

});


function onPopPrint(){
	//window.open("print_popup.html","print_open","width=760,height=750,top=0,left=0,noresizable,toolbar=no,status=no,scrollbars=yes,directory=n");
	//var mapContainer = document.getElementById('coupon01');
	//document.body.innerHTML = mapContainer.innerHTML;
	//window.print();
	// $(".coupon_print_rgt").hide();
    // $(".coupon03").clone().appendTo(".coupon_print_lft");
    // $(".coupon03").clone().appendTo(".coupon_print_lft");
	// pagePrintPreview();
	// $(".coupon_print_rgt").show();
	// $(".coupon03").not(":first").remove();
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



