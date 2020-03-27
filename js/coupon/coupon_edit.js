$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");

		getLeft();
		getLeftMenu('event');
		$("#nh_event_coupon").addClass("active");

		//datepicker 세팅
		$.datepicker.setDefaults({
			dateFormat: 'yy-mm-dd',
			prevText: '이전 달',
			nextText: '다음 달',
			monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			dayNames: ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
			showMonthAfterYear: true,
			yearSuffix: '년'
		});

		$("#start_date").datepicker();
		$("#end_date").datepicker();

		// 최초 오픈시 금액 row 숨기기
		$('#price_area').hide();		

		// 상품일 경우 상품 영역, 결제할인일경우 금액영역 보여주기
		$('#coupon_type').on('change', function(){
			console.log(this.value);
			if(this.value == 'PRODUCT'){
				$('#price_area').hide();
				$('#product_area').show();
			}else{
				$('#price_area').show();
				$('#product_area').hide();
			}
		});

		var coupon_no = location.search.split('=')[1];
		getCouponInfo(coupon_no);
	
		$('#couponEditSubmit').on('click', function(){	
			
			var formData = {
				coupon_no : coupon_no,
				coupon_name :$('#coupon_name').val(),
				limit_qty : $('#limit_qty').val() || "0",
				coupon_detail : $('#coupon_detail').val(),
				start_date : $('#start_date').val(),
				end_date : $('#end_date').val(),
				coupon_type : $('#coupon_type').val(),
				product_code : $('#product_code').val(),
				coupon_code : $('#coupon_code').val(),
				discount_price : $('#discount_price').val() || "0",
				min_price : $('#min_price').val() || "0",
				status_cd : $('#status_cd').val(),
				stamp_fg : $('#status_stamp').val()
			} ;

			console.log(formData);

			if(!formData.coupon_name) {
				alert('쿠폰명을 입력해주세요.');
				return;
			}

			if(!formData.start_date) {
				alert('쿠폰 시작일을 넣어주세요.');
				return;
			}

			if(!formData.end_date) {
				alert('쿠폰 종료일을 넣어주세요.');
				return;
			}

			if(formData.start_date > formData.end_date){
				alert('쿠폰 종료일은 시작일보다 빠를 수 없습니다.');
				return;
			}
					
			updateCoupon(formData);
		});
	
		$('#couponEditDel').on('click', function(){							
			if(!confirm("삭제하시겠습니까?")) return;
			var formData = {
				coupon_no :coupon_no
			}
			deleteCoupon(formData);		
		});
		
	
		
	});

	function getCouponInfo(coupon_no){

		$.get('/back/05_event/coupon.jsp?coupon_no='+coupon_no,	
		function(result) {
			console.log(result);
			var info = result.list[0];			

			$('#imgPreview').attr('src',info.img_url);
			$('#detailImgPreview').attr('src',info.detail_img_url);			
			$('#eventTitle').val(info.event_title);
			$('#event_start_date').val(info.start_date);
			$('#event_end_date').val(info.end_date);
			$('#company').text(info.company_name);
			$('#activated').val(info.activated);
			$('#linkUrl').val(info.link_url);
		
			$('#coupon_name').val(info.coupon_name);
			$('#limit_qty').val(info.limit_qty);
			if(info.coupon_detail == undefined || null || ""){
				var text = "[쿠폰 사용시 유의사항]<br>-앱쿠폰은 하나로마트 회원만 사용 가능합니다.<br>-쿠폰을 다운받으신 매장에서만 사용 가능합니다.<br>-매장 계산대에서 본 쿠폰을 제시해주세요.<br>-할인 조건은 최종결제금액 기준으로 적용됩니다.<br>-일부 쿠폰과 중복사용이 불가합니다.<br>-쿠폰의 상품 및 사용조건은 변동될 수 있습니다.<br>-현금과 교환되지 않으며 양도가 불가능 합니다.<br>-사용하신 쿠폰은 즉시 소멸됩니다.<br>-재결제 시에는 쿠폰적용이 불가합니다.<br>-일부품목은 적용이 제외됩니다.<br>-쿠폰 적용 시, 타 영수증과 합산불가하며 한 개의 영수증을 분할하여 사용할 수 없습니다.<br>-식자재매장, 임대매장, 일부코너 상품은 사용이 불가합니다.";
				var re = "\n";
				$("#coupon_detail").val(text.replace(/<br>/gi,re));			
			}else{
				$("#coupon_detail").val(info.coupon_detail.replace(/<br>/gi,re));	
			}


			$('#start_date').val(info.start_date);
			$('#end_date').val(info.end_date);
			$('#coupon_type').val(info.coupon_type);

			$('#product_code').val(info.product_code);
			$('#coupon_code').val(info.coupon_code);
			$('#discount_price').val(info.discount_price);
			$('#min_price').val(info.min_price);
			$('#company_name').append(info.company_name);
			$('#status_cd').val(info.status_cd);
			$('#status_stamp').val(info.stamp_fg);

			if(info.coupon_type == 'PRODUCT'){
				$('#price_area').hide();
				$('#product_area').show();
			}else{
				$('#price_area').show();
				$('#product_area').hide();
			}
			
		});
	}

	function updateCoupon(formData){
		$.post( '/back/05_event/couponUpdate.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['update'] > 0){
					alert('반영되었습니다');
					location.href ='/event/coupon.html';
				}else {
					console.log(resultJSON['error']);
                    alert("에러가 발생하였습니다.");
				}
			}
		);
	}

	function deleteCoupon(formData){
		$.post( '/back/05_event/couponDelete.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['delete'] > 0){
					alert('삭제되었습니다');
					location.href ='/event/coupon.html';
				}else {
					alert(resultJSON['error']);
				}
			}
		);
	}

	function coupon_popup(){
		window.open('coupon_print.html',"pop출력창",'location=no,status=no,scrollbars=yes,left=300,top=300,width=1350,height=640')  
	}
