 $(function(){
         
	var memberNo = localStorage.getItem("memberNo");
	zzimList(memberNo);

})
          

//찜하기 리스트 불러오기
	function zzimList(rcvMemberNo) {

    $.ajax({
        url:'/back/04_home/zzimList.jsp?random=' + (Math.random()*99999), 
        data : {memberNo: rcvMemberNo, vm_cp_no: localStorage.getItem("vm_cp_no")},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			text +='<div class="list_no_item">마음에 드는 상품을 찜해두셨다가 매장에서 확인하세요!</div>'

			$("#zzimListWrap").empty();
			$("#zzimListWrap").append(text);
            $("#zzim_guide").hide();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
            data['PdContentList'].forEach(function(item, index){    

				text += '<div class="figure figure3" id="item'+item['jd_prod_con_no']+'">';
                text += '   <div class="thumb_wrap">';
                text += '		<a ><img src="'+item['img_path']+'" alt="'+item['pd_name']+'"></a>';
                //text += '		<div class="discount_info">';

				text += '		<div class="thumb_info">'

				if (localStorage.getItem("memberNo") != '')
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
					text += '		<img src="../images/leaflet_icon2.png" alt="쿠폰할인">';
					text += '       ';

				// 다다익선
				}else if (item['dadaiksun'] != "")
				{
					text += '		<img src="../images/leaflet_icon3.png" alt="다다익선">';
					text += '       ';
				// 적용사항 없음
				}else{
					text += '		<img src="../images/leaflet_icon4.png" alt="">';
					text += '       ';
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

                text += '		</div>';
                text += '   </div>';
                text += '   <div class="product_detail">';
                text += '       <a class="product">'+item['pd_name']+'</a>';
				if (item['img_path'] == "/upload/blank.png"){
				}else{
					text += '       <a class="price">'+comma(item['price'])+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></a>' // 20200619 김수경 원 살림
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
					//                    var couponed = Number(decodeURIComponent(item['price']).replace(/\+/g,' ')) - Number(decodeURIComponent(item['coupon_discount']).replace(/\+/g,' '));
					//					text += '   <a class="price3">'+comma(couponed)+'원</a>'
					var couponed = Number(item['price']) - Number(item['coupon_discount']);
					text += '   <a class="price3">'+comma(couponed)+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></a>'
				}else{
				
				}

				if (item['from_date'] == item['to_date']){
					text += '    <span>('+item['to_date']+')</span>';
				}else{
					text += '    <span>('+item['from_date']+'~'+item['to_date']+')</span>';
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
					text += '    	  <div class="leaflet_modal_price4"><h6 style="font-family: Noto Sans KR; display:inline-block;">최종혜택가</h6> '+comma(summed)+'<h6 style="font-family: Noto Sans KR; display:inline-block;">원</h6></div>'
				}else if (decodeURIComponent(item['card_discount']) != ""){
					var carded = Number(item['price']) - Number(item['card_discount']);
					text += '    	  <div class="leaflet_modal_price2"><h6 style="font-family: Noto Sans KR; display:inline-block;">카드할인가</h6> '+comma(carded)+'<h6 style="font-family: Noto Sans KR; display:inline-block;">원</h6></div>'
			    }else if (decodeURIComponent(item['coupon_discount']) != ""){
					var couponed = Number(item['price']) - Number(item['coupon_discount']);
					text += '    	  <div class="leaflet_modal_price3"><h6 style="font-family: Noto Sans KR; display:inline-block;">쿠폰할인가</h6> '+comma(couponed)+'<h6 style="font-family: Noto Sans KR; display:inline-block;">원</h6></div>'
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
					text += '    					   '+item['card_info']
					text += '    					   - '+item['card_restrict']
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
					text += '    	  					<div class="leafletmodal_price2"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">쿠폰할인가</h6> '+comma(couponed)+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">원</h6></div>'		
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
					text += '    	  						<div class="leafletmodal_price3"><h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">최종혜택가</h6> '+comma(summed)+'<h6 style="font-family: Noto Sans KR; display:inline-block; font-size: 12px;">원</h6></div>'
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
				if (decodeURIComponent(item['etc']) != ""){		
					text += '    					<tr class="hide table-line">'
					text += '    					   <td width="20%">'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon9.png" alt="기타사항">'
					text += '    						  </div>'
					text += '    					   </td>'					
					text += '    					  <td class="discount2" colspan="2" width="80%">'				
					text += '                            <div class="card_s">'+ decodeURIComponent(item['etc'])
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
				// 2020-06-08 정미솔 테이블 수정, class추가
				
				/* 2020.05.16 심규문 홈,전단,찜 상품상세페이지 수정에 의한 주석처리 
				text += '    </div>';

				text += '    <div class="leaflet_cont">'
				text += '       <div class="leaflet_modal_wrap">'
				text += '    	  <div class="modal_cls"><img src="../images/leaflet_cls.png" alt="리플렛닫기"></div>'
				text += '    	  <div class="leaflet_thumb_wrap">'
				text += '    		 <img src="'+item['img_path']+'" alt="'+item['pd_name']+'">'
				text += '    	  </div>'
				text += '    	  <div class="leaflet_modal_title">'+item['pd_name']+'</div>'
				text += '    	  <div class="leaflet_modal_price">'+comma(item['price'])+'<h6 style="font-family: Noto Sans KR;display:inline-block;font-weight: 500;">원</h6></div>'
									
				text += '    	  <div class="leaflet_txt">'
				text += '    		  <div class="leaflet_discount">'                 
				text += '    			 <h5>혜택 및 상품 정보 안내</h5>'
				text += '    			 <div id="table">'
				

				// 카드할인
				if (decodeURIComponent(item['card_discount']) != "")
				{
					text += '    				<table class="table" >'
					//text += '    				   <tr>'
					//text += '    					  <th>할인종류</th>'
					//text += '    					  <th>할인액/혜택</th>'
					//text += '    					  <th>기간</th>'
					//text += '    					  <th>혜택상세</th>'
					//text += '    				   </tr>'
					text += '    				   <tr class="hide table-line">'
					text += '    					  <td width="15%">'
					text += '    						<div class="discount_img">'
					text += '    							<img src="../images/leaflet_icon1.png" alt="카드할인">'
					text += '    						</div>'
					text += '    					  </td>'
					text += '    					  <td width="20%" style="text-align : center">'+comma(item['card_discount'])+'원</td>'
					text += '    					  <td width="25%" style="text-align : center">'+item['card_discount_from_date']+'~'+item['card_discount_end_date']+'</td>'
					text += '    					  <td>'+item['card_info']+'<br>'+item['card_restrict']+'</td>'
					text += '    					</tr>'

					if (decodeURIComponent(item['coupon_discount']) != ""){
						text += '    					<tr class="hide table-line">'
						text += '    					   <td>'
						text += '    						  <div class="discount_img">'
						text += '    							 <img src="../images/leaflet_icon2.png" alt="쿠폰할인">'
						text += '    						  </div>'
						text += '    					   </td>'
						text += '    					   <td colspan=3>'+comma(item['coupon_discount'])+'원 추가할인</td>'
						text += '    					 </tr>'
					}

				// 다다익선
				}else if (item['dadaiksun'] != "")
				{
					text += '    				<table class="table" >'
					//text += '    				   <tr>'
					//text += '    					  <th>할인종류</th>'
					//text += '    					  <th>할인액/혜택</th>'
					//text += '    					  <th>기간</th>'
					//text += '    					  <th>혜택상세</th>'
					//text += '    				   </tr>'
					text += '    					<tr class="hide table-line">'
					text += '    					   <td>'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon3.png" alt="다다익선">'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					   <td colspan=3>'+item['dadaiksun']+'</td>'
					text += '    					 </tr>'
				// 쿠폰할인
				}else if (decodeURIComponent(item['coupon_discount']).replace(/\+/g,' ') != "")
				{
					text += '    				<table class="table" >'
					text += '    				   <tr>'
					text += '    					  <th>할인종류</th>'
					text += '    					  <th>할인금액</th>'
					text += '    					  <th>기간</th>'
					text += '    					  <th>혜택상세</th>'
					text += '    				   </tr>'
					text += '    					<tr class="hide table-line">'
					text += '    					   <td>'
					text += '    						  <div class="discount_img">'
					text += '    							 <img src="../images/leaflet_icon2.png" alt="쿠폰할인">'
					text += '    						  </div>'
					text += '    					   </td>'
					text += '    					   <td colspan=3>'+decodeURIComponent(item['coupon_discount']).replace(/\+/g,' ')+'원 추가할인</td>'
					text += '    					 </tr>'
				// 적용사항 없음
				}else{

				}


				text += '    				 </table>'
				text += '    			 </div>'
				text += '    			   <span class="discount_notice">※상품의 가격 및 내용은 공급자 사정에 따라 다소 변경될 수 있으며 조기품절 될 수 있습니다. <br> ※일부 상품 사진은 이미지컷입니다. <br> ※카드/쿠폰할인,다다익선은 매장방문고객에 한합니다.</span>'
				text += '    		  </div>'
				text += '    	   </div>'
				text += '    	</div>'
				text += '    </div>'
				text += '</div>'
//				text += '  </div>';
               */

            });
		
			$("#zzimListWrap").empty();
			$("#zzimListWrap").append(text);
            $("#zzim_guide").show();

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
				   $(this).toggleClass("like");   
			})

        }
    });
}

/* 찜하기 버튼 클릭한다. */
function addRmZzim(rcv_jd_prod_con_no){
	$.ajax({
        url:'/back/02_app/mLeafletZzim.jsp?random=' + (Math.random()*99999),
		data : {
			memberNo: localStorage.getItem("memberNo"),
			jd_prod_con_no: rcv_jd_prod_con_no, 
			vm_cp_no: localStorage.getItem("vm_cp_no")
			},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
			//zzimCount(localStorage.getItem("memberNo"), localStorage.getItem("vm_cp_no"));
			zzimList(localStorage.getItem("memberNo"));
        }
    });
}

/* 찜리스트 일괄취소 20200611 */
function zzimDelete() {

    $.ajax({
        url:'/back/04_home/zzimDelete.jsp?random=' + (Math.random()*99999), 
        data : {memberNo: localStorage.getItem("memberNo"), vm_cp_no: localStorage.getItem("vm_cp_no")},
        method : 'GET' 
    }).done(function(result){
		var resultSplit = result.trim().split(",");
		var text = "";
		console.log("noticeList=========================================JB"); 
		console.log(resultSplit);		
        if(resultSplit[0] == 'NoN' || resultSplit[0] == 'list error' || resultSplit[0] == 'empty'){
			console.log(result);
        }else{
			text +='<div class="list_no_item">마음에 드는 상품을 찜해두셨다가 매장에서 확인하세요!</div>'

			$("#zzimListWrap").empty();
			$("#zzimListWrap").append(text);
            $("#zzim_guide").hide();
		}
	});
}
