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
	getHeader();
	$(".nav_shop_manage").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();

//	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
//	CuserCompanyNo = getCookie("userCompanyNo");
//
//	/* 우상단 선택된 판매장번호 정보를 담는다. */
//	onSelectCompanyNo = getCookie("onSelectCompanyNo");
//
//	/* 우상단 셀렉트박스의 옵션을 바인딩한다. */
//	getManagerList();
//
//	/*판매장 변경시, */
//	$("#sort_select").on("change",function(){
//		if ($("#sort_select").val() == "" )
//		{
//		}else{
//			// 1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
//			setCookie1("onSelectCompanyNo",$("#sort_select").val());
//			
//			/* 앱의 장보기화면을 호출한다. */
//			document.getElementById("nh_leaflet").src = "../app/shop/shop.html?vm_cp_no="+getCookie("onSelectCompanyNo");
//			
//		}
//	});
//	/* 공통부분 종료======================================================================== */

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

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

	/*판매장 변경시, 
	1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
	2. 저장된 쿠키정보를 이용하여 긴급공지내용을 바인딩한다. 
	3. iframe 내부 모바일웹의 판매장셋팅을 위해, 로컬스토리지에 판매장번호를 셋팅한다.
	4. 선택한 판매장번로를 이용하여 iframe reload 한다.*/
	$("#sort_select").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
			document.getElementById("nh_leaflet").src = "../app/shop/shop.html?vm_cp_no="+getCookie("onSelectCompanyNo");
		}
	});
	/* 공통부분 종료======================================================================== */

	/* 전단의 상품을 리스팅한다 */
	getPdOrder(targetCompanyNo);

	/*최초 해당 판매장의 장보기 전단번호를 가지고 온다.*/
	shop_jd_no_select(targetCompanyNo);

	/* 해당 메뉴에 전단이 셋팅되어 있지 않으면, 전단삭제 버튼을 숨긴다. */
	if (getCookie("jd_no") == "null")
	{
//		$(".leaflet_del_prod").hide();
		$(".leaflet_new").hide();
		$(".leaflet_del").hide();
	}else{
//		$(".leaflet_del_prod").show();
		$(".leaflet_new").show();
		$(".leaflet_del").show();
	}

	/* 앱의 장보기화면을 호출한다. */
	document.getElementById("nh_leaflet").src = "../app/shop/shop.html?vm_cp_no="+targetCompanyNo;

	/* 20200127 - 배송기능미사용으로 설정시, 알럿을 띄우고, 판매장설정화면으로 이동 */
	if ( getCookie("VM_delivery_FG") != "Y" && vm_cp_no != "0" )
	{
		alert("현재 배송기능 미사용으로 설정되어 있습니다. 해당메뉴로 이동합니다.");
		location.href="/manage/shop_update.html?no="+vm_cp_no;
	}
	
});

function history_back(){
	history.back();
}

/*최초 해당 판매장의 장보기 전단번호를 가지고 온다.*/
function shop_jd_no_select(rcvtargetCompanyNo){

	$.ajax({
        url:'/back/09_shop/shopJdNoSelect.jsp?random=' + (Math.random()*99999),
		data : {vm_cp_no: rcvtargetCompanyNo},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['PdOrderList'].forEach(function(item, index){                        
				
				setCookie1("shop_jb_no",(decodeURIComponent(item['shop_jd_no'])));
				
			});
			
			

        }
    });
}

// 상품삭제 버튼 클릭시, 함수실행된다.
function delete_btn(){ 
	if (confirm("정말 삭제하시겠습니까??") == true){
		$.ajax({
			url:'/back/09_shop/leafletJdProdConNoDelete.jsp?random=' + (Math.random()*99999),
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

//// 장보기삭제 버튼 클릭시, 함수실행된다.
//function delete_jdbtn(){ 
//	if (confirm("현재 장보기를 삭제하시겠습니까??") == true){
//		$.ajax({
//			url:'/back/09_shop/leafletJdDelete.jsp?random=' + (Math.random()*99999),
//			data : {jd_no: getCookie("jd_no")},
//			method : 'GET' 
//		}).done(function(result){
//
//			console.log("noticeList=========================================");
//			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
//				console.log(result);
//			}else{
//				console.log("============= notice callback ========================");
//				console.log(result);
//				alert("삭제 완료되었습니다.");
//				$('#nh_leaflet').get(0).contentDocument.location.reload();
//				setTimeout(function(){ cssRetach(); }, 1500);
//			}
//		});
//
//	}else{   //취소
//		return;
//	}
//}


/*판매장 변경시, iframe reload 한다.*/
$("#sort_select").on("change",function(){
	if ($("#sort_select").val() == "" )
	{
	}else{
		document.getElementById("nh_leaflet").src = "../app/shop/shop.html?vm_cp_no="+vm_cp_no;
	}
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
        url:'/back/09_shop/leafletPdThumnailInsert.jsp?random=' + (Math.random()*99999),
		data : {imgPath: imgPath, pdNo: pd_no_thum, pdCode: pd_code_thum},
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
        url:'/back/09_shop/leafletPdThumnailUpdate.jsp?random=' + (Math.random()*99999),
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
			$('#nh_leaflet').get(0).contentDocument.location.reload();
					
//			setTimeout(function(){ ThumCSS(); }, 1500);
			setTimeout(function(){ cssRetach(); }, 1500);

        }
    });
}

// 상품오더 순서를 가져온다.
function getPdOrder(rcvTargetCompanyNo) {
//	rcvJdNo = getCookie("jd_no");
    $.ajax({
        url:'/back/09_shop/leafletPdOrder.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: rcvTargetCompanyNo},
        method : 'GET'
    }).done(function(result){

        console.log("PdOrderList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= PdOrderList callback ========================");
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

// 검색결과를 가져온다.
$("#thum_search_btn").on("click",function(){

	var searchText = $("#searchText").val();

	if ( searchText == null || chrLen(searchText) == 0)
	{
		alert("검색어를 입력하시기 바랍니다.");
		return false;
	}

    $.ajax({
        url:'/back/09_shop/leafletSearchList.jsp?random=' + (Math.random()*99999), 
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
        url:'/back/09_shop/leafletPdNameUpdate.jsp?random=' + (Math.random()*99999),
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
        url:'/back/09_shop/leafletPriceUpdate.jsp?random=' + (Math.random()*99999),
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
            $(".leaflet_goods_price").removeClass("active");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품을 개별등록한다.*/
$("#pd_create_btn").on("click",function(){

	if (getCookie("userRoleCd") == "ROLE2")
	{
		var userCompanyNo = getCookie("userCompanyNo");
	}else{
		var userCompanyNo = getCookie("onSelectCompanyNo");
	}

	var user_no = getCookie("userNo");
	var pd_order = $("#pd_order").val();
	var pd_code = $("#pd_code").val();
	var pd_name = $("#pd_name_new").val();
	var pd_price = $("#pd_price").val();
	var etc_info = $("#etc_info").val();
	

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

	$.ajax({
        url:'/back/09_shop/leafletProductInsert.jsp?random=' + (Math.random()*99999),
		data : {user_no: user_no, pd_order: pd_order, pd_code: pd_code, pd_name: pd_name, pd_price: pd_price, etc_info: etc_info, userCompanyNo: userCompanyNo},
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
			$('#nh_leaflet').get(0).contentDocument.location.reload();

            $("#pd_code").val("");
            $("#pd_name_new").val("");
            $("#pd_price").val("");
            $("#etc_info").val("");
            
            $(".new_item_wrap").css("display","none");
			setTimeout(function(){ cssRetach(); }, 1500);
			
        }
    });
});

$("#nh_leaflet").load(function(){

		setTimeout(function(){ cssRetach(); }, 2000);
           
    })


function cssRetach(){
	$("#nh_leaflet").contents().find("#cart_btn").hide();

	$("#nh_leaflet").contents().find("body").append("<link href='../css/leaflet_iframe.css'><style>.bx-wrapper{cursor:pointer; max-width:100% !important; min-width:100% !important; width:100% !important; box-shadow : none;}.bx-wrapper:hover{background-color:#527eff; } .bx-wrapper.active{background-color:#527eff !important} .date_item_wrap{cursor:pointer} #cart_btn{display:none;}</style>");
       
	   $("#nh_leaflet").contents().find(".date_item_wrap").click(function(){
			   $(".new_item_wrap").hide();
			   $(document).find(".leaflet_edit_wrap>div").removeClass("active");
               $("#nh_leaflet").contents().find(".thumb_wrap>a>img, .price,  .product,.item_list_banner_wrap").css("background-color","#fff");
               $("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
               $(this).css("border","2px solid #4ba8ff");
			   $(document).find(".leaflet_date").toggleClass("active");
	   });	   

       $("#nh_leaflet").contents().find(".bx-wrapper").click(function(){
//	   $("#nh_leaflet").contents().find(".bx-wrapper").bind("mouseover",function(){
           $("#nh_leaflet").contents().find(".thumb_wrap>a>img, .price, .product,.item_list_banner_wrap,.date_item_wrap").css("background-color","#fff");
            $("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
           $(this).addClass("active");
		   $("#sortable").empty();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_banner").toggleClass("active");

//		   $('#nh_leaflet')[0].contentWindow.getBannerList(getCookie("jd_no"));
       });
        
 

        $("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
           $(".new_item_wrap").hide();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_image").toggleClass("active");
        });
           
        $("#nh_leaflet").contents().find(".product").click(function(){
           $(".new_item_wrap").hide();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_goods_name").toggleClass("active");
        });

        $("#nh_leaflet").contents().find(".price").click(function(){
           $(".new_item_wrap").hide();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_goods_price").toggleClass("active");
        });
           
        $("#nh_leaflet").contents().find(".discount_info").click(function(){
           $(".new_item_wrap").hide();
           $(document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(document).find(".leaflet_discount").toggleClass("active");              
        });

           
        $(".cls_btn").click(function(){
           $("#nh_leaflet").contents().find(".item_list_banner_wrap").removeClass("active");
           $(this).parent("div").removeClass("active");
        });

		
}