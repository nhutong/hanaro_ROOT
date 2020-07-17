$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");

		getLeft();
		getLeftMenu('event');
		$("#nh_event_coupon").addClass("active");
				
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

		//판매장 정보 가져오기
		getCompanyList();
	
		//판매장 선택, 삭제
		$('#companyAddBtn').on('click', function(){
			var companyNo = $('#company').val();
			var companyName = $('#company').find('option[value='+companyNo+']').text().trim();
			if($('#cp'+companyNo).length) return;
			if(companyNo == null){
				alert("판매장을 선택하세요.");
				return false;
			}
			$('#companyAddBtn').parent().append('<div data-no="'+companyNo+'" id="cp'+companyNo+'" class="selected_option">'+ companyName +'</div>');
			$('.selected_option').on('click', function(){
				$(this).remove();
			});
		});



		$("#product_code").on('change', function(e){
			getCouponInfo();
		});
	
		$('#couponEditSubmit').on('click', function(){	

			var companyList = '';
			$('.selected_option').each( function (idx, item) {
				if(idx === 0 ) companyList += $(item).data('no');
				else companyList += ',' + $(item).data('no');			    
			});
			
			var formData = {
				coupon_name :$('#coupon_name').val(),
				limit_qty : $('#limit_qty').val(),
				coupon_detail : $('#coupon_detail').val(),
				start_date : $('#start_date').val(),
				end_date : $('#end_date').val(),
				coupon_type : $('#coupon_type').val(),
				product_code : $('#product_code').val(),
				product_name : $('#product_name').val(),
				coupon_code : $('#coupon_code').val(),
				discount_price : $('#discount_price').val(),
				min_price : $('#min_price').val()||0,
				status_cd : $('#status_cd').val(),
				company_list : companyList
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

			if(!formData.product_code && formData.coupon_type == "PRODUCT") {
				alert('상품코드(상품명)를 입력해주세요.');
				return;
			}
            
            if(formData.coupon_detail == undefined || null || ""){
				var text = "[쿠폰 사용시 유의사항]<br>-앱쿠폰은 하나로마트 회원만 사용 가능합니다.<br>-쿠폰을 다운받으신 매장에서만 사용 가능합니다.<br>-매장 계산대에서 본 쿠폰을 제시해주세요.<br>-할인 조건은 최종결제금액 기준으로 적용됩니다.<br>-일부 쿠폰과 중복사용이 불가합니다.<br>-쿠폰의 상품 및 사용조건은 변동될 수 있습니다.<br>-현금과 교환되지 않으며 양도가 불가능 합니다.<br>-사용하신 쿠폰은 즉시 소멸됩니다.<br>-재결제 시에는 쿠폰적용이 불가합니다.<br>-일부품목은 적용이 제외됩니다.<br>-쿠폰 적용 시, 타 영수증과 합산불가하며 한 개의 영수증을 분할하여 사용할 수 없습니다.<br>-식자재매장, 임대매장, 일부코너 상품은 사용이 불가합니다.";
				var re = "\n";
				$("#coupon_detail").val(text.replace(/<br>/gi,re));			
			}else{
				$("#coupon_detail").val(formData.coupon_detail.replace(/<br>/gi,re));	
			}
					
			createCoupon(formData);
		});
	
	
		
	});

	function createCoupon(formData){
		$.post( '/back/05_event/couponCreate.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['insert'] > 0){
					alert('등록되었습니다');
					location.href ='/event/coupon.html';
				}else {
					alert("입력되지 않은 항목이 있습니다.");
				}
			}
		);
	}
	

	function getCouponInfo(){

		var product_code = $('#product_code').val();
		if(!product_code) return;
		$.get('/back/05_event/product.jsp?product_code='+product_code,	
		function(result) {
			console.log("============= notice callback ========================");
			console.log(result);
			if(result == "NoN") {
				alert('존재하지 않는 상품코드입니다.\n상품명을 직접입력하시기 바랍니다.')
				$('#coupon_name').text('');
			}else{
				var data = JSON.parse(result);
				data['CompanyList'].forEach(function(item, index){                        

					$("#product_name").val(decodeURIComponent(item['pd_name']));

				});

			}
			
		});
	}


	//핀매장 리스트 가져오기
	function getCompanyList(){
		$.get("/back/00_include/getCompanyList.jsp",		
			function(resultJSON){						
				//console.log(resultJSON);
				companyList = resultJSON['list'];
				if(companyList.lengh) return;
				setCompanyOptions(companyList);
			}
		);
	}
	
	// 판매장 리스트 셋업
	function setCompanyOptions(companyList){
		var options = '';
		$(companyList).each( function (idx, company) {
			options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
		});
		$('#company').append(options);
	}
