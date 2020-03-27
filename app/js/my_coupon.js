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

	//$(".product_detail, .thumb_wrap").click(function(){
		//$(this).siblings(".product_modal").addClass("active");
    //})
    //$(".modal_cls").click(function(){
        //$(this).closest(".product_modal").removeClass("active");
    //})

   ////쿠폰 사용 확인
   //$(".coupon_btn_wrap").click(function(){       
	   //if(confirm("쿠폰을 사용하시겠습니까?") == true){
			//alert("쿠폰이 사용되었습니다");
			//$(this).children(".coupon_btn").css("background-color","#949494");	
	   //}else{
			//alert("사용이 취소되었습니다.");
			//return false;
	   //}           
   //})
	   
	couponList(vm_cp_no);
	couponListIng(vm_cp_no);
	couponListEnd(vm_cp_no);

})

/* 버튼 클릭시 쿠폰 저장 */
function certCoupon(rcvMcNo){

	$.ajax({
		url:'/back/02_app/mCouponMineCert.jsp?random=' + (Math.random()*99999), 
		data : {mcNo: rcvMcNo},
		method : 'GET' 
	}).done(function(result){
			
		console.log("noticeList=========================================");
		if(result == 'dup'){
			alert("이미 직원확인을 받으셨습니다.")
		}else if(result == 'exception error'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("직원확인을 받으셨습니다.")
		}
	});

}

/* 쿠폰 - 전체 */
function couponList(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mCouponMine.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no, tel: localStorage.getItem("tel")},
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
				text +=' 	<div class="discount_info">'+jsonResult_notice[i].coupon_name+'</div>';
                text +='     <div class="thumb_wrap">';
				
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt=""></a>';
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
                text +='        <div class="coupon_info">'+jsonResult_notice[i].coupon_name+'</div>';
                text +='        <div class="coupon_thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt=""></a>';
				}
                text +='        </div>';
                text +='        <div class="coupon_barcode_wrap">';
				text +='			<span class="coupon_barcode" id="1_'+jsonResult_notice[i].coupon_code+'" style="display : block; margin : auto;">';
				//text +='				<img src="../images/barcode.png" alt="바코드">';
                text +='            </span>';
                text +='        </div>';
                text +='        <div class="coupon_bg">';
				text +='			<div class="coupon_title">'+jsonResult_notice[i].pd_name+'</div>';
                text +='            <div class="coupon_btn_wrap">';
                text +='                <span class="coupon_btn" onclick="certCoupon('+jsonResult_notice[i].mc_no+');">직원확인</span>';
				text +='			</div>';
                text +='        </div>';
                text +='        <div class="coupon_txt">';
                text +='            <p>';
                text +='                    [쿠폰 사용시 유의사항]<br>';
                text +='                    -쿠폰을 다운받으신 매장에서만 사용가능합니다. <br>';
                text +='                    -매장 계산대에서 본 쿠폰을 제시해주세요.<br>';
                text +='                    -할인조건은 최종결제금액을 기준으로 적용됩니다.<br>';
                text +='                    -일부 쿠폰과 중복사용이 불가합니다.<br>';
                text +='                    -쿠폰의 상품 및 사용조건은 변동될 수 있습니다.<br>';
                text +='                    -현금과 교환되지 않으며 양도가 불가합니다.<br>';
                text +='                    -일부품목은 적용이 제외됩니다.<br>';
                text +='                    -쿠폰 적용 시, 타 영수증과 합산 불가하며 한 개의 영수증을 분할하여 사용할 수 없습니다.<br>';
                text +='                    -식자재매장, 임대매장, 일부 코너상품은 사용이 불가합니다.<br>';
                text +='            </p>';
                text +='        </div>';       
                text +='    </div>';
                text +='</div>';

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

	   //쿠폰 사용 확인
	   $(".coupon_btn_wrap").click(function(){       
		   if(confirm("쿠폰을 사용하시겠습니까?") == true){
				$(this).children(".coupon_btn").css("background-color","#949494");	
		   }else{
				alert("사용이 취소되었습니다.");
				return false;
		   }           
	   })
		
	})

}

/* 쿠폰 - 진행중 */
function couponListIng(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mCouponMineIng.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no, tel: localStorage.getItem("tel")},
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
					text +=' 	<div class="discount_info">'+jsonResult_notice[i].coupon_name+'</div>';
					text +='     <div class="thumb_wrap">';
					if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt=""></a>';
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
					text +='        <div class="coupon_info">'+jsonResult_notice[i].coupon_name+'</div>';
					text +='        <div class="coupon_thumb_wrap">';
					if (jsonResult_notice[i].coupon_type == "BILLING")
					{
						text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
					}else{
						text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt=""></a>';
					}
					text +='        </div>';
					text +='        <div class="coupon_barcode_wrap">';
					text +='			<span class="coupon_barcode" id="2_'+jsonResult_notice[i].coupon_code+'" style="display : block; margin : auto;">';
					//text +='				<img src="../images/barcode.png" alt="바코드">';
					text +='            </span>';
					text +='        </div>';
					text +='        <div class="coupon_bg">';
					text +='			<div class="coupon_title">'+jsonResult_notice[i].pd_name+'</div>';
					text +='            <div class="coupon_btn_wrap">';
					text +='                <span class="coupon_btn" onclick="certCoupon('+jsonResult_notice[i].mc_no+');">직원확인</span>';
					text +='			</div>';
					text +='        </div>';
					text +='        <div class="coupon_txt">';
					text +='            <p>';
					text +='                    [쿠폰 사용시 유의사항]<br>';
					text +='                    -쿠폰을 다운받으신 매장에서만 사용가능합니다. <br>';
					text +='                    -매장 계산대에서 본 쿠폰을 제시해주세요.<br>';
					text +='                    -할인조건은 최종결제금액을 기준으로 적용됩니다.<br>';
					text +='                    -일부 쿠폰과 중복사용이 불가합니다.<br>';
					text +='                    -쿠폰의 상품 및 사용조건은 변동될 수 있습니다.<br>';
					text +='                    -현금과 교환되지 않으며 양도가 불가합니다.<br>';
					text +='                    -일부품목은 적용이 제외됩니다.<br>';
					text +='                    -쿠폰 적용 시, 타 영수증과 합산 불가하며 한 개의 영수증을 분할하여 사용할 수 없습니다.<br>';
					text +='                    -식자재매장, 임대매장, 일부 코너상품은 사용이 불가합니다.<br>';
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

	   //쿠폰 사용 확인
	   $(".coupon_btn_wrap").click(function(){       
		   if(confirm("쿠폰을 사용하시겠습니까?") == true){
				$(this).children(".coupon_btn").css("background-color","#949494");	
		   }else{
				alert("사용이 취소되었습니다.");
				return false;
		   }           
	   })
	
	})

}

/* 쿠폰 - 종료 */
function couponListEnd(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mCouponMineEnd.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no, tel: localStorage.getItem("tel")},
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
				text +=' 	<div class="discount_info">'+jsonResult_notice[i].coupon_name+'</div>';
                text +='     <div class="thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt=""></a>';
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
				text +='        <div class="coupon_info">'+jsonResult_notice[i].coupon_name+'</div>';
				text +='        <div class="coupon_thumb_wrap">';
				if (jsonResult_notice[i].coupon_type == "BILLING")
				{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/app/images/coupon_image.png" alt=""></a>';
				}else{
					text +=' 		<a href="#"><img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt=""></a>';
				}
				text +='        </div>';
				text +='        <div class="coupon_barcode_wrap">';
				text +='			<span class="coupon_barcode" id="3_'+jsonResult_notice[i].coupon_code+'" style="display : block; margin : auto;">';
				//text +='				<img src="../images/barcode.png" alt="바코드">';
                text +='            </span>';
				text +='        </div>';
				text +='        <div class="coupon_bg">';
				text +='			<div class="coupon_title">'+jsonResult_notice[i].pd_name+'</div>';
				text +='            <div class="coupon_btn_wrap">';
				text +='                <span class="coupon_btn" onclick="certCoupon('+jsonResult_notice[i].mc_no+');">직원확인</span>';
				text +='			</div>';
				text +='        </div>';
				text +='        <div class="coupon_txt">';
				text +='            <p>';
				text +='                    [쿠폰 사용시 유의사항]<br>';
				text +='                    -쿠폰을 다운받으신 매장에서만 사용가능합니다. <br>';
				text +='                    -매장 계산대에서 본 쿠폰을 제시해주세요.<br>';
				text +='                    -할인조건은 최종결제금액을 기준으로 적용됩니다.<br>';
				text +='                    -일부 쿠폰과 중복사용이 불가합니다.<br>';
				text +='                    -쿠폰의 상품 및 사용조건은 변동될 수 있습니다.<br>';
				text +='                    -현금과 교환되지 않으며 양도가 불가합니다.<br>';
				text +='                    -일부품목은 적용이 제외됩니다.<br>';
				text +='                    -쿠폰 적용 시, 타 영수증과 합산 불가하며 한 개의 영수증을 분할하여 사용할 수 없습니다.<br>';
				text +='                    -식자재매장, 임대매장, 일부 코너상품은 사용이 불가합니다.<br>';
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

	   //쿠폰 사용 확인
	   $(".coupon_btn_wrap").click(function(){       
		   if(confirm("쿠폰을 사용하시겠습니까?") == true){
				$(this).children(".coupon_btn").css("background-color","#949494");	
		   }else{
				alert("사용이 취소되었습니다.");
				return false;
		   }           
	   })
	
	})

}