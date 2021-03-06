//var newShortURL;

$(function () {
	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호
	menu_no  = getParameterByName('menu_no');    // 메뉴번호
	jd_no    = getParameterByName('jd_no');      // 전단번호
	vm_sh    = getParameterByName('scroll_Height');

	// 앱 또는 모바웹을 통해서 개인정보동의 화면부터 접근할 경우, 메인화면에 도달하면,
	// 판매장 정보가 셋팅된 상태이다. 이 판매장번호를 통해 해당 판매장의 메뉴리스트를
	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.

	if (vm_cp_no == "") 
	{
		vm_cp_no = localStorage.getItem("vm_cp_no");
	} else {
		localStorage.setItem("vm_cp_no", vm_cp_no);
	}

	logInsert(localStorage.getItem("memberNo"), vm_cp_no, menu_no);

	getHeader(vm_cp_no);
    //getShare();	
	getLeft();

	//상단 판매장명 바인당 > 오늘자 전단의 일자, 베너, 상품 바인딩
	getCpName(vm_cp_no, menu_no, jd_no);

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

	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true){
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

					//console.log("leafletPdConOrderUpdate=========================================");
					if(result == ('NoN') || result == 'list error' || result == 'empty'){
						//console.log(result);
					}else{
						$("#cpName").empty();
						//console.log("============= leafletPdConOrderUpdate callback ========================");
						//console.log(result);
						
					}
				});
			}
	   });
	}else{
	}

});

// 상단 판매장명을 바인딩
function getCpName(rcv_vm_cp_no, rcv_menu_no, rcv_jd_no){
	//console.log("rcv_vm_cp_no:"+rcv_vm_cp_no+"/rcv_menu_no:"+rcv_menu_no+"/rcv_jd_no:"+rcv_jd_no);
	$.ajax({
        url:'/back/02_app/mLeafletCpName.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: rcv_vm_cp_no},
        method : 'GET' 
    }).done(function(result){
        //console.log("getCpName=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#cpName").empty();
            //console.log("============= getCpName callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			data['CompanyName'].forEach(function(item, index){ 
				$("#cpName").append(decodeURIComponent(item['vm_cp_name']).replace(/\+/g,' '));
			});
			getJd(rcv_vm_cp_no, rcv_menu_no, rcv_jd_no, 0);
        }
    });
}

// rcv_jd_no : 기준이 되는 전단번호, 0이면 오늘날자 전단을 가지고옮
// rcv_next_fg: (-1)rcv_jd_no 이전전단, (0)rcv_jd_no 전단, (1)rcv_jd_no 다음전단
function getJd(rcv_vm_cp_no, rcv_menu_no, rcv_jd_no, rcv_interval){
	
	if(rcv_jd_no == "" || typeof(rcv_jd_no) == undefined ){ 
		rcv_jd_no = 0; 
	}

	var modify_jd_no = "";

	////////관리자 페이지에서는 숨긴 전단도 보여줌!
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true){
		var rcv_show_fg = "'Y','N'";
	}else{
		var rcv_show_fg = "'Y'";
	}
	////////관리자 페이지에서는 숨긴 전단도 보여줌!

	// console.log("mLeaflet_GetJd=========================================",rcv_vm_cp_no,"/",rcv_menu_no,"/",rcv_jd_no,"/",rcv_interval);
    $.ajax({
        url:'/back/02_app/mLeafletGetJd.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: rcv_vm_cp_no, menuNo: rcv_menu_no, rcv_jd_no: rcv_jd_no, interval: rcv_interval, rcv_show_fg: rcv_show_fg},
        method : 'GET' 
    }).done(function(result){
		//console.log("============= mLeafletGetJd callback ========================");
		// console.log(result);
        if(result == ('NoN') || result.substring(0,15) == 'exception error' || result == 'empty'  || result == 'interval error'){
			modify_jd_no = "0";
			if(rcv_jd_no == 0){
				//console.log("if:"+result);
				var today = new Date();
				var dayNamesArray = ["일","월","화","수","목","금","토"];
				var monthNamesArray = ["01","02","03","04","05","06","07","08","09","10","11","12"];
				//today.getFullYear() 			//monthNamesArray[today.getMonth()] 			//today.getDate() 			//dayNamesArray[today.getDay()]
				var rcv_menu_type_cd = $(parent.document).find("#modify_menu_type_cd").text();
				$("#selected_jd").empty();
				//console.log("aaaaa"+rcv_menu_type_cd);
				if (rcv_menu_type_cd == "MENU1" || rcv_menu_type_cd == "MENU2" || rcv_menu_type_cd == "MENU3"){
					$("#selected_jd").append('<li class="date_item" id="CT_0" data-jd_no="0" onclick="getDateThree(0)">'+monthNamesArray[today.getMonth()]+'-'+today.getDate()+'('+dayNamesArray[today.getDay()]+')'+'~'+monthNamesArray[today.getMonth()]+'-'+today.getDate()+'('+dayNamesArray[today.getDay()]+')'+'</li>');
				}else{
					$("#selected_jd").append('<li class="date_item" id="CT_0" data-jd_no="0" onclick="getDateThree(0)">'+monthNamesArray[today.getMonth()]+'-'+today.getDate()+'('+dayNamesArray[today.getDay()]+')'+'</li>');
				}
				
				$("#item_list_inner_wrap").empty();
				$("#item_list_inner_wrap").append('<div class="list_no_item">준비중입니다.</div>');				
			}else{
				$("#item_list_inner_wrap").empty();
				$("#item_list_inner_wrap").append('<div class="list_no_item">해당 전단이 없습니다.</div>');	
			}

			$(".btn_left").css("color","#cfcfcf");
			$(".btn_left").removeAttr("onclick");

			$(".btn_right").css("color","#cfcfcf");
			$(".btn_right").removeAttr("onclick");
		
        }else{            
			//console.log("else:"+result);
			//console.log("else:"+decodeURIComponent(item['sql']));
			$("#selected_jd").empty();
			var data = JSON.parse(result);
            data['List'].forEach(function(item, index){
				modify_jd_no = decodeURIComponent(item['jd_no']);
				if (decodeURIComponent(item['menu_type_cd']) == "MENU1" || decodeURIComponent(item['menu_type_cd']) == "MENU2" || decodeURIComponent(item['menu_type_cd']) == "MENU3"){
					$("#selected_jd").append('<li class="date_item" id="CT_'+decodeURIComponent(item['jd_no'])+'" data-jd_no="'+decodeURIComponent(item['jd_no'])+'" onclick="getDateThree('+decodeURIComponent(item['jd_no'])+',\''+decodeURIComponent(item['from_date_origin'])+'\',\''+decodeURIComponent(item['to_date_origin'])+'\')">'+decodeURIComponent(item['from_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['from_date_weekday']).replace(/\+/g,' ')+')~ '+decodeURIComponent(item['to_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['to_date_weekday']).replace(/\+/g,' ')+')</li>');
				}else{
					$("#selected_jd").append('<li class="date_item" id="CT_'+decodeURIComponent(item['jd_no'])+'" data-jd_no="'+decodeURIComponent(item['jd_no'])+'" onclick="getDateThree('+decodeURIComponent(item['jd_no'])+',\''+decodeURIComponent(item['from_date_origin'])+'\',\''+decodeURIComponent(item['to_date_origin'])+'\')">'+decodeURIComponent(item['from_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['from_date_weekday']).replace(/\+/g,' ')+')</li>');
				}
				getBanner(decodeURIComponent(item['jd_no']));
				getPdContent(decodeURIComponent(item['jd_no']));

				if ( decodeURIComponent(item['prev_jd_no']) == "null" || decodeURIComponent(item['prev_jd_no']) == "" ){
					$(".btn_left").css("color","#cfcfcf");
					$(".btn_left").removeAttr("onclick");
				}else{
					$(".btn_left").css("color","#55B190");
					$(".btn_left").removeAttr("onclick");
					$(".btn_left").attr("onclick","getJd("+rcv_vm_cp_no+","+rcv_menu_no+","+decodeURIComponent(item['prev_jd_no'])+",0);");
				}

				//console.log("else:"+decodeURIComponent(item['next_jd_no']));

				if ( decodeURIComponent(item['next_jd_no']) == "null" || decodeURIComponent(item['next_jd_no']) == "" ){
					$(".btn_right").css("color","#cfcfcf");
					$(".btn_right").removeAttr("onclick");					
				}else{
					$(".btn_right").css("color","#55B190");
					$(".btn_right").removeAttr("onclick");
					$(".btn_right").attr("onclick","getJd("+rcv_vm_cp_no+","+rcv_menu_no+","+decodeURIComponent(item['next_jd_no'])+",0);");
				}
			});			
		}
		
		////////부모창 전단번호 바인딩
		var isInIFrame = ( window.location != window.parent.location );
		if (isInIFrame == true)
		{
			$(parent.document).find("#modify_jd_no").text(modify_jd_no);
			$(parent.document).find("#rcv_vm_cp_no").val(rcv_vm_cp_no);
			$(parent.document).find("#rcv_menu_no").val(rcv_menu_no);
		}
		////////부모창 전단번호 바인딩
	});
}

// 전단 배너를 가져온다.
function getBanner(rcv_jd_no_b) {
	//console.log("aaaa"+rcv_jd_no_b);
	$.ajax({
		url:'/back/02_app/mLeafletBanner.jsp?random=' + (Math.random()*99999), 
		data : {jd_no: rcv_jd_no_b},
		method : 'GET' 
	}).done(function(result){
		if(result == ('NoN') || result == 'list error' || result == 'empty'){
			$(".bxslider").html("");
			sliderInstance.reloadSlider();			
			var isInIFrame = ( window.location != window.parent.location );
			if (isInIFrame == true){
				$(".bxslider").append('<li onclick="getBannerList('+rcv_jd_no_b+')" style="width:45%;text-align:center;color:#20469a;">전단 배너가 없어요☹(눌러서 추가하기)</a></li>');
				$(".bxslider").css("height","20px");				
			}					
		}else{
			$(".bxslider").html("");
			var data = JSON.parse(result);
			data['BannerList'].forEach(function(item, index){  
				var isInIFrame = ( window.location != window.parent.location );
				if (isInIFrame == true){
					$(".bxslider").append('<li><img onclick="getBannerList('+decodeURIComponent(item['jd_no'])+')" src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" style="width : 100%;"></li>');
				}else{
					$(".bxslider").append('<li><img src="'+decodeURIComponent(item['jb_img_path']).replace(/\+/g,' ')+'" style="width : 100%;"></li>');
				}					
			});
			sliderInstance.reloadSlider();
		}
	});

}

// 전단 컨텐츠 상품리스트를 불러온다.
function getPdContent(rcv_jd_no) {
	var isInIFrame = ( window.location != window.parent.location );
	$.ajax({
		url:'/back/02_app/mLeafletPdContent.jsp?random=' + (Math.random()*99999), 
		data : {jd_no: rcv_jd_no, memberNo: localStorage.getItem("memberNo")},
		method : 'GET' 
	}).done(function(result){
		console.log(result);
		var text = "";
		//console.log("PdContent=========================================");
		if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
			//console.log(result);
			text +='<div class="list_no_item">준비중입니다.</div>'
			$("#item_list_inner_wrap").empty();
			$("#item_list_inner_wrap").append(text);
		}else{
			//console.log("============= PdContent callback ========================");
			//console.log(result);
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
				text += '		<a onclick="setThumImg(\''+item['jd_prod_con_no']+'\', \''+item['pd_no']+'\', \''+item['pd_code']+'\', \''+item['pd_name']+'\');"><img src="'+item['img_path']+'" alt="'+item['pd_name']+'"></a>'
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
									if (isInIFrame == true)
									{
										text += '			<div class="add_btn" onclick="addRmZzim('+item['jd_prod_con_no']+');"><img src="../images/like2.png" alt="추가"></div>'
									} else {
										text += '			<div class="add_btn" onclick="accessApplication(event);"><img src="../images/like2.png" alt="추가"></div>'
									}
								}		
							}
					}else{
					}
				}
								
				text += '		</div>'
				text += '		<div class="discount_info" onclick="setSaleDetail('+item['jd_prod_con_no']+');">'

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
				if (item['card_discount_from_date'] != "" && item['card_discount_end_date'] != ""  && item['card_discount_from_date'] != item['card_discount_end_date'] ){
					text += '		<span>'+item['card_discount_from_date']+'~'+item['card_discount_end_date']+'</span>'
				}else if(item['card_discount_from_date'] != "" && item['card_discount_from_date'] == item['card_discount_end_date']){
					text += '		<span>'+item['card_discount_from_date']+'</span>'					
				}else if(item['card_discount_from_date'] != ""){
					text += '		<span>'+item['card_discount_from_date']+'</span>'
				}else if(item['card_discount_end_date'] != ""){
					text += '		<span>'+item['card_discount_end_date']+'</span>'
				}else{
				}

				text += '		</div>'
				text += '   </div>'
				text += '   <div class="product_detail">'
				text += '       <a class="product" onclick="setPdName('+item['jd_prod_con_no']+', \''+item['pd_name']+'\', \''+item['weight']+'\');">'+item['pd_name']+'</a>'
				if (item['img_path'] == "/upload/blank.png"){
				}else{
					text += '       <a class="price"   onclick="setPrice('+item['jd_prod_con_no']+', \''+item['price']+'\');">'+comma(item['price'])+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></a>' // 20200619 김수경 원 살림
				}
				//200603 김수경 최종혜택가 표시
				if (item['card_discount'] != "" && item['coupon_discount'] != ""){
					var summed = Number(item['price']) - Number(item['card_discount']) - Number(item['coupon_discount']);
					text += '    	  <a class="price4">'+comma(summed)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></a>'
			    }else if (item['card_discount'] != "")
				{
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '   <a class="price2">'+comma(carded)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></a>' // 20200619 김수경 원 살림
				}else if(item['coupon_discount'] != "")
				{
						//2020-06-03 김수경 쿠폰할인가 살림
					                   var couponed = Number(item['price']) - Number(item['coupon_discount']);
										text += '   <a class="price3">'+comma(couponed)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></a>'
						//2020-06-03 김수경 쿠폰할인가 살림
				}else{
					
				}

				text += '    </div>'

				//상품상세
				text += '    <div class="leaflet_cont">'
				text += '       <div class="leaflet_modal_wrap">'
				text += '    	  <div class="modal_cls"><img src="../images/leaflet_cls.png" alt="리플렛닫기"></div>'
				text += '    	  <div class="leaflet_thumb_wrap">'
				text += '    		 <img src="'+item['img_path']+'" alt="'+item['pd_name']+'">'
				text += '    	  </div>'
				text += '    	  <div class="leaflet_modal_title">'+item['pd_name']+'</div>'
				text += '    	  <div class="leaflet_modal_price">'+comma(item['price'])+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></div>'
				//200603 김수경 상품상세팝업에 카드할인가와 쿠폰할인가 표시
				if  (decodeURIComponent(item['card_discount']) != "" && decodeURIComponent(item['coupon_discount']) != ""){
					var summed = Number(item['price']) - Number(item['card_discount']) - Number(item['coupon_discount']);
					text += '    	  <div class="leaflet_modal_price4"><h6 style="font-family: Noto Sans KR; display:inline-block;font-weight: 400;">최종혜택가</h6> '+comma(summed)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 400;">원</h6></div>'
				}else if (decodeURIComponent(item['card_discount']) != ""){
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '    	  <div class="leaflet_modal_price2"><h6 style="font-family: Noto Sans KR; display:inline-block;font-weight: 400;">카드할인가</h6> '+comma(carded)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 400;">원</h6></div>'
			    }else if (decodeURIComponent(item['coupon_discount']) != ""){
					var couponed = Number(item['price']) - Number(item['coupon_discount']);
					text += '    	  <div class="leaflet_modal_price3"><h6 style="font-family: Noto Sans KR; display:inline-block;font-weight: 400;">쿠폰할인가</h6> '+comma(couponed)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 400;">원</h6></div>'
				}
				//200603 김수경 상품상세팝업에 카드할인가와 쿠폰할인가 표시

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
					text += '                         <div class="leafletmodal_price">'+comma(item['card_discount'])+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">원</h6></div>'
					text += '    					  </td>'
					text += '    					  <td width="50%">'
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '    	  					<div class="leafletmodal_price"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">카드할인가</h6> '+comma(carded)+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">원</h6></div>'
					text += '    					  </td>'
					text += '    					</tr>'
					text += '    				   <tr class="hide table-line">'
					text += '    					  <td class="card_s" colspan="3">'
					//2020.09.16 심규문 공백"+" 관련 encode 방식 변경 		
					/*text += '    					   '+item['card_info']
					text += '    					   - '+item['card_restrict']*/
					text += item['card_info']+ ' - '+ item['card_restrict']					
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
					text += '    					   <div class="leafletmodal_price2">'+comma(item['coupon_discount'])+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">원</h6></div>'					
					// text += '    					   '+ decodeURIComponent(item['coupon_discount']).replace(/\+/g,' ')+'원'
					text += '    					  </td>'
					text += '    					  <td width="50%">'		
					var couponed = Number(item['price']) - Number(item['coupon_discount']);	
					text += '    	  					<div class="leafletmodal_price2"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">쿠폰할인가</h6> '+comma(couponed)+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">원</h6></div>'		
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
					text += '    					   <div class="leafletmodal_price3">'+comma(cardncoupon)+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">원</h6></div>'
					text += '    					  </td>'
					text += '    					  <td width="50%">'		
					text += '    	  						<div class="leafletmodal_price3"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">최종혜택가</h6> '+comma(summed)+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;font-weight: 400;">원</h6></div>'
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
					text += '    					   <div class="leafletmodal_price4">'+item['dadaiksun']
					text += '    					  </div></td>'
					text += '    					  <td width="50%">'					
					text += '    					   <div class="card_s">'+item['dadaiksun_info']
					text += '    					  </td>'			
					text += '    					 </tr>'
				}

				//기타내용
				//if (decodeURIComponent(item['etc']) != ""){	  //2020.09.16 심규문 공백"+" 관련 encode 방식 변경 		
				if (item['etc'] != ""){							
					text += '    					<tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <h6 class="discount_e">기타사항</h6>'
					text += '    						  </div>'
					text += '    					   </td>'					
					text += '    					  <td class="discount2" colspan="2" width="80%">'				
					//text += '                            <div class="card_s">'+ decodeURIComponent(item['etc'])  //2020.09.16 심규문 공백"+" 관련 encode 방식 변경 		
					text += '                            <div class="card_s">'+ item['etc']					
					text += '    					  </div></td>'
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
	}).done(function() {
		document.documentElement.scrollTop = Number(vm_sh);
	});
}
// 2020-06-08 정미솔 테이블 수정, class추가

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
			memberNo: localStorage.getItem("memberNo"), 
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
			zzimCount(localStorage.getItem("memberNo"),vm_cp_no)
        }
    });
}


// 관리자 페이지 인터페이스
// 1. 전단일자 클릭!! : getDateThree(100)
// 2. 배너     클릭!! : getBannerList(100)
// 3. 상품상단 클릭!! : setThumImg('394', '32260', '8801448128156 ');
// 4. 상품하단 클릭!! : setSaleDetail(394)
// 5. 상품명   클릭!! : setPdName(394, 상품명)
// 6. 상품가격 클릭!! : setPrice(394, 가격)
// 7. 상품     드레그!! : 

//1. 전단일자 클릭!!
// 전단기간일 정보를 부모창에 바인딩한다. => class="modify_jd_no"
function getDateThree(jdNo, startDate, endDate){
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find("#modify_jd_no").val(jdNo);
 		$(parent.document).find(".leaflet_del").hide();
 		window.parent.document.getElementById("date_jd_no").value = jdNo;
 		window.parent.document.getElementById("from_date_origin").value = startDate;
 		window.parent.document.getElementById("to_date_origin").value = endDate;		
	}else{
	}
}

// 전단 배너리스트를 부모창에 가져온다.
function getBannerList(rcv_jd_no) {
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find("#banner_jd_no").val(rcv_jd_no);

		window.parent.cssRetach();
		$(parent.document).find(".leaflet_del").hide();
		$.ajax({
			url:'/back/02_app/mLeafletBannerList.jsp?random=' + (Math.random()*99999), 
			data : {jd_no: rcv_jd_no},
			method : 'GET' 
		}).done(function(result){
			//console.log(result);
			console.log("bannerParentList=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){

				window.parent.$("#sortable").empty();

			}else{
				//console.log("============= bannerParentList callback1 ========================");
				//console.log(result);
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
								//console.log(strItems);
								setCookie1("bannerOrderStr",strItems);
								}
				});

				//숨기기
				window.parent.$(".leaflet_banner_hover").click(function(){
					$(this).children("span").toggleClass("active");
					
					bannerHoverId = $(this).attr("id");

					$.ajax({
						url:'/back/03_leaflet/leafletBannerHide.jsp?random=' + (Math.random()*99999),
						data : {jb_no: bannerHoverId }
					}).done(function(result){

						//console.log("noticeList=========================================");
						if(result == ('NoN') || result == 'exception error' || result == 'empty'){
							//console.log(result);
						}else{
							//console.log("============= bannerParentList callback2 ========================");
							//console.log(result);
							alert("숨기기 수정이 완료되었습니다.");

							$(parent.document).find(".leaflet_banner").removeClass("active");
							window.location.reload();						
						}
					});
				});
			}
		});
	}else{
	
	}
}

// 썸네일이미지를 업데이트시 사용할 정보를 부모창에 바인딩한다.
function setThumImg(rcvJdProdConNo, rcvPdNo, rcvPdCode, rcvPdName){

	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{

		$(parent.document).find(".leaflet_del").show();

		//setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);
		$(parent.document).find("#modify_jd_prod_con_no").text(rcvPdCode);
		//$(parent.document).find("#modify_jd_prod_con_no").text(rcvPdCode);
		$(parent.document).find("#modify_jd_prod_con_name").text(rcvPdName);
		$(parent.document).find("#hiddenKeyValue").val(rcvJdProdConNo);

		$("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
           $(".new_item_wrap").hide();
           $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
           $(parent.document).find(".leaflet_image").toggleClass("active");
            
        });

		window.parent.document.getElementById("jd_prod_con_no_prod_thum").value = rcvJdProdConNo;
		window.parent.document.getElementById("pd_no_thum").value = rcvPdNo;
		window.parent.document.getElementById("pd_code_thum").value = rcvPdCode;

		$(".discount_info, .thumb_wrap>a>img").click(function(){
		    $(parent.document).find(".new_item_wrap").hide();
		    $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
		    $(parent.document).find(".leaflet_image").toggleClass("active");
            $(".thumb_wrap>a>img, .price, .price2,.price3,.price4, .product,.item_list_banner_wrap").css("background-color","#fff");
			$(".discount_info, .thumb_wrap>a>img, .date_item_list_wrap").css("border","0");
			//$(".discount_info, .thumb_wrap>a>img, .date_item_wrap").css("border","0");
            $(this).css("border","2px solid #4ba8ff")
		});
	}else{
	
	}
}

// 세일 정보를 부모창에 바인딩한다.
function setSaleDetail(rcvJdProdConNo){
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find(".leaflet_del").show();

		//setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);
		$(parent.document).find("#modify_jd_prod_con_no").text(rcvJdProdConNo);

		$.ajax({
			url:'/back/03_leaflet/leafletProdSaleDetail.jsp?random=' + (Math.random()*99999), 
			data : {jd_prod_con_no: rcvJdProdConNo},
			method : 'GET'  
		}).done(function(result){

			//console.log("SaleDetail=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){
				//console.log(result);
			}else{
				$("#noticeList").html("");
				//console.log("============= SaleDetail callback ========================");
				//console.log("aaaaa"+result);
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
					window.parent.document.getElementById("etc").value = item['etc'];					
				});

			}
		});

		$(".discount_info").click(function(){
            $(parent.document).find(".new_item_wrap").hide();
            $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
            $(parent.document).find(".leaflet_discount").toggleClass("active");
			$(".discount_info, .thumb_wrap>a>img, .date_item_list_wrap").css("border","0");
			//$(".discount_info, .thumb_wrap>a>img, .date_item_wrap").css("border","0");
            $(".thumb_wrap>a, .price, .price2,.price3,.price4, .product,.item_list_banner_wrap").css("background-color","#fff");
            $(this).css("border","2px solid #4ba8ff")
		});
		window.parent.document.getElementById("jd_prod_con_no_discount").value = rcvJdProdConNo;
	}else{
	
	}
}

// 상품명 정보를 부모창에 바인딩한다.
function setPdName(rcvJdProdConNo, rcvPdName, rcvPdWeight){
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find(".leaflet_del").hide();

		//setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);
		$(parent.document).find("#modify_jd_prod_con_no").text(rcvJdProdConNo);

		$(".product").click(function(){
            $(".new_item_wrap").hide();
            $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
            $(parent.document).find(".leaflet_goods_name").toggleClass("active");
		    $(parent.document).find(".leaflet_del").show();
            $(".thumb_wrap>a, .price, .price2,.price3,.price4,.product,.item_list_banner_wrap").css("background-color","#fff");
			$(".discount_info, .thumb_wrap>a>img, .date_item_list_wrap").css("border","0");
			//$(".discount_info, .thumb_wrap>a>img, .date_item_wrap").css("border","0");			
            $(this).css("background-color","#4ba8ff")
        });

		window.parent.document.getElementById("pd_name").value = rcvPdName;
		// window.parent.document.getElementById("pd_weight").value = rcvPdWeight;
		window.parent.document.getElementById("jd_prod_con_no_prod_name").value = rcvJdProdConNo;
	}else{
	
	}
}

// 상품가격 정보를 부모창에 바인딩한다.
function setPrice(rcvJdProdConNo, rcvPrice){
	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{
		$(parent.document).find(".leaflet_del").hide();

		//setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);
		$(parent.document).find("#modify_jd_prod_con_no").text(rcvJdProdConNo);
		
		$(".price").click(function(){
            $(".new_item_wrap").hide();
            $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
            $(parent.document).find(".leaflet_goods_price").toggleClass("active");
		    $(parent.document).find(".leaflet_del").show();
            $(".thumb_wrap>a, .price, .price2,.price3,.price4,.product,.item_list_banner_wrap").css("background-color","#fff");
			$(".discount_info, .thumb_wrap>a>img, .date_item_list_wrap").css("border","0");
			// 200611 김수경 상품명 수정안되는 문제 발생하여 주석처리
			//$(".discount_info, .thumb_wrap>a>img, .date_item_wrap").css("border","0");			
            $(this).css("background-color","#4ba8ff")
        });

		window.parent.document.getElementById("price").value = rcvPrice;
		window.parent.document.getElementById("jd_prod_con_no_price").value = rcvJdProdConNo;
	}else{
	
	}
}