var newShortURL;

$(function () {
	

	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호
	menu_no  = getParameterByName('menu_no');    // 메뉴번호
	jd_no    = getParameterByName('jd_no');      // 전단번호
	
	// 앱 또는 모바웹을 통해서 개인정보동의 화면부터 접근할 경우, 메인화면에 도달하면,
	// 판매장 정보가 셋팅된 상태이다. 이 판매장번호를 통해 해당 판매장의 메뉴리스트를
	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.

	// if (vm_cp_no == "") console.log("11111111111111");
	
	// if( vm_cp_no == null) console.log("2222222222222");
	
	// if( vm_cp_no == "undefined") console.log("3333333333333333");
	
	// if( typeof vm_cp_no == "undefined") console.log("444444444444444444");
	
	
	if (vm_cp_no == "") 
	{
		// vm_cp_no = getCookie("userCompanyNo");
		vm_cp_no = localStorage.getItem("vm_cp_no");
	}

	// logInsert(localStorage.getItem("tel"), vm_cp_no, menu_no);
	logInsert(localStorage.getItem("memberNo"), vm_cp_no, menu_no);

	getHeader(vm_cp_no);
	//stopHeader();
	
	//$("header").hide(); //해더 숨김

    getShare();
	getLeft();

	getCpName(vm_cp_no, menu_no, jd_no);

	setTimeout(function(){ getCpName(vm_cp_no); }, 1500);
	setTimeout(function(){ clickEventApp(); }, 2000);

    /*판매장 변경시, iframe reload 한다.*/
    $("#title_anibox_banner").on("click",function(){
        if ( getCookie("jd_no") == "" )
        {            
            alert("먼저 전단을 제작하여 등록하시기 바랍니다.");
            $(parent.document).find(".leaflet_banner").hide();      
        }else{   
        }
    });

	var windowWidth = $( window ).width();

	sliderInstance = $('.bxslider').bxSlider({
		auto: true,
        autoControls: false,
        controls: false,
		pager: false,
		infiniteLoop: false,
		minSlides: 1,
		maxSlides: 1,
		slideWidth: windowWidth,
		moveSlides: 1
	});

	document.addEventListener('contextmenu', function() {
	  event.preventDefault();
	});

	document.addEventListener('mousedown', function() {
	  if ((event.button == 2) || (event.which == 3)) {

		/* 20191227 도메인뒤 역슬래쉬 삭제 */
		var newURL = "" + window.location.pathname;
		//console.log(newURL+"?vm_cp_no="+vm_cp_no+"&menu_no="+menu_no+"&jd_no="+getCookie("jd_no"));
		getShortURL(newURL+"?vm_cp_no="+vm_cp_no+"&menu_no="+menu_no+"&jd_no="+getCookie("jd_no"));
		
		setTimeout(function(){ 
			copy_to_clipboard(newShortURL);
			alert("붙여넣어 사용하시기 바랍니다.");
		}, 2000);
	  }
	});

//	iframeScroll();

	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$("#item_list_inner_wrap").sortable({
		  items: "div.figure:not(.ui-state-disabled)",
		  update: function () {
				  var strItems = "";
				  $("#item_list_inner_wrap").children().each(function (q) {
						var divv = $(this);
						strItems += divv.attr("id") + ',';
				  });
				localStorage.setItem("Array_1",strItems.substr(0,strItems.length-1));
				//DB 저장순서.

					$.ajax({
						url:'/back/03_leaflet/leafletPdConOrderUpdate.jsp?random=' + (Math.random()*99999), 
						data : {orderArray: localStorage.getItem("Array_1")},
						method : 'GET' 
					}).done(function(result){

						console.log("leafletPdConOrderUpdate=========================================");
						if(result == ('NoN') || result == 'list error' || result == 'empty'){
							console.log(result);
						}else{
							$("#cpName").empty();
							console.log("============= leafletPdConOrderUpdate callback ========================");
							console.log(result);
							
						}
					});

				}
	   });

//		 .on("click",".thumb_wrap",function(e) {
//		    e.preventDefault();
//			$("#item_list_inner_wrap").sortable("disable");
//	   }).on("touchstart",".thumb_wrap",function(e) {
//		    e.preventDefault();
//			$("#item_list_inner_wrap").sortable("disable");
//	   });
		

	   }else{
	}

	moveStop();

});

//header 멈추기

function moveAlive(){
	$("#item_list_inner_wrap").sortable("enable");
}

function moveStop(){
	$("#item_list_inner_wrap").sortable("disable");
}

function is_ie() {
  if(navigator.userAgent.toLowerCase().indexOf("chrome") != -1) return false;
  if(navigator.userAgent.toLowerCase().indexOf("msie") != -1) return true;
  if(navigator.userAgent.toLowerCase().indexOf("windows nt") != -1) return true;
  return false;
}
 
function copy_to_clipboard(str) {
  if( is_ie() ) {
    window.clipboardData.setData("Text", str);
    alert("복사되었습니다.");
    return;
  }
  prompt("Ctrl+C를 눌러 복사하세요.", str);
}


//아이프레임 내부 스크롤바 보이게 하기
//function iframeScroll(){
//	if( is_ie ){
//	
//		$("#headerMenuArea").css("overflow-x","scroll");
//		$("body").addClass("show-scrollbar");
//		
//	}
//
//}


// 단축 URL 을 구성한다.
function getShortURL(rcvURL){

	$.ajax({
        url:'/back/02_app/mLeafletNaverShortURL.jsp?random=' + (Math.random()*99999), 
        data : {rcvText: encodeURIComponent(rcvURL)},
        method : 'GET' 
    }).done(function(result){

        console.log("mLeafletNaverShortURL=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            //console.log(result);
        }else{
            console.log("============= mLeafletNaverShortURL callback ========================");
            console.log(result);
            var data = result.trim();
			var data = JSON.parse(data);
			console.log(data["result"].url);
			newShortURL = data["result"].url;
        }
    });
}

// 판매장 이름을 변경한다.
function getCpName(vm_cp_no){

	$.ajax({
        url:'/back/02_app/mLeafletCpName.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("mLeafletCpName=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#cpName").empty();
            console.log("============= mLeafletCpName callback ========================");
            console.log(result);
            var data = JSON.parse(result);
            
			data['CompanyName'].forEach(function(item, index){ 
				$("#cpName").append(decodeURIComponent(item['vm_cp_name']).replace(/\+/g,' '));
			});
			
        }
    });
	getDateInterval();
}

var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		/*배너 이미지파일 업로더*/
		var enterUpload = window.parent.document.getElementById('banner_add_btn');
		enterUpload.addEventListener('click', function(evt){
			var inputFile = window.parent.document.getElementById('uploadFile');
			new bannerUpload(inputFile, function(result){
				window.parent.$("#new_banner_path").val(result);			
				var jd_no = getCookie("jd_no");
				if ( result == null || chrLen(result) == 0)
				{
					alert("배너 이미지를 업로드하시기 바랍니다.");
					return false;
				}else{
					bannerInsert(result);	
				}					
			});
		});
	}else{
}

function bannerInsert(rcvResult){

	$.ajax({
				url:'/back/03_leaflet/leafletBannerInsert.jsp?random=' + (Math.random()*99999),
				data : {jd_no: jd_no, img_path: rcvResult},
				method : 'GET' 
				}).done(function(result){

					console.log("leafletBannerInsert=========================================");
					if(result == ('NoN') || result == 'exception error' || result == 'empty'){
						console.log(result);
					}else{
						$("#noticeList").html("");
						console.log("============= leafletBannerInsert callback ========================");
						console.log(result);
					}
				});
				alert("배너 업로드 완료하였습니다.");
				$(parent.document).find(".leaflet_banner").removeClass("active");
				window.location.reload();

}

// 전단 기간을 가져온다
function getDateInterval() {
	if (menu_no == "")
	{
		menu_no = localStorage.getItem("initMenuNo");
	}

	//alert(vm_cp_no,"/",menu_no);

    $.ajax({
        url:'/back/02_app/mLeafletDateCategory.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: vm_cp_no, menuNo: menu_no},
        method : 'GET' 
    }).done(function(result){

        console.log("mLeafletDateCategory=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= mLeafletDateCategory callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			$("#title_anibox").empty();

            data['DateCategoryList'].forEach(function(item, index){                        
                
				if (decodeURIComponent(item['menu_type_cd']) == "MENU1" || decodeURIComponent(item['menu_type_cd']) == "MENU2" || decodeURIComponent(item['menu_type_cd']) == "MENU3")
				{
					$("#title_anibox").append('<li class="date_item" id="CT_'+decodeURIComponent(item['jd_no'])+'" data-jd_no="'+decodeURIComponent(item['jd_no'])+'" onclick="getDateThree('+decodeURIComponent(item['jd_no'])+', \''+decodeURIComponent(item['from_date_origin']).replace(/\+/g,' ')+'\', \''+decodeURIComponent(item['to_date_origin']).replace(/\+/g,' ')+'\')">'+decodeURIComponent(item['from_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['from_date_weekday']).replace(/\+/g,' ')+')~ '+decodeURIComponent(item['to_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['to_date_weekday']).replace(/\+/g,' ')+')</li>');
				}else{
					$("#title_anibox").append('<li class="date_item" id="CT_'+decodeURIComponent(item['jd_no'])+'" data-jd_no="'+decodeURIComponent(item['jd_no'])+'" onclick="getDateThree('+decodeURIComponent(item['jd_no'])+', \''+decodeURIComponent(item['from_date_origin']).replace(/\+/g,' ')+'\', \''+decodeURIComponent(item['to_date_origin']).replace(/\+/g,' ')+'\')">'+decodeURIComponent(item['from_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['from_date_weekday']).replace(/\+/g,' ')+')</li>');
				}

				init_jd_no = decodeURIComponent(item['jd_no']);
				setCookie1("jd_no",decodeURIComponent(item['jd_no']), 1);
				setCookie1("curJd"+index, decodeURIComponent(item['jd_no']));

				if(jd_no == "" || jd_no == "-1"){
					if (decodeURIComponent(item['today_fg']) == "Y"){ //오늘자 전단 일자슬라이드 선택 및 상세내역 출력
						setTimeout(function(){ date_slider(Number(index)); }, 100);
						getBanner(decodeURIComponent(item['jd_no']));
						getPdContent(decodeURIComponent(item['jd_no']));
					}
				}else{
					if (decodeURIComponent(item['jd_no']) == jd_no){
						setTimeout(function(){ date_slider(Number(index)); }, 100);
						getBanner(decodeURIComponent(item['jd_no']));
						getPdContent(decodeURIComponent(item['jd_no']));
					}
				}
				
			});
        }
    });
}

// 전단기간일 정보를 부모창에 바인딩한다.
function getDateThree(jdNo, startDate, endDate){
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find(".leaflet_del").hide();
		window.parent.document.getElementById("jd_no").value = jdNo;
		window.parent.document.getElementById("from_date_origin").value = startDate;
		window.parent.document.getElementById("to_date_origin").value = endDate;
	}else{
	
	}
}

// 전단 배너를 가져온다.
function getBanner(rcv_jd_no_b) {

    $.ajax({
        url:'/back/02_app/mLeafletBanner.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: vm_cp_no, menuNo: menu_no, jd_no: rcv_jd_no_b},
        method : 'GET' 
    }).done(function(result){

        console.log("BannerList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
			$(".bxslider").html("");

            console.log(result);
			$(".bx-wrapper").css({minHeight:'3px', height:'3px'});
			$(".bx-pager-item").hide();

			
        }else{
            $(".bxslider").html("");

            console.log("============= notice callback ========================");
            console.log(result);
			$(".bxslider").css({minHeight:'75px', height:'75px', position:'relative'});

            var data = JSON.parse(result);

            data['BannerList'].forEach(function(item, index){  
                var isInIFrame = ( window.location != window.parent.location );
                if (isInIFrame == true)
                {

//                    $(".bxslider").append('<li onclick="getBannerList('+decodeURIComponent(item['jd_no'])+');"><img src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" ></li>');
					$(".bxslider").append('<li><img style="width:100%;" onclick="getBannerList('+decodeURIComponent(item['jd_no'])+');" src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" ></li>');
				}else{
                    $(".bxslider").append('<li><img style="width:100%;" src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" ></li>');
                }
            });
            
			sliderInstance.reloadSlider();

        }
		
    });
}

// 전단 배너리스트를 부모창에 가져온다.
function getBannerList(rcv_jd_no_p_b) {
	window.parent.cssRetach();
	$(parent.document).find(".leaflet_del").hide();
    $.ajax({
        url:'/back/02_app/mLeafletBannerList.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: vm_cp_no, menuNo: menu_no, jd_no: rcv_jd_no_p_b},
        method : 'GET' 
    }).done(function(result){
		console.log(result);
        console.log("bannerParentList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){

			window.parent.$("#sortable").empty();

        }else{
            console.log("============= bannerParentList callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			window.parent.$("#sortable").empty();

            data['BannerList'].forEach(function(item, index){ 
				if (decodeURIComponent(item['visible_fg']) == "Y")
				{
					window.parent.$("#sortable").append('<li class="ui-state-default leaflet_banner_hover" id="'+decodeURIComponent(item['jb_no'])+'"><img src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" alt=""><span>숨기기</span>');
				}else{
					window.parent.$("#sortable").append('<li class="ui-state-default leaflet_banner_hover" id="'+decodeURIComponent(item['jb_no'])+'"><img src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" alt=""><span class="active">숨기기</span>');
				}
            });

//			window.parent.$(".leaflet_banner").addClass("active");

			// 부모창 우측 배너 리스트의 정렬 순서를 cookie에 저장한다.
			window.parent.$("#sortable").sortable({
				  items: "li:not(.ui-state-disabled)",
				  update: function () {
							var strItems = "";

							window.parent.$("#sortable").children().each(function (i) {
								var li = $(this);
								strItems += li.attr("id") + ':' + i + ',';
							});
							console.log(strItems);
							setCookie1("bannerOrderStr",strItems);
							}
			   });

			window.parent.$(".leaflet_banner_hover").click(function(){
				$(this).children("span").toggleClass("active");
				
				bannerHoverId = $(this).attr("id");

				$.ajax({
					url:'/back/03_leaflet/leafletBannerHide.jsp?random=' + (Math.random()*99999),
					data : {jb_no: bannerHoverId }
				}).done(function(result){

					console.log("noticeList=========================================");
					if(result == ('NoN') || result == 'exception error' || result == 'empty'){
						console.log(result);
					}else{
						console.log("============= notice callback ========================");
						console.log(result);
						alert("숨기기 수정이 완료되었습니다.");

						$(parent.document).find(".leaflet_banner").removeClass("active");
						window.location.reload();						
					}
				});
			});
        }
    });

}

// 전단 컨텐츠 상품리스트를 불러온다.
// .replace(/\+/g,' ')
function getPdContent(rcv_jd_no) {

    $.ajax({
        url:'/back/02_app/mLeafletPdContent.jsp?random=' + (Math.random()*99999), 
        data : {jd_no: rcv_jd_no, tel: localStorage.getItem("tel")},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			text +='<div class="list_no_item">준비중입니다.</div>'

			$("#item_list_inner_wrap").empty();
			$("#item_list_inner_wrap").append(text);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['PdContentList'].forEach(function(item, index){    
				
//				alert(item['pd_name']);
//				alert(decodeURIComponent(item['pd_name']));

				var figure_type_cd = "";
				var isInIFrame = ( window.location != window.parent.location );

				if ( item['menu_type_cd'] == "MENU1" || item['menu_type_cd'] == "MENU4" )
				{
					figure_type_cd = "figure1";
				}else if ( item['menu_type_cd'] == "MENU2" || item['menu_type_cd'] == "MENU5" )
				{
					figure_type_cd = "figure2";
				}else{
					figure_type_cd = "figure3";
				}

				text += '<div class="figure '+figure_type_cd+'" id='+item['jd_prod_con_no']+'>'
                text += '   <div class="thumb_wrap">'
                text += '		<a href="#" onclick="setThumImg('+item['jd_prod_con_no']+', '+item['pd_no']+', \''+item['pd_code']+'\');"><img src="'+item['img_path']+'" alt="'+item['pd_name']+'"></a>'
                text += '		<div class="thumb_info">'
				
				if(isInIFrame == true){
				
				}else{
					if (localStorage.getItem("tel") != '')
					{
							if (item['img_path'] == "/upload/blank.png")
							{
							}else{
								if (item['vmjz_no'] != '')
								{
									text += '			<div class="add_btn active" onclick="addRmZzim('+item['jd_prod_con_no']+');"><img src="../images/like2.png" alt="추가"></div>'   
								}else{
									text += '			<div class="add_btn" onclick="addRmZzim('+item['jd_prod_con_no']+');"><img src="../images/like2.png" alt="추가"></div>'
								}		
							}
					}else
					{
					}
				}
				
                
				text += '		</div>'
                text += '		<div class="discount_info">'

				// 최종혜택(20200603 김수경 추가)
				if (item['card_discount'] != "" && item['coupon_discount'] != "")
				{
					text += '		<img src="../images/leaflet_icon0.png" alt="최종혜택">'
				// 카드할인
				}else if (item['card_discount'] != "")
				{
					text += '		<img src="../images/leaflet_icon1.png" alt="카드할인">'
				// 쿠폰할인
				}else if (item['coupon_discount'] != "")
				{
					text += '		<img src="../images/leaflet_icon2.png" alt="쿠폰할인">'
					text += '       '
				// 다다익선
				}else if (item['dadaiksun'] != "")
				{
					text += '		<img src="../images/leaflet_icon3.png" alt="다다익선">'
					text += '       '
				// 적용사항 없음
				}else{
					text += '		<img src="../images/leaflet_icon4.png" alt="">'
					text += '       '
				}

				//카드 할인기간을 카드에 한정하지 않고 값이 있을경우 표시되도록 용도변경
				if (item['card_discount_from_date'] != "" && item['card_discount_end_date'] != ""){
					text += '		<span>'+item['card_discount_from_date']+'~'+item['card_discount_end_date']+'</span>'
				}else if(item['card_discount_from_date'] != ""){
					text += '		<span>'+item['card_discount_from_date']+'</span>'
				}else if(item['card_discount_end_date'] != ""){
					text += '		<span>'+item['card_discount_end_date']+'</span>'
				}else{
				}
								
                text += '		</div>'
                text += '   </div>'
                text += '   <div class="product_detail" onclick="setPdDetail('+item['jd_prod_con_no']+', \''+item['pd_name']+'\', \''+item['price']+'\')">'
                text += '       <a class="product">'+item['pd_name']+'</a>'
				if (item['img_path'] == "/upload/blank.png"){
				}else{
					text += '       <a class="price">'+comma(item['price'])+'</a>' //2020-05-07 원 삭제 - 미솔
				}

				//200603 김수경 최종혜택가 표시
				if (item['card_discount'] != "" && item['coupon_discount'] != ""){
					var summed = Number(item['price']) - Number(item['card_discount']) - Number(item['coupon_discount']);
					text += '    	  <a class="price4">'+comma(summed)+'</a>'
			    }else if (item['card_discount'] != "")
				{
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '   <a class="price2">'+comma(carded)+'</a>' //2020-05-07 원 삭제 - 미솔
				}else if(item['coupon_discount'] != "")
				{

					//2020-06-03 김수경 쿠폰할인가 살림		
					//                    var couponed = Number(decodeURIComponent(item['price']).replace(/\+/g,' ')) - Number(decodeURIComponent(item['coupon_discount']).replace(/\+/g,' '));
					//					text += '   <a class="price3">'+comma(couponed)+'원</a>'
					var couponed = Number(item['price']) - Number(item['coupon_discount']);
					text += '   <a class="price3">'+comma(couponed)+'</a>'					
				}else{
                    
                }

                text += '    </div>'

				text += '    <div class="leaflet_cont">'
				text += '       <div class="leaflet_modal_wrap">'
				text += '    	  <div class="modal_cls"><img src="../images/leaflet_cls.png" alt="리플렛닫기"></div>'
				text += '    	  <div class="leaflet_thumb_wrap">'
				text += '    		 <img src="'+item['img_path']+'" alt="'+item['pd_name']+'">'
				text += '    	  </div>'
				text += '    	  <div class="leaflet_modal_title">'+item['pd_name']+'</div>'
				text += '    	  <div class="leaflet_modal_price">'+comma(item['price'])+'원</div>'
									
				text += '    	  <div class="leaflet_txt">'
				text += '    		  <div class="leaflet_discount">'                 
				text += '    			 <h5>혜택 및 상품 정보 안내</h5>'
				text += '    			 <div id="table">'
				
				text += '    				<table class="table" >'

				// 2020-06-08 정미솔 테이블 수정, class추가

				// 할인기간
				if (decodeURIComponent(item['card_discount_from_date']) != "" || decodeURIComponent(item['card_discount_end_date']) != ""){
					text += '    				   <tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <h6 class="discount_period">할인기간</h6>'
					text += '    						  </div>'
					text += '    					   </td>'					
					text += '    					  <td class="discount2" colspan="2" width="80%"> '
					if (item['card_discount_from_date'] != "" && item['card_discount_end_date'] != ""  && item['card_discount_from_date'] != item['card_discount_end_date'] ){
						text += '                        '+ item['card_discount_from_date'] + ' ~ ' + item['card_discount_end_date']
					}else if(item['card_discount_from_date'] != "" && item['card_discount_from_date'] == item['card_discount_end_date']){
						text += '                        '+ item['card_discount_from_date']
					}else if(item['card_discount_from_date'] != ""){
						text += '                        '+ item['card_discount_from_date']
					}else if(item['card_discount_end_date'] != ""){
						text += '                        '+ item['card_discount_end_date']
					}else{
					}					
					text += '    					  </td>'
					text += '    					</tr>'
				}
				
				// 카드할인
				if (decodeURIComponent(item['card_discount']) != ""){
					text += '    				   <tr class="hide table-line">'
					text += '    					  <td width="20%">'
					text += '    						<div class="discount_img">'
					text += '    							<h6 class="discount_card">카드할인</h6>'
					text += '    						</div>'
					text += '    					  </td>'
					text += '    					  <td width="30%">'
					text += '                         '+comma(item['card_discount'])+'원'
					text += '    					  </td>'
					text += '    					  <td width="50%">'
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '    	  					<div class="leafletmodal_price"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">카드할인가</h6> '+comma(carded)+' <h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">원</h6></div>'
					text += '    					  </td>'
					text += '    					</tr>'
					text += '    				   <tr class="hide table-line">'
					text += '    					  <td class="card_s" colspan="3">'
					text += '    					   '+item['card_info']
					text += '    					   / '+item['card_restrict']
					text += '    					  </td>'
					text += '    					</tr>'
				}

				//쿠폰할인
				if (decodeURIComponent(item['coupon_discount']) != ""){
					text += '    					<tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <h6 class="discount_coupon">쿠폰할인</h6>'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					  <td width="30%">'					
					//2020-06-03 김수경 쿠폰 추가할인 문구 삭제				
					text += '    					   '+comma(item['coupon_discount'])+'원'					
					// text += '    					   '+ decodeURIComponent(item['coupon_discount']).replace(/\+/g,' ')+'원'
					text += '    					  </td>'
					text += '    					  <td width="50%">'		
					var couponed = Number(item['price']) - Number(item['coupon_discount']);	
					text += '    	  					<div class="leafletmodal_price2"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">쿠폰할인가</h6> '+comma(couponed)+' <h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">원</h6></div>'		
					text += '    					  </td>'	
					text += '    					 </tr>'
				}

				//최종혜택(200603 김수경 추가)
				if (item['card_discount'] != "" && item['coupon_discount'] != ""){
					text += '    					<tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <h6 class="discount_last">최종혜택</h6>'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					  <td width="30%">'		
					var cardncoupon = Number(item['card_discount']) + Number(item['coupon_discount']);
					text += '    					   '+comma(cardncoupon)+'원'
					text += '    					  </td>'
					text += '    					  <td width="50%">'		
					text += '    	  						<div class="leafletmodal_price3"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">최종혜택가</h6> '+comma(summed)+' <h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">원</h6></div>'
					text += '    					  </td>'
					text += '    					 </tr>'
				}
				
				//다다익선
				if (decodeURIComponent(item['dadaiksun']) != ""){				
					text += '    					<tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <h6 class="discount_m">다다익선</h6>'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					  <td width="30%">'					
					text += '    					   '+item['dadaiksun']
					text += '    					  </td>'
					text += '    					  <td width="50%">'					
					text += '    					   '+item['dadaiksun_info']
					text += '    					  </td>'			
					text += '    					 </tr>'
				}

				//기타내용
				if (decodeURIComponent(item['etc']) != ""){		
					text += '    					<tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <h6 class="discount_e">기타사항</h6>'
					text += '    						  </div>'
					text += '    					   </td>'					
					text += '    					  <td class="discount2" colspan="2" width="80%">'				
					text += '                            '+ decodeURIComponent(item['etc'])
					text += '    					  </td>'
					text += '    					 </tr>'							
				}
				
				text += '    				 </table>'
				text += '    			 </div>'
				text += '    			   <span class="discount_notice">※상품의 가격 및 내용은 공급자 사정에 따라 다소 변경될 수 있으며 조기품절 될 수 있습니다. <br> ※일부 상품 사진은 이미지컷입니다. <br> ※카드/쿠폰할인,다다익선은 매장방문고객에 한합니다.</span>'
				text += '    		  </div>'
				text += '    	   </div>'
				text += '    	</div>'
				text += '    </div>'
				text += '</div>'

            });

			$("#item_list_inner_wrap").empty();
			$("#item_list_inner_wrap").append(text);

        }
    });
}
// 2020-06-08 정미솔 테이블 수정, class추가


// 썸네일이미지를 업데이트시 사용할 정보를 부모창에 바인딩한다.
function setThumImg(rcvJdProdConNo, rcvPdNo, rcvPdCode){
        
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{

		$(parent.document).find(".leaflet_del").show();

		setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);

		$("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
           $(".new_item_wrap").hide();
           $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(parent.document).find(".leaflet_image").toggleClass("active");
            
        });

		window.parent.document.getElementById("jd_prod_con_no_prod_thum").value = rcvJdProdConNo;
		window.parent.document.getElementById("pd_no_thum").value = rcvPdNo;
		window.parent.document.getElementById("pd_code_thum").value = rcvPdCode;

		$(".thumb_wrap").click(function(){
		   $(parent.document).find(".new_item_wrap").hide();
		   $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
		   $(parent.document).find(".leaflet_image").toggleClass("active");
             $(".thumb_wrap,.item_list_banner_wrap").css("background-color","#fff");
            $(".thumb_wrap, .date_item_wrap").css("background-color","#fff");
            $(this).css("border","2px solid #4ba8ff")
		});
	}else{
	
	}
}

// 세일 정보를 부모창에 바인딩한다.
function setPdDetail(rcvJdProdConNo, rcvPdName, rcvPrice){
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find(".leaflet_del").hide();

		setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);

		$.ajax({
			url:'/back/03_leaflet/leafletProdSaleDetail.jsp?random=' + (Math.random()*99999), 
			data : {jd_prod_con_no: rcvJdProdConNo},
			method : 'GET'  
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){
				console.log(result);
			}else{
				$("#noticeList").html("");
				console.log("============= notice callback ========================");
				console.log(result);
				var data = JSON.parse(result);

				data['saleList'].forEach(function(item, index){                        
					window.parent.document.getElementById("card_discount").value = item['card_discount'];                   
					window.parent.document.getElementById("card_discount_from_date").value = item['card_discount_from_date'];
					window.parent.document.getElementById("card_discount_end_date").value = item['card_discount_end_date'];
					window.parent.document.getElementById("card_info").value = item['card_info'];
					window.parent.document.getElementById("card_restrict").value = item['card_restrict'];
					window.parent.document.getElementById("coupon_discount").value = item['coupon_discount'];
					window.parent.document.getElementById("dadaiksun").value = item['dadaiksun'];
					window.parent.document.getElementById("dadaiksun_info").value = item['dadaiksun_info'];
				});

			}
		});

		$(".product_detail").click(function(){
            $(".product_detail").css("background-color","#fff");
            $(this).css("background-color","#4ba8ff3d");
            $(parent.document).find(".new_item_wrap").hide();
            $(".black_modal").hide();
            $("#leafletEditWrap").css("right","-100%")
           $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(parent.document).find(".leaflet_discount").toggleClass("active");
        });
        
        window.parent.document.getElementById("pd_name").value = rcvPdName;
		window.parent.document.getElementById("jd_prod_con_no_prod_name").value = rcvJdProdConNo;
        window.parent.document.getElementById("price").value = rcvPrice;
		window.parent.document.getElementById("jd_prod_con_no_price").value = rcvJdProdConNo;

	}else{
	
	}
}


function clickEventApp(){

	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{ 
		$(".leaflet_cont").removeClass("active");
	}else{ 
		$(".product_detail").click(function(){
			   $(this).parent(".figure").children(".leaflet_cont").addClass("active");
		})
        $(".thumb_wrap>a>img").click(function(){
			   $(this).closest(".thumb_wrap").siblings(".leaflet_cont").addClass("active");
		})
		$(".modal_cls").click(function(){
			   $(this).closest(".leaflet_cont").removeClass("active");
		})
		$(".add_btn").click(function(){             
			 var classActive = $(this).is(".active");
            if( classActive == true){
                $(this).removeClass("active");
            }else{
                 $(this).addClass("active");
            }
		})
	}

}

//header 멈추기

function stopHeader(){
     $("#alert, #search, #cart, nav ul li").click(function(){
            alert("준비중입니다.");
        })
}

/* 찜하기 버튼 클릭한다. */
function addRmZzim(rcv_jd_prod_con_no){
	$.ajax({
        url:'/back/02_app/mLeafletZzim.jsp?random=' + (Math.random()*99999),
		data : {
			tel: localStorage.getItem("tel"), 
			jd_prod_con_no: rcv_jd_prod_con_no, 
			vm_cp_no: vm_cp_no
			},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
        }
    });
}

// 행사/전단의 좌측 메뉴 클릭시, iframe src 호출용 함수이다.
function leafletLink(rcv_jd_no, rcv_menu_no, rcv_vm_cp_no, rcv_menu_type_cd){
	
	setCookie1("jd_no",rcv_jd_no);
	setCookie1("menu_no",rcv_menu_no);
	setCookie1("menu_type_cd",rcv_menu_type_cd);

	/* 페이지 로딩시, 최초 상품컨텐츠선택을 초기화한다. */
	setCookie1("jd_prod_con_no","", 1);	

	/* 해당 메뉴에 전단이 셋팅되어 있지 않으면, 전단삭제 버튼을 숨긴다. */
	if (getCookie("jd_no") == "null")
	{
//		$(".leaflet_del_prod").hide();
//        $("#newLeafletAdd").hide();
		$(".leaflet_del").hide();
	}else{
//		$(".leaflet_del_prod").show();
// 		$("#newLeafletAdd").show();
		if ( getCookie("jd_prod_con_no") == "" )
		{
			$(".leaflet_del").hide();
		}else{
			$(".leaflet_del").show();
		}
	}

	 window.parent.document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no+"&jd_no="+rcv_jd_no;
}