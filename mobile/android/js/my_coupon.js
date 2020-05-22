$(function(){

	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호

	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.
	if (vm_cp_no == "")
	{
		// 웹에서 로그인을 통한 접근이 아닐경우
		if (localStorage.getItem("vm_cp_no") == "")
		{
			// 일단 양재점으로 셋팅한다.
			vm_cp_no = 1;
		// 웹이나 앱에서 로그인을 통한 정상적인 접근일 경우,
		}else{
			vm_cp_no = localStorage.getItem("vm_cp_no");
		}
	}
	couponList(vm_cp_no);
	couponListIng(vm_cp_no);
	couponListEnd(vm_cp_no);
})



/* 버튼 클릭시 쿠폰 저장 */
function certCoupon(rcvMcNo){
    
   if(confirm("직원확인 처리하시겠습니까? 직원확인 이후에는 쿠폰이 사용처리되어 사용하실 수 없습니다.") == true){
            $.ajax({
                url:'https://www.nhhanaromart.com/back/02_app/mCouponMineCert.jsp?random=' + (Math.random()*99999), 
                data : {mcNo: rcvMcNo},
                method : 'GET' 
            }).done(function(result){

                console.log("noticeList=========================================");
                if(result == 'dup'){
                    alert("이미 직원확인을 받으셨습니다.");
                    location.reload();  
                }else if(result == 'exception error'){
                    console.log(result);
                }else{
                    console.log("============= notice callback ========================");
                    console.log(result);
                    //쿠폰 사용
                    alert("쿠폰이 사용되었습니다.");
                    $(this).children("span.coupon_btn").css("background-color","#949494");
                    location.reload(); 
                }
            });       
       }else{
            alert("사용이 취소되었습니다.");
            location.reload(); 
       }
    
}

/* 쿠폰 - 전체 */
function couponList(rcv_vm_cp_no){

	var text = '';

	$.ajax({
		url:'https://www.nhhanaromart.com/back/02_app/mCouponMine.jsp?random=' + (Math.random()*99999), 
		data : {userCompanyNo: rcv_vm_cp_no, memberNo: localStorage.getItem("memberNo")},
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

			/* 20200229 추가 시작 */
			var re=/(\n|\r\n)/g;
			/* 20200229 추가 끝 */

			for(var i in jsonResult_notice){

				text +=' <div class="coupon_cont figure">';
				if( jsonResult_notice[i].discount_price == 0 ){
					text +=' 	<div class="discount_info">무료증정</div>';
				}else{
					text +=' 	<div class="discount_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
				}
                text +='     <div class="thumb_wrap">';
				
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
                    if(jsonResult_notice[i].img_path == null){
                        text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/images/coupon_noimg.png" alt="이미지없음"></a>';                       
                    }else{
                        text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                    }
				}
                text +='     </div>';
                text +='     <div class="product_detail">';

				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +='         <a href="#" class="product">'+comma(jsonResult_notice[i].min_price)+' 원구매시</a>';
				}else{
					text +='         <a href="#" class="product">'+jsonResult_notice[i].pd_name+'</a>';
				}
                
				text +='         <a href="#" class="dicount_date">';
				text +=' 		    <span>'+jsonResult_notice[i].start_date+'</span>~';
                text +='             <span>'+jsonResult_notice[i].end_date+'</span>';
                text +='         </a>';
                text +='     </div>';

				//레이어 팝업
				text +='<div class="product_modal">';            
				text +='	<div class="product_modal_wrap">';
				text +='		<div class="modal_cls"><img src="../images/coupon_cls.png" alt="쿠폰닫기"></div>';
                text +='        <div class="coupon_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
                text +='        <div class="coupon_thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
                    if(jsonResult_notice[i].img_path == null){
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/images/coupon_noimg.png" alt="이미지없음"></a>';                       
                       }else{
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                       }
				}
                text +='        </div>';
                text +='        <div class="coupon_barcode_wrap">';
				text +='			<span class="coupon_barcode" id="1_'+jsonResult_notice[i].coupon_code+'" style="display : block; margin : auto;">';
                text +='            </span>';
                text +='        </div>';
                text +='        <div class="coupon_bg">';
				text +='			<div class="coupon_title">';
                if(jsonResult_notice[i].pd_name == ""){
                         text +='   ' +comma(jsonResult_notice[i].min_price)+' 원구매시</div>'; 
                }else{
                         text +='   ' +jsonResult_notice[i].pd_name+'</div>';   
                }
                text +='            <div class="coupon_btn_wrap" onclick="certCoupon('+jsonResult_notice[i].mc_no+');">';
                text +='                <span class="coupon_btn">직원확인</span>';
				text +='			</div>';
                text +='        </div>';
                text +='        <div class="coupon_txt">';
                text +='            <p>';
				text +=''+jsonResult_notice[i].coupon_detail.replace(re,"<br>")+'';
                text +='            </p>';
                text +='        </div>';       
                text +='    </div>';
				text +='</div>';
				//레이어 팝업

				text +=' </div>';

			}
		}
			
		$("#list_1").empty();
		$("#list_1").append(text);
		
		//썸네일 높이 넓이 맞추기
		var thumbW = $(".figure .thumb_wrap").width();
		$(".figure .thumb_wrap").height(thumbW);

		$(".product_detail, .thumb_wrap").click(function(){
			$(this).siblings(".product_modal").addClass("active");
		})
		$(".modal_cls").click(function(){
			$(this).closest(".product_modal").removeClass("active");
		})

		for(var i in jsonResult_notice){
				
			$("#1_"+jsonResult_notice[i].coupon_code).barcode(jsonResult_notice[i].coupon_code, "code128",{barWidth:1, barHeight:50});
		}
	})
}

/* 쿠폰 - 상품할인 */
function couponListIng(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'https://www.nhhanaromart.com/back/02_app/mCouponMineIng.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no, memberNo: localStorage.getItem("memberNo")},
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

				var re=/(\n|\r\n)/g;

				var jsonResult_notice = jsonResult.BannerList;
				
				for(var i in jsonResult_notice){

					text +=' <div class="coupon_cont figure">';
					if( jsonResult_notice[i].discount_price == 0 ){
						text +=' 	<div class="discount_info">무료증정</div>';
					}else{
						text +=' 	<div class="discount_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
					}					
					text +='     <div class="thumb_wrap">';
					if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
                    if(jsonResult_notice[i].img_path == null){
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/images/coupon_noimg.png" alt="이미지없음"></a>';                       
                       }else{
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
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
					text +='     </div>';

					text +='<div class="product_modal">';            
					text +='	<div class="product_modal_wrap">';
					text +='		<div class="modal_cls"><img src="../images/coupon_cls.png" alt="쿠폰닫기"></div>';
					text +='        <div class="coupon_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
					text +='        <div class="coupon_thumb_wrap">';
					if (jsonResult_notice[i].coupon_type == "BILLING")
					{
						text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
					}else{
                        if(jsonResult_notice[i].img_path == null){
                              text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/images/coupon_noimg.png" alt="이미지없음"></a>';                       
                           }else{
                              text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                           }
					}
					text +='        </div>';
					text +='        <div class="coupon_barcode_wrap">';
					text +='			<span class="coupon_barcode" id="2_'+jsonResult_notice[i].coupon_code+'" style="display : block; margin : auto;">';
					text +='            </span>';
					text +='        </div>';
					text +='        <div class="coupon_bg">';
					text +='			<div class="coupon_title">';
                    if(jsonResult_notice[i].pd_name == null){
                         text +='&nsbp;</div>'; 
                    }else{
                         text +='   ' +jsonResult_notice[i].pd_name+'</div>';   
                    }
					text +='            <div class="coupon_btn_wrap" onclick="certCoupon('+jsonResult_notice[i].mc_no+');">';
					text +='                <span class="coupon_btn">직원확인</span>';
					text +='			</div>';
					text +='        </div>';
					text +='        <div class="coupon_txt">';
					text +='            <p>';
					text +=''+jsonResult_notice[i].coupon_detail.replace(re,"<br>")+'';
					text +='            </p>';
					text +='        </div>';       
					text +='    </div>';
					text +='</div>';

					text +=' </div>';

				}

			}
	
		$("#list_2").empty();
		$("#list_2").append(text);

		//썸네일 높이 넓이 맞추기
		var thumbW = $(".figure .thumb_wrap").width();
		$(".figure .thumb_wrap").height(thumbW);

		$(".product_detail, .thumb_wrap").click(function(){
			$(this).siblings(".product_modal").addClass("active");
		})
		$(".modal_cls").click(function(){
			$(this).closest(".product_modal").removeClass("active");
		})
		
		for(var i in jsonResult_notice){
				
			$("#2_"+jsonResult_notice[i].coupon_code).barcode(jsonResult_notice[i].coupon_code, "code128",{barWidth:1, barHeight:50});

		}

	
	})

}

/* 쿠폰 - 결제할인 */
function couponListEnd(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'https://www.nhhanaromart.com/back/02_app/mCouponMineEnd.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no, memberNo: localStorage.getItem("memberNo")},
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

			var re=/(\n|\r\n)/g;

			var jsonResult_notice = jsonResult.BannerList;
			
			for(var i in jsonResult_notice){

				text +=' <div class="coupon_cont figure">';
				if( jsonResult_notice[i].discount_price == 0 ){
					text +=' 	<div class="discount_info">무료증정</div>';
				}else{
					text +=' 	<div class="discount_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
				}				
                text +='     <div class="thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
                    if(jsonResult_notice[i].img_path == null){
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/images/coupon_noimg.png" alt="이미지없음"></a>';                       
                       }else{
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                       }
				}
                text +='     </div>';
                text +='     <div class="product_detail">';

                if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +='         <a href="#" class="product">'+comma(jsonResult_notice[i].min_price)+' 원구매시</a>';
				}else{
					text +='         <a href="#" class="product">'+jsonResult_notice[i].pd_name+'</a>';
				}

                text +='         <a href="#" class="dicount_date">';
				text +=' 		    <span>'+jsonResult_notice[i].start_date+'</span>~';
                text +='             <span>'+jsonResult_notice[i].end_date+'</span>';
                text +='         </a>';
                text +='     </div>';

				text +='<div class="product_modal">';            
				text +='	<div class="product_modal_wrap">';
				text +='		<div class="modal_cls"><img src="../images/coupon_cls.png" alt="쿠폰닫기"></div>';
				text +='        <div class="coupon_info">'+comma(jsonResult_notice[i].discount_price)+'원 할인</div>';
				text +='        <div class="coupon_thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
                    if(jsonResult_notice[i].img_path == null){
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/images/coupon_noimg.png" alt="이미지없음"></a>';                       
                       }else{
                          text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].pd_name+'"></a>';
                       }
				}
				text +='        </div>';
				text +='        <div class="coupon_barcode_wrap">';
				text +='			<span class="coupon_barcode" id="3_'+jsonResult_notice[i].coupon_code+'" style="display : block; margin : auto;">';
                text +='            </span>';
				text +='        </div>';
				text +='        <div class="coupon_bg">';
				text +='			<div class="coupon_title">'
                if(jsonResult_notice[i].pd_name == ""){
                         text +='   ' +comma(jsonResult_notice[i].min_price)+' 원이상</div>'; 
                }else{
                         text +='   ' +jsonResult_notice[i].pd_name+'</div>';   
                }                
				text +='            <div class="coupon_btn_wrap" onclick="certCoupon('+jsonResult_notice[i].mc_no+');">';
				text +='                <span class="coupon_btn">직원확인</span>';
				text +='			</div>';
				text +='        </div>';
				text +='        <div class="coupon_txt">';
				text +='            <p>';
				text +=''+jsonResult_notice[i].coupon_detail.replace(re,"<br>")+'';
				text +='            </p>';
				text +='        </div>';       
				text +='    </div>';
				text +='</div>';

				text +=' </div>';

			}
			}
			
		$("#list_3").empty();
		$("#list_3").append(text);

		//썸네일 높이 넓이 맞추기
		var thumbW = $(".figure .thumb_wrap").width();
		$(".figure .thumb_wrap").height(thumbW);

		$(".product_detail, .thumb_wrap").click(function(){
			$(this).siblings(".product_modal").addClass("active");
		})
		$(".modal_cls").click(function(){
			$(this).closest(".product_modal").removeClass("active");
		})

		for(var i in jsonResult_notice){
				
			$("#3_"+jsonResult_notice[i].coupon_code).barcode(jsonResult_notice[i].coupon_code, "code128",{barWidth:1, barHeight:50});

		}

	
	})

}