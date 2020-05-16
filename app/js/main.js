$(function(){
	   		
	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호

	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.
	if (vm_cp_no == "")
	{
		// 웹에서 로그인을 통한 접근이 아닐경우
		if (localStorage.getItem("vm_cp_no") == null)
		{
			// 일단 양재점으로 셋팅한다.
			vm_cp_no = 1;
		// 웹이나 앱에서 로그인을 통한 정상적인 접근일 경우,
		}else{
			vm_cp_no = localStorage.getItem("vm_cp_no");
		}
	}

	getHeader(vm_cp_no);
	getLeft();
	
	/* 판매장명을 가지고와서, 제목에 바인딩한다. */
	setTimeout(function(){ getCpName(vm_cp_no); }, 100);
	setTimeout(function(){ clickEventApp(); }, 2000);
	setTimeout(function(){ zzimCount(localStorage.getItem("memberNo"),vm_cp_no); }, 2000);

	/* 팝업을 바인딩한다. */
	console.log("== addModal =========================================");
	adModal();
	
	/* 슬라이더를 바인딩한다. */
	console.log("== sliderLi =========================================");	
	sliderLi(vm_cp_no);
	
	/* 긴급공지를 바인딩한다. */
	console.log("== noticeBox =========================================");	
	noticeBox(vm_cp_no);

	/* 메인의 단 및 내용을 형성한다. */
	console.log("== bodyContent =========================================");	
	bodyContent(vm_cp_no);

	console.log("== logInsert =========================================");	
	logInsert(localStorage.getItem("memberNo"), vm_cp_no, "-1");
})


//메인페이지 모달
function adModal(){

	var text = '';
		$.ajax({
			url:'/back/04_home/popup_app.jsp?random=' + (Math.random()*99999), 
			data: {vm_cp_no : vm_cp_no},
			method : 'GET' 
		}).done(function(result){			
			if(result == ('NoN') || result == 'list error' || result == 'empty'){

				console.log(result);
				console.log("No Data");
				
			}else{
				var jsonResult = JSON.parse(result);
     			console.log(jsonResult);

				var jsonResult_notice = jsonResult.CompanyList

				for(var i in jsonResult_notice){
					text +='	<div class="main_modal_img_wrap">';
					text +='		<a href="../'+jsonResult_notice[i].link_url+'">'; 
					text +='			<img src="'+jsonResult_notice[i].img_url+'" alt="" />';
					text +='		</a>';
					text +='	</div>';
					text +='	<div class="main_modal_btn_wrap">';		
					text +='		<div class="main_modal_week_close" id="mainModalWeekCls">';
					text +='			일주일간 보지 않기';
					text +='		</div>';
					text +='		<div class="main_modal_close" id="mainModalCls">';
					text +='			닫기';	
					text +='		</div>';	
					text +='	</div>';	
				}
				$("#main_modal_wrap").empty();
				$("#main_modal_wrap").append(text);
				$("#main_modal_wrap").css("box-shadow","0px 0px 21px 5px rgba(0,0,0,0.17)");

				var $open_popmsg = $(".main_modal_wrap"),
						$close_btn = $("#mainModalCls"),
						$close_btn2 = $("#mainModalWeekCls"),
						popUpName = "HANAROMART";
						
				if(getCookies( popUpName ) == "done"){
						$open_popmsg.hide();
				   }
				
				//닫기 버튼		
				$close_btn.click(function(e) {
						$open_popmsg.hide();
				})

				//일주일간 닫기 버튼
				$close_btn2.click(function(e) {
					var expdate = new Date(),
						remainHours = 167 - expdate.getHours(),
						remainMin = 60 - expdate.getMinutes();			
						expdate.setTime( expdate.getTime() + ( remainHours * 60 * 60 * 1000 ) + ( remainMin * 60 * 1000 ) );
						   
						setCookies( popUpName, "done" , expdate );

						$open_popmsg.hide();
						e.preventDefault();
					})
			}
	})
}

/*쿠키를 설정한다 - 모달 일주일 닫기 위해*/
function setCookies( name, value, expires ) {
		document.cookie = name + "=" + escape (value) + "; path=/; expires=" + expires.toGMTString();
	}

/*쿠키를 가져온다 - 모달 일주일 닫기 위해*/
function getCookies( name ) {
		var search = name + "=";
		offset = document.cookie.indexOf(search);
		if (document.cookie.length > 0) {  
			if (offset != -1) { 
				offset += search.length;
			
				end = document.cookie.indexOf(";", offset);			
		
				if (end == -1)	end = document.cookie.length;		
				return unescape(document.cookie.substring(offset, end));
			}
		}
}

/*notice를 붙임*/
function noticeBox(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mNotice.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){

			if(result == "NoN"){
					$(".header_notice_wrap").hide();
			}else{
					var jsonResult = JSON.parse(result);
					console.log(jsonResult);

					var jsonResult_notice = jsonResult.BannerList;
					
					for(var i in jsonResult_notice){
						
						text +='	<li class="slider_cont">';
						text +='		<span>';
//						text +='			<img src="../images/event.png" alt="이벤트아이콘">';
						text +='		</span>';
						text +='		<a href="#">'+jsonResult_notice[i].sn_content+'</a>';
						text +='	</li>';

					}
				
				$("#noticeAniBox").empty();
				$("#noticeAniBox").append(text);
			}

	})

}


/*슬라이드 js*/
/*슬라이드 js*/
function sliderLi(rcv_vm_cp_no){

		var text = '';						
		var aniW = $(".mobile_slider").width();	
		var winW = $(window).width();

		$.ajax({
			url:'/back/02_app/mBanner.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){
	           
            /*슬라이드 내 데이터가 없을 시 div를 숨긴다.*/
			if(result == "NoN"){
				
					$("#sliderAniBox").hide();
				
			}else{

			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.BannerList;		
			
			for(var i in jsonResult_notice){
				
				text +='<li><a href="../home/event.html?event_no='+jsonResult_notice[i].event_no+'">';
				// text +='	<img src="..'+jsonResult_notice[i].img_url+'" alt="">';
				text +='	<img src="'+jsonResult_notice[i].img_url+'" alt="">';
				text +='	</a></li>';

			}
			
			$("#sliderAniBox").empty();
			$("#sliderAniBox").append(text);
		    
                
//		    var dir = -1;
//            var num = 0;
//
//                
//                /*슬라이드 애니메이션 하단 갯수*/
//                
//                var totalNum = $(".slider_ani_box li").length;
//				$(".slider_page span:eq(1)").append(totalNum);
//				function gal(c){//선언적 함수, 콜백함수 만들기
//                    
//							$(".slider_page span:eq(0)").empty();
//							$(".slider_page span:eq(0)").append(c+1);
//
//							if(num < totalNum-1){
//								num++;
//							}else{
//								num = 0;
//							}
//
//						}
//				    gal(num);
//					var numRoll = setInterval(function(){gal(num);},4100);
			

            
            var screenW = $(window).width();
                
            $('.bxslider').bxSlider({
                  auto: true,
                  autoControls: false,
                  stopAutoOnClick: true,
                  pager: true,
                  pagerType: 'short',   
                  controls : false,
                  slideWidth: screenW,
                  infiniteLoop: false
//                  hideControlOnEnd: true 
            });            
            
            $(".bx-wrapper").css("margin-bottom","0");
           

			  
                
        }

	})
	

}

/*본문을 붙임*/
function bodyContent(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/bodyContent.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){

			if(result == "NoN"){
					//$(".header_notice_wrap").hide();
			}else{
					var jsonResult = JSON.parse(result);
					console.log(jsonResult);

					var jsonResult_notice = jsonResult.BannerList;
					
					for(var i in jsonResult_notice){

						text +='<div class="main_cont main_cont1">';
						text +='	<h3>'+jsonResult_notice[i].menu_name+'</h3>';
						text +='	<div class="item_list_inner_wrap" id="bodyContentDetail'+jsonResult_notice[i].menu_no+'">';

						text +='	</div>';
						text +='	<div class="main_view_more" onclick="leafletLink('+jsonResult_notice[i].jd_no+', '+jsonResult_notice[i].menu_no+', '+rcv_vm_cp_no+')"><span>상품</span> 더보기 +</div>	';				
						text +='</div>';
						
						if (jsonResult_notice[i].jd_no == null)
						{
						}else{
							bodyContentDetail(jsonResult_notice[i].menu_no, jsonResult_notice[i].jd_no);
						}

					}
				
				$("#bodyContent").empty();
				$("#bodyContent").append(text);

			}

	})

}

// 행사/전단의 좌측 메뉴 클릭시, iframe src 호출용 함수이다.
function leafletLink(rcv_jd_no, rcv_menu_no, rcv_vm_cp_no){
	
	location.href = "../m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no+"&jd_no="+rcv_jd_no;
}

/*본문 상세를 붙임*/
function bodyContentDetail(rcv_menu_no, rcv_jd_no){

		var text = '';
		var isInIFrame = ( window.location != window.parent.location );

		$.ajax({
			url:'/back/02_app/bodyContentDetail.jsp?random=' + (Math.random()*99999), 
			data : {jd_no: rcv_jd_no, memberNo: localStorage.getItem("memberNo")},
			method : 'GET' 
		}).done(function(result){

			if(result == "NoN"){
					//$(".header_notice_wrap").hide();
			}else{
				var data = JSON.parse(result);
				console.log(data);

				data['PdContentList'].forEach(function(item, index){

				text += '<div class="figure figure3" id='+item['jd_prod_con_no']+'>'
                text += '   <div class="thumb_wrap">'
                text += '		<a><img src="'+item['img_path']+'" alt="'+item['pd_name']+'"></a>'
                text += '		<div class="thumb_info">'
				if(isInIFrame == true){
				
				}else{
					if (localStorage.getItem("memberNo") != '')
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
					}else{

					}
                }
				text += '		</div>'
                text += '		<div class="discount_info">'

				// 카드할인
				if (item['card_discount'] != "")
				{
					text += '		<img src="../images/leaflet_icon1.png" alt="카드할인">'
				// 다다익선
				}else if (item['dadaiksun'] != "")
				{
					text += '		<img src="../images/leaflet_icon3.png" alt="다다익선">'
					text += '       '
				// 쿠폰할인
				}else if (item['coupon_discount'] != "")
				{
					text += '		<img src="../images/leaflet_icon2.png" alt="쿠폰할인">'
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
                text += '       <a class="product">'+item['pd_name']+'</a>'
				if (item['img_path'] == "/upload/blank.png"){
				}else{
					text += '       <a class="price">'+comma(item['price'])+'</a>' //2020-05-07 원 삭제 - 미솔
				}

				if (item['card_discount'] != "")
				{
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '   <a class="price2">'+comma(carded)+'</a>' //2020-05-07 원 삭제 - 미솔
				}else if(item['coupon_discount'] != "")
				{
					//var couponed = Number(decodeURIComponent(item['price']).replace(/\+/g,' ')) - Number(decodeURIComponent(item['coupon_discount']).replace(/\+/g,' '));
					//text += '   <a class="price3">'+comma(couponed)+'원</a>'
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
				text += '    	  <div class="leaflet_modal_price">'+comma(item['price'])+'원</div>'									
				text += '    	  <div class="leaflet_txt">'
				text += '    		  <div class="leaflet_discount">'                 
				text += '    			 <h5>혜택 및 상품 정보 안내</h5>'
				text += '    			 <div id="table">'			
				
				text += '    				<table class="table" >'

				// 할인기간
				if (decodeURIComponent(item['card_discount_from_date']) != "" || decodeURIComponent(item['card_discount_end_date']) != ""){
					text += '    				   <tr class="hide table-line">'
					text += '    					   <td>'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon8.png" alt="할인기간">'
					text += '    						  </div>'
					text += '    					   </td>'					
					text += '    					  <td> '
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
					text += '    					  <td>'
					text += '    						<div class="discount_img">'
					text += '    							<img src="../images/leaflet_icon1.png" alt="카드할인">'
					text += '    						</div>'
					text += '    					  </td>'
					text += '    					  <td>'
					text += '                         '+comma(item['card_discount'])+'원'
					text += '    					   / '+item['card_info']
					text += '    					   / '+item['card_restrict']
					text += '    					  </td>'
					text += '    					</tr>'
				}

				//다다익선
				if (decodeURIComponent(item['dadaiksun']) != ""){				
					text += '    					<tr class="hide table-line">'
					text += '    					   <td>'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon3.png" alt="다다익선">'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					  <td>'					
					text += '    					   '+item['dadaiksun']
					text += '    					   / '+item['dadaiksun_info']
					text += '    					  </td>'					
					text += '    					 </tr>'
				}

				//쿠폰할인
				if (decodeURIComponent(item['coupon_discount']) != ""){
					text += '    					<tr class="hide table-line">'
					text += '    					   <td>'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon2.png" alt="쿠폰할인">'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					  <td>'					
					text += '    					   '+ decodeURIComponent(item['coupon_discount']).replace(/\+/g,' ')+'원 추가할인'
					text += '    					  </td>'
					text += '    					 </tr>'
				}

				//기타내용
				if (decodeURIComponent(item['etc']) != ""){		
					text += '    					<tr class="hide table-line">'
					text += '    					   <td>'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon9.png" alt="기타사항">'
					text += '    						  </div>'
					text += '    					   </td>'					
					text += '    					  <td>'					
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
			$("#bodyContentDetail"+rcv_menu_no).empty();
			$("#bodyContentDetail"+rcv_menu_no).append(text);
			
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
	})
}

function clickEventApp(){



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
			zzimCount(localStorage.getItem("memberNo"),vm_cp_no);
        }
    });
}
