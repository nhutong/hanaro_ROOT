$(function () {

    // 전역변수 파라미터	
    menu_no = getParameterByName('menu_no');   // 메뉴번호
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호
	jd_no = getParameterByName('jd_no');   // 전단번호

	if (vm_cp_no == "")
	{
		//로그인한 판매장의 판매장번호를 로그인한 쿠키정보에서 가져온다.
		vm_cp_no = getCookie("userCompanyNo");
	}

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */

//	/* 공통부분 종료======================================================================== */

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");
//    CuserCompanyNo = 1;
	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("userCompanyNo");

	var targetCompanyNo = "";
	if (onSelectCompanyNo != "")
	{
		if (onSelectCompanyNo != CuserCompanyNo)
		{
			targetCompanyNo = onSelectCompanyNo;
		}else{
			targetCompanyNo = CuserCompanyNo;
		}
	}else{
		targetCompanyNo = CuserCompanyNo;
	}
	/* 최초 로그인한 유저번호로 바인딩한다. */
	getManagerList(CuserCompanyNo, targetCompanyNo);

	
	/* 공통부분 종료======================================================================== */


	/* 최초 로딩를 고려하여, 현재 로그인한 유저의 판매장번호로 긴급공지정보를 바인딩한다. */
	getLeftNav(targetCompanyNo);

	/* 전단의 상품순서를 리스팅한다 */
	setTimeout(function(){ getPdOrder(); }, 1000);

	/* 페이지 로딩시, 최초 상품컨텐츠선택을 초기화한다. */
	setCookie1("jd_prod_con_no","", 1);	
    
    getLeft();
    getNav();
    
	

});


function history_back(){
	history.back();
}

// 좌측 메뉴리스트를 가져온다
function getLeftNav(rcv_vm_cp_no) {

	/* 최초 메뉴 로딩시, 전단번호와 메뉴번호를 초기화한다. */
	setCookie1("jd_no","null",1);
	setCookie1("menu_no","null",1);
	setCookie1("menu_type_cd","null",1);

	/* 해당 메뉴에 전단이 셋팅되어 있지 않으면, 전단삭제 버튼을 숨긴다. */
	if (getCookie("jd_no") == "null")
	{
//		$(".leaflet_del_prod").hide();
//		$(".leaflet_new").hide();
		$(".leaflet_del").hide();
	}else{
//		$(".leaflet_del_prod").show();
//		$(".leaflet_new").show();
		if ( getCookie("jd_prod_con_no") == "" )
		{
			$(".leaflet_del").hide();
		}else{
			$(".leaflet_del").show();
		}
	}

    $.ajax({
        url:'/back/03_leaflet/leafletUserMenu.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: rcv_vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("leafletUserMenu=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= leafletUserMenu callback ========================");
            console.log(result);
            var data = JSON.parse(result);
                         

        }
    });
}

// 행사/전단의 좌측 메뉴 클릭시, iframe src 호출용 함수이다.
function leafletLink(rcv_jd_no, rcv_menu_no, rcv_vm_cp_no, rcv_menu_type_cd){
	
	$("#myplanb_menu li").removeClass("active");
	$("#menu_"+rcv_menu_no).addClass("active");

	setCookie1("jd_no",rcv_jd_no);
	setCookie1("menu_no",rcv_menu_no);
	setCookie1("menu_type_cd",rcv_menu_type_cd);

	/* 페이지 로딩시, 최초 상품컨텐츠선택을 초기화한다. */
	setCookie1("jd_prod_con_no","", 1);	

	/* 해당 메뉴에 전단이 셋팅되어 있지 않으면, 전단삭제 버튼을 숨긴다. */
	if (getCookie("jd_no") == "null")
	{
//		$(".leaflet_del_prod").hide();
//		$(".leaflet_new").hide();
		$(".leaflet_del").hide();
	}else{
//		$(".leaflet_del_prod").show();
//		$(".leaflet_new").show();
		if ( getCookie("jd_prod_con_no") == "" )
		{
			$(".leaflet_del").hide();
		}else{
			$(".leaflet_del").show();
		}
	}

	document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no+"&jd_no="+rcv_jd_no;
}

// 상품삭제 버튼 클릭시, 함수실행된다.
function delete_btn(){ 
	if (confirm("정말 삭제하시겠습니까??") == true){
		$.ajax({
			url:'/back/03_leaflet/leafletJdProdConNoDelete.jsp?random=' + (Math.random()*99999),
			data : {jd_prod_con_no: getCookie("jd_prod_con_no")},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제 완료되었습니다.");
				$('#nh_leaflet').get(0).contentDocument.location.reload();
				setTimeout(function(){ cssRetach(); }, 1500);
			}
		});

	}else{   //취소
		return;
	}
}

// 전단삭제 버튼 클릭시, 함수실행된다.
function delete_jdbtn(){ 
	if (confirm("현재 전단을 삭제하시겠습니까??") == true){
		$.ajax({
			url:'/back/03_leaflet/leafletJdDelete.jsp?random=' + (Math.random()*99999),
			data : {jd_no: getCookie("jd_no")},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제 완료되었습니다.");
				$('#nh_leaflet').get(0).contentDocument.location.reload();
				setTimeout(function(){ cssRetach(); }, 1500);
			}
		});

	}else{   //취소
		return;
	}
}



/*판매장 변경시, iframe reload 한다.*/
$("#sort_select").on("change",function(){
	if ($("#sort_select").val() == "" )
	{
	}else{
		document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+vm_cp_no;
	}
});

/*전단 기간 확인버튼 클릭시, 전단 기간을 업데이트 한다.*/
$("#category_update_btn").on("click",function(){
	var from_date_origin = encodeURIComponent($("#from_date_origin").val());
	var to_date_origin = encodeURIComponent($("#to_date_origin").val());
	var jd_no = encodeURIComponent($("#jd_no").val());

	if ( from_date_origin == null || chrLen(from_date_origin) == 0)
	{
		alert("전단 시작일을 입력하시기 바랍니다.");
		return false;
	}

	if ( to_date_origin == null || chrLen(to_date_origin) == 0)
	{
		alert("전단 종료일을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletDateCategoryUpdate.jsp?random=' + (Math.random()*99999),
		data : {from_date_origin: from_date_origin, to_date_origin: to_date_origin, jd_no: jd_no},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            alert("수정이 완료되었습니다.");
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});


/*배너리스트 확인버튼 클릭시, 배너리스트정렬순서를 업데이트 한다.*/
$("#banner_edit_btn").on("click",function(){
	var jd_no = encodeURIComponent(getCookie("jd_no"));
	var bannerOrderStr = getCookie("bannerOrderStr");

	if ( bannerOrderStr == null || chrLen(bannerOrderStr) == 0)
	{
		alert("배너 정렬을 진행하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletBannerListUpdate.jsp?random=' + (Math.random()*99999),
		data : {jd_no: jd_no, bannerOrderStr: bannerOrderStr},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
			$(".leaflet_banner").removeClass("active");
			$(".item_list_banner_wrap").removeClass("active");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*썸네일 이미지 업로더*/
var thumUpload = document.getElementById('thum_add_btn');
thumUpload.addEventListener('click', function(evt){
	var inputFile = document.getElementById('uploadFile_thum');
	new Upload(inputFile, function(result){
		$("#new_thum_path").val(result);
//		$("#airtel_thumnail_path_img").attr("src", "/upload/"+result);

		thumnailInsert(result);
//		alert("이미지 추가하기를 완료하였습니다.");
	});
});


/*썸네일 이미지 추가하기 클릭시, 이미지경로를 받아, 이미지를 insert 한후, 전단상품컨텐츠에 이미지번호를 update 한다.*/
function thumnailInsert(imgPath){
	var pd_no_thum = encodeURIComponent($("#pd_no_thum").val());
	var pd_code_thum = encodeURIComponent($("#pd_code_thum").val());

	$.ajax({
        url:'/back/03_leaflet/leafletPdThumnailInsert.jsp?random=' + (Math.random()*99999),
		data : {imgPath: imgPath, pdNo: pd_no_thum, pdCode: pd_code_thum, userNo: localStorage.getItem("userNo")},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
			
			thumnailUpdate(result);

//			$('#nh_leaflet').get(0).contentDocument.location.reload();

        }
    });
}

/*썸네일 이미지 클릭시, 이미지번호를 받아, 업데이트 한다.*/
function thumnailUpdate(imgNo){
	var jd_prod_con_no_prod_thum = encodeURIComponent($("#jd_prod_con_no_prod_thum").val());

	if ( imgNo == null || chrLen(imgNo) == 0)
	{
		alert("썸네일을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletPdThumnailUpdate.jsp?random=' + (Math.random()*99999),
		data : {imgNo: imgNo, jd_prod_con_no: jd_prod_con_no_prod_thum},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("이미지 수정이 완료되었습니다.");
            $("#searchText").val("");
            $("#searchResultGroup").empty();
			$(".leaflet_image").removeClass("active");
            $("#leafletEditWrap").css("right","-100%");
            $(".black_modal").hide();
			$('#nh_leaflet').get(0).contentDocument.location.reload();
					
//			setTimeout(function(){ ThumCSS(); }, 1500);
			setTimeout(function(){ cssRetach(); }, 1500);

        }
    });
}

// 상품오더 순서를 가져온다.
function getPdOrder() {
	rcvJdNo = 35;
    $.ajax({
        url:'/back/03_leaflet/leafletPdOrder.jsp?random=' + (Math.random()*99999), 
        data : {jd_no: rcvJdNo},
        method : 'GET'
    }).done(function(result){

        console.log("leafletPdOrder=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= leafletPdOrder callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			$('#pd_order').empty();

            data['PdOrderList'].forEach(function(item, index){                        
				
				var pd_tot = Number(decodeURIComponent(item['pdorder_tot']));

				for (h=1;h<=pd_tot;h++ )
				{
					if ( h == 1 )
					{
						$('#pd_order').append('<option value='+h+' selected>'+h+'</option>');	
					
					}else{
						$('#pd_order').append('<option value='+h+'>'+h+'</option>');
					}
				}
				
			});
        }
    });
}

function ThumCSS(){
	$("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
			   $(".new_item_wrap").hide();
			   $(document).find(".leaflet_edit_wrap>div").removeClass("active");
			   $(document).find(".leaflet_image").toggleClass("active");
			});
}
//검색결과를 가져온다.(엔터시)

$("#searchText").on("keyup",function(){
	if( event.keyCode==13 ){
		var searchText = $("#searchText").val();

		if ( searchText == null || chrLen(searchText) == 0)
		{
			alert("검색어를 입력하시기 바랍니다.");
			return false;
		}

		$.ajax({
			url:'/back/03_leaflet/leafletSearchList.jsp?random=' + (Math.random()*99999), 
			data : {searchText: searchText},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){
				console.log(result);
				$("#searchResultGroup").empty();
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				var data = JSON.parse(result);
				$("#searchResultGroup").empty();
				$("#searchResultGroup").css({overflow:'scroll', height:'300px', textAlign:'left'});
				data['imgList'].forEach(function(item, index){                        
					$("#searchResultGroup").append('<li onclick="thumnailUpdate('+item['img_no']+')"><img src="/upload/'+item['img_path']+'"></li>');
				});
				
			}
		});
	}
});

// 검색결과를 가져온다.(버튼 클릭시)
$("#thum_search_btn").on("click",function(){

	var searchText = $("#searchText").val();

	if ( searchText == null || chrLen(searchText) == 0)
	{
		alert("검색어를 입력하시기 바랍니다.");
		return false;
	}

    $.ajax({
        url:'/back/03_leaflet/leafletSearchList.jsp?random=' + (Math.random()*99999), 
        data : {searchText: searchText},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#searchResultGroup").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			$("#searchResultGroup").empty();
			$("#searchResultGroup").css({overflow:'scroll', height:'400px', textAlign:'left'});
            data['imgList'].forEach(function(item, index){                        
				$("#searchResultGroup").append('<li onclick="thumnailUpdate('+item['img_no']+')"><img src="/upload/'+item['img_path']+'"></li>');
			});
			
        }
    });
});

$(".leaflet_coupon_table td button").on("click",function(){
    $(this).siblings(".manageModal").addClass("active");
    $(".black_modal2").show();
})

$(".close_modal,.black_modal2").on("click",function(){
    $(".manageModal").removeClass("active");
    $(".black_modal2").hide();
})

/*할인상세를 등록한다.*/
$("#sale_btn").on("click",function(){
	var jd_prod_con_no = getCookie("jd_prod_con_no");
	var card_discount = $("#card_discount").val();
	var card_discount_from_date = $("#card_discount_from_date").val();
	var card_discount_end_date = $("#card_discount_end_date").val();
	var card_info = $("#card_info").val();
	var card_restrict = $("#card_restrict").val();
	var coupon_discount = $("#coupon_discount").val();
	var dadaiksun = $("#dadaiksun").val();
	var dadaiksun_info = $("#dadaiksun_info").val();

	if ( card_discount == null || chrLen(card_discount) == 0)
	{
//		if ( chrLen(card_discount_from_date) > 0)
//		{
//			alert("카드 할인 시작일을 삭제하시기 바랍니다.");
//			return false;
//		}
//
//		if ( chrLen(card_discount_end_date) > 0)
//		{
//			alert("카드 할인 종료일을 삭제하시기 바랍니다.");
//			return false;
//		}
//
//		if ( chrLen(card_info) > 0)
//		{
//			alert("카드 정보를 삭제하시기 바랍니다.");
//			return false;
//		}
//
//		if ( chrLen(card_restrict) > 0)
//		{
//			alert("카드한정 정보를 삭제하시기 바랍니다.");
//			return false;
//		}
	}else{
		if ( card_discount_from_date == null || chrLen(card_discount_from_date) == 0)
		{
			alert("카드 할인 시작일을 입력하시기 바랍니다.");
			return false;
		}

		if ( card_discount_end_date == null || chrLen(card_discount_end_date) == 0)
		{
			alert("카드 할인 종료일을 입력하시기 바랍니다.");
			return false;
		}

		var cardDisFromNum = Number(replaceAll(card_discount_from_date,"-",""));
		var cardDisEndNum =  Number(replaceAll(card_discount_end_date,"-",""));

		if (cardDisFromNum - cardDisEndNum > 0)
		{
			alert("카드 할인 종료일은 카드 할인 시작일 이후 날짜여야만 합니다.");
			return false;
		}

		if ( card_info == null || chrLen(card_info) == 0)
		{
			alert("카드 정보를 입력하시기 바랍니다.");
			return false;
		}

//		if ( card_restrict == null || chrLen(card_restrict) == 0)
//		{
//			alert("카드한정 정보를 입력하시기 바랍니다.");
//			return false;
//		}
	}

	$.ajax({
        url:'/back/03_leaflet/leafletProductSaleUpdate.jsp?random=' + (Math.random()*99999),
		data : {jd_prod_con_no: jd_prod_con_no, card_discount: card_discount, card_discount_from_date: card_discount_from_date, card_discount_end_date: card_discount_end_date, card_info: card_info, card_restrict: card_restrict, coupon_discount: coupon_discount, dadaiksun: dadaiksun, dadaiksun_info: dadaiksun_info},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
            $("#card_discount,#card_discount_from_date,#card_discount_end_date,#card_info,#card_restrict,#coupon_discount,#dadaiksun,#dadaiksun_info").val("");
			$(document).find(".leaflet_discount").removeClass("active"); 
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품명 확인버튼 클릭시, 상품명을 업데이트 한다.*/
$("#pd_name_btn").on("click",function(){
	var jd_prod_con_no_prod_name = encodeURIComponent($("#jd_prod_con_no_prod_name").val());
	var pd_name = $("#pd_name").val();

	if ( pd_name == null || chrLen(pd_name) == 0)
	{
		alert("상품명을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletPdNameUpdate.jsp?random=' + (Math.random()*99999),
		data : {pd_name: pd_name, jd_prod_con_no: jd_prod_con_no_prod_name},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
            $("#pd_name").val("");
            $(".leaflet_goods_name").removeClass("active");
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품가격 확인버튼 클릭시, 상품가격을 업데이트 한다.*/
$("#price_btn").on("click",function(){
	var jd_prod_con_no_price = encodeURIComponent($("#jd_prod_con_no_price").val());
	var price = encodeURIComponent($("#price").val());

	if ( price == null || chrLen(price) == 0)
	{
		alert("상품가격을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletPriceUpdate.jsp?random=' + (Math.random()*99999),
		data : {jd_prod_con_no: jd_prod_con_no_price, price: price},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
            $("#price").val("");
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%");
            $(".leaflet_goods_price").removeClass("active");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품을 개별등록한다.*/
$("#pd_create_btn").on("click",function(){
	var user_no = localStorage.getItem("userNo");
	var jd_no = getCookie("jd_no");
	var blank_chk = document.getElementsByName("blank_chk")[0].checked;
	var pd_order = $("#pd_order").val();
	var pd_code = $("#pd_code").val();
	var pd_name = $("#pd_name_new").val();
	var pd_price = $("#pd_price").val();
	var card_discount = $("#card_discount1").val();
	var card_startDate = $("#card_startDate").val();
	var card_endDate = $("#card_endDate").val();
	var card_info = $("#card_info1").val();
	var card_restrict = $("#card_restrict1").val();
	var coupon_discount = $("#coupon_discount1").val();
	var dadaiksun = $("#dadaiksun1").val();
	var dadaiksun_info = $("#dadaiksun_info1").val();
	var etc_info = $("#etc_info").val();
	
	if(blank_chk == true){ //빈칸만들기 체크
		var blank_fg = "Y";
	}else{
		var blank_fg = "N"; // 빈칸만들기 비체크

		if ( pd_code == null || chrLen(pd_code) == 0)
		{
			alert("상품코드를 입력하시기 바랍니다.");
			return false;
		}

		if ( pd_name == null || chrLen(pd_name) == 0)
		{
			alert("상품명을 입력하시기 바랍니다.");
			return false;
		}

		if ( pd_price == null || chrLen(pd_price) == 0)
		{
			alert("상품가격을 입력하시기 바랍니다.");
			return false;
		}
	}

	$.ajax({
        url:'/back/03_leaflet/leafletProductInsert.jsp?random=' + (Math.random()*99999),
		data : {blank_fg: blank_fg, user_no: user_no, jd_no: jd_no, pd_order: pd_order, pd_code: pd_code, pd_name: pd_name, pd_price: pd_price, card_discount: card_discount, card_startDate: card_startDate, card_endDate: card_endDate, card_info: card_info, card_restrict: card_restrict, coupon_discount: coupon_discount, dadaiksun: dadaiksun, dadaiksun_info: dadaiksun_info, etc_info: etc_info},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
//            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%");
			$('#nh_leaflet').get(0).contentDocument.location.reload();

			$("input:checkbox[name='blank_chk']").prop("checked", false);
            $("#pd_code").val("");
            $("#pd_name_new").val("");
            $("#pd_price").val("");
            $("#card_discount1").val("");
            $("#card_startDate").val("");
            $("#card_endDate").val("");
            $("#card_info1").val("");
            $("#card_restrict1").val("");
            $("#coupon_discount1").val("");
            $("#dadaiksun1").val("");
            $("#dadaiksun_info1").val("");
            $("#etc_info").val("");
            
            $(".new_item_wrap").removeClass('active');
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%");
			setTimeout(function(){ cssRetach(); }, 1500);
			
        }
    });
});

$("#nh_leaflet").load(function(){

		setTimeout(function(){ cssRetach(); }, 2000);
           
    })


function cssRetach(){
	

	$("#nh_leaflet").contents().find("body").append("<link href='../css/leaflet_iframe.css'><style>.bx-wrapper{cursor:pointer; max-width:100% !important; min-width:100% !important; width:100% !important; box-shadow : none;}.bx-wrapper:hover{background-color:#527eff; } .bx-wrapper.active{background-color:#527eff !important} .date_item_wrap{cursor:pointer} ;#share_btn{display:none;}</style>");
       
	   $("#nh_leaflet").contents().find(".date_item_wrap").click(function(){
			   
			   $(document).find(".leaflet_edit_wrap>div").removeClass("active");
               $("#nh_leaflet").contents().find(".thumb_wrap, .product_detail,.item_list_banner_wrap").css("background-color","#fff");
               $("#nh_leaflet").contents().find(".thumb_wrap,.bx-wrapper").css("border","0");
               $(this).css("border","2px solid #4ba8ff");
               $("#leafletEditWrap").css("right","0");
               $(".black_modal").show();
			   $(document).find(".leaflet_date").toggleClass("active");
	   });	   

       $("#nh_leaflet").contents().find(".bx-wrapper").click(function(e){
           
           $("#nh_leaflet").contents().find(".thumb_wrap, .product_detail,.item_list_banner_wrap").css("background-color","#fff");
           $("#nh_leaflet").contents().find(".thumb_wrap,.date_item_wrap").css("border","0");
           $(this).css("border","2px solid #4ba8ff");
           $("#leafletEditWrap").css("right","0");
           $(".black_modal").show();
           $(this).addClass("active");
		   $("#sortable").empty();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_banner").toggleClass("active");
           
           e.preventDefault();

       });
           
        $("#nh_leaflet").contents().find(".thumb_wrap").click(function(){
           
            $("#nh_leaflet").contents().find(".thumb_wrap>a>img, .product_detail,.item_list_banner_wrap").css("background-color","#fff");
           $("#nh_leaflet").contents().find(".thumb_wrap").css("border","0");
            $("#nh_leaflet").contents().find(".bx-wrapper,.date_item_wrap").css("border","0");
           $(this).css("border","2px solid #4ba8ff");    
           $("#leafletEditWrap").css("right","0");
           $(".black_modal").show();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_image").toggleClass("active");
            
        });
           

        $("#nh_leaflet").contents().find(".product_detail").click(function(){
           $("#nh_leaflet").contents().find(".thumb_wrap>a>img, .product_detail,.item_list_banner_wrap").css("background-color","#fff");
           $("#nh_leaflet").contents().find(".thumb_wrap,.date_item_wrap,.bx-wrapper").css("border","0");
           $("#leafletEditWrap").css("right","0");
           $(this).css("background-color","#4ba8ff3d");
           $(".black_modal").show();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_goods_price").toggleClass("active");
        
        });
           
           
        $(".cls_btn, .black_modal").click(function(){
           $("#nh_leaflet").contents().find(".leaflet_edit_wrap>div").removeClass("active");
            $(".black_modal").hide();
            $(".black_modal").css("z-index","-1");
            $(".manageModal").removeClass("active");
            $("#leafletEditWrap").css("right","-100%");
           $(this).parent("div").removeClass("active");
        });

//		var innerH = $("#nh_leaflet").contents().find("html").height();
//
//		$("#nh_leaflet").height(innerH);

}