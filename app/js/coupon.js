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

	couponList(vm_cp_no);
	couponListIng(vm_cp_no);
	couponListEnd(vm_cp_no);

	logInsert(localStorage.getItem("memberNo"), vm_cp_no, "-2");
            
})


////버튼 클릭시 쿠폰 저장
function saveCoupon(rcvCouponNo, asisCnt){

	$.ajax({
		url:'/back/02_app/mCouponJoin.jsp?random=' + (Math.random()*99999), 
		data : {couponNo: rcvCouponNo, memberNo: localStorage.getItem("memberNo")},
		method : 'GET' 
	}).done(function(result){
			
		console.log("noticeList=========================================");
		if(result == 'dup'){
			alert("이미 쿠폰을 받으셨습니다.")
		}else if(asisCnt == 0){
			alert("남은 수량이 없습니다.");
		}else if(result == 'exception error'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
            var resultCoupon = confirm("쿠폰을 받으셨습니다. 받은 쿠폰을 바로 확인하시겠습니까?");
            if(resultCoupon){
                location.href="../mypage/my_coupon.html"
            }else{
                alert("쿠폰을 받으셨습니다. 다운로드한 쿠폰은 마이페이지에서 확인가능합니다.");
            }
		}
	});

}

/* 쿠폰 - 전체 */
function couponList(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'../back/02_app/mCoupon.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){
	
			if (result == "NoN")
			{
                text +='<div class="noCont">';
                text +='준비중입니다.';
                text +='</div>';
			}else{


			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.BannerList;
			
			for(var i in jsonResult_notice){

				text +=' <div class="coupon_cont figure">';
				text +=' 	<div class="discount_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
                text +='     <div class="thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="../images/coupon_image.png" alt="이미지없음"></a>';
				}else{
                    
                    if(jsonResult_notice[i].img_path == null){
                          text +=' 		<a href="#"><img src="../images/coupon_noimg.png" alt="이미지없음"></a>';                       
                       }else{
                          text +=' 		<a href="#"><img src="../upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                       }
				}
                text +='     </div>';
                text +='     <div class="product_detail">';

				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +='         <a href="#" class="product">&nbsp;</a>';
				}else{
					text +='         <a href="#" class="product">'+jsonResult_notice[i].pd_name+'</a>';
				}
                
				text +='         <a href="#" class="dicount_date">';
				text +=' 		    <span>'+jsonResult_notice[i].start_date+'</span>~';
                text +='             <span>'+jsonResult_notice[i].end_date+'</span>';
                text +='         </a>';
                text +='         <button onclick="saveCoupon('+jsonResult_notice[i].coupon_no+')">쿠폰받기</button>';
                if(jsonResult_notice[i].asisCnt < "1"){
                   text +='         <span class="discount_left">&nbsp;</span>';                   
                }else{
                   text +='         <span class="discount_left">남은수량 : '+jsonResult_notice[i].asisCnt+'개</span>';
                }
                text +='     </div>';
				text +=' </div>';

			}

			}
			
		$("#list_1").empty();
		$("#list_1").append(text);

		//썸네일 높이 넓이 맞추기
		var thumbW = $(".figure .thumb_wrap").width();
		$(".figure .thumb_wrap").height(thumbW);
	
	})

}

/* 쿠폰 - 상품할인 */
function couponListIng(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'../back/02_app/mCouponIng.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){
	
			if (result == "NoN")
			{
                text +='<div class="noCont">';
                text +='준비중입니다.';
                text +='</div>';
			}else{

				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.BannerList;
				
				for(var i in jsonResult_notice){

					text +=' <div class="coupon_cont figure">';
					text +=' 	<div class="discount_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
					text +='     <div class="thumb_wrap">';
					if (jsonResult_notice[i].coupon_type == "BILLING")
					{
						text +=' 		<a href="#"><img src="../images/coupon_image.png" alt=""></a>';
					}else{
                        if(jsonResult_notice[i].img_path == null){
                              text +=' 		<a href="#"><img src="../images/coupon_noimg.png" alt="이미지없음"></a>';                       
                           }else{
                              text +=' 		<a href="#"><img src="../upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                           }
					}
					text +='     </div>';
					text +='     <div class="product_detail">';

					if (jsonResult_notice[i].coupon_type == "BILLING")
					{
                        text +='         <a href="#" class="product">&nbsp;</a>';
					}else{
						text +='         <a href="#" class="product">'+jsonResult_notice[i].pd_name+'</a>';
					}

					text +='         <a href="#" class="dicount_date">';
					text +=' 		    <span>'+jsonResult_notice[i].start_date+'</span>~';
					text +='             <span>'+jsonResult_notice[i].end_date+'</span>';
					text +='         </a>';
					text +='         <button onclick="saveCoupon('+jsonResult_notice[i].coupon_no+')">쿠폰받기</button>';
                    if(jsonResult_notice[i].asisCnt < "1"){
                       text +='         <span class="discount_left">&nbsp;</span>';                   
                    }else{
                       text +='         <span class="discount_left">남은수량 : '+jsonResult_notice[i].asisCnt+'개</span>';
                    }
					text +='     </div>';
					text +=' </div>';

				}

			}
	
		$("#list_2").empty();
		$("#list_2").append(text);

		//썸네일 높이 넓이 맞추기
		var thumbW = $(".figure .thumb_wrap").width();
		$(".figure .thumb_wrap").height(thumbW);
	
	})

}

/* 쿠폰 - 결제할인 */
function couponListEnd(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'../back/02_app/mCouponEnd.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){

		if (result == "NoN")
			{
                text +='<div class="noCont">';
                text +='준비중입니다.';
                text +='</div>';
			}else{
	
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.BannerList;
			
			for(var i in jsonResult_notice){

				text +=' <div class="coupon_cont figure">';
				text +=' 	<div class="discount_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
                text +='     <div class="thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="../images/coupon_image.png" alt=""></a>';
				}else{
                    if(jsonResult_notice[i].img_path == null){
                          text +=' 		<a href="#"><img src="../images/coupon_noimg.png" alt="이미지없음"></a>';                       
                       }else{
                          text +=' 		<a href="#"><img src="../upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                       }
				}
                text +='     </div>';
                text +='     <div class="product_detail">';

                if (jsonResult_notice[i].coupon_type == "BILLING")
				{
                    text +='         <a href="#" class="product">&nbsp;</a>';
				}else{
					text +='         <a href="#" class="product">'+jsonResult_notice[i].pd_name+'</a>';
				}

                text +='         <a href="#" class="dicount_date">';
				text +=' 		    <span>'+jsonResult_notice[i].start_date+'</span>~';
                text +='             <span>'+jsonResult_notice[i].end_date+'</span>';
                text +='         </a>';
                text +='         <button onclick="saveCoupon('+jsonResult_notice[i].coupon_no+')">쿠폰받기</button>';
                if(jsonResult_notice[i].asisCnt < "1"){
                   text +='         <span class="discount_left">&nbsp;</span>';                   
                }else{
                   text +='         <span class="discount_left">남은수량 : '+jsonResult_notice[i].asisCnt+'개</span>';
                }
                text +='     </div>';
				text +=' </div>';

			}
			}
			
		$("#list_3").empty();
		$("#list_3").append(text);

		//썸네일 높이 넓이 맞추기
		var thumbW = $(".figure .thumb_wrap").width();
		$(".figure .thumb_wrap").height(thumbW);
	
	})

}