$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");

		getLeft();
		getLeftMenu('event');
		$("#nh_event_stamp").addClass("active");

		var stamp_no = location.search.split('=')[1];
		getStampInfo(stamp_no);	

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
		
		$("#coupon_code").on('change', function(e){
			getCouponInfo();
		});

		$('#stampSubmit').on('click', function(){	
			updateStamp(stamp_no);
		});
	});
	
	function getStampInfo(stamp_no){

		$.get('/back/05_event/stamp.jsp?stamp_no='+stamp_no,
		function(resultJSON) {
			console.log(resultJSON);
			var stampInfo = resultJSON.list[0];	
			$('#coupon_code').val(stampInfo.coupon_code);
			$('#min_price').val(stampInfo.min_price);			
			$('#start_date').val(stampInfo.start_date);
			$('#end_date').val(stampInfo.end_date);
			$('#status').val(stampInfo.status);
			getCouponInfo();
		});
	}
	function getCouponInfo(){

		var coupon_code = $('#coupon_code').val();
		if(!coupon_code) return;
		$.get('/back/05_event/coupon.jsp?coupon_code='+coupon_code,	
		function(result) {
			console.log(result);
			if(result.total == 0) {
				alert('존재하지 않는 쿠폰번호입니다.\n쿠폰번호를 확인해주세요.');
				$('#coupon_name').text('');
				$('#coupon_start_date').val('');
				$('#coupon_end_date').val('');
				$('#product_code').text('');				
				$('#coupon_code').select();
				
			}else{
				var info = result.list[0];		
				$('#coupon_name').text(info.coupon_name);
				$('#coupon_start_date').val(info.start_date);
				$('#coupon_end_date').val(info.end_date);
				$('#product_code').text(info.product_code);
			}
			
		});
	}

	function updateStamp(stamp_no){

		var formData = {
			stamp_no : stamp_no,
			coupon_code : $('#coupon_code').val(),
			min_price : $('#min_price').val() || "0",
			start_date : $('#start_date').val(),
			end_date : $('#end_date').val(),				
			status : $('#status').val()
		} ;

		console.log(formData);

		if(!formData.start_date) {
			alert('스탬프 적용 시작일을 넣어주세요.');
			return;
		}

		if(!formData.end_date) {
			alert('스탬프 적용 종료일을 넣어주세요.');
			return;
		}

		if(formData.start_date > formData.end_date){
			alert('스탬프 적용 종료일은 시작일보다 빠를 수 없습니다.');
			return;
		}		

		$.post( '/back/05_event/stampUpdate.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['update'] > 0){
					alert('수정되었습니다');
					location.href ='/event/stamp.html';
				}else {
					alert(resultJSON['error']);
				}
			}
		);
	}
