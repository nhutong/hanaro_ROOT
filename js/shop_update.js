$(function () {
	getHeader();

	getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_shop").addClass("active");

	// jQuery Timepicker : https://timepicker.co/
	$('#startTime,#endTime').timepicker({
		timeFormat: 'HH:mm',
		minTime: '00:00',
		maxTime: '23:50',
		interval: 10,
		dropdown: true
	}); 
		//24시간 체크하면 input disabled
	$(".operation_hour_24 input[type='checkbox']+label, .operation_hour_24 input[type='checkbox']").click(function(){
		
		var checked = $(".operation_hour_24 input[type='checkbox']").is(":checked");
		if(checked == true){
			$("input#endTime,input#startTime").attr('disabled','true');
			$("input#endTime,input#startTime").css("background-color","#d8d8d8");
		}else{
			$("input#endTime,input#startTime").removeAttr('disabled','false');
			$("input#endTime,input#startTime").css("background-color","#fff");
		}


	
	});
	// 판매장 및 데이터 조회
	$.ajax({
		url: '/back/99_manage/shopUpdate.jsp?no=' + getParameterByName('no'),
		method: 'GET' 
	})
	.done(function(results){
		// 판매장
		var company = results.data;

		$('#name').val(company.name);
		$('#address1').val(company.address1);
		$('#address2').val(company.address2);
		
		// libphonenumber-js : https://github.com/catamphetamine/libphonenumber-js
		if(company.tel) {
			var formattedTel = libphonenumber.parsePhoneNumberFromString(company.tel, 'KR').formatNational().split('-');
			$('#tel1').val(formattedTel[0]);
			$('#tel2').val(formattedTel[1]);
			$('#tel3').val(formattedTel[2]);

		}

		if(company.startTime) {
			$('#startTime').val(company.startTime.substring(0, 2) + ':' + company.startTime.substring(2, 4));
		}

		if(company.endTime) {
			$('#endTime').val(company.endTime.substring(0, 2) + ':' + company.endTime.substring(2, 4));
		}

		$('#tsf').prop('checked', company.tsf === 'Y');
		//24시간 연중무퓨 체크시 input박스 사용 불가능
		var checked = $("#tsf").is(":checked");
		if(checked == true){
			$("input#endTime,input#startTime").attr('disabled','true');
			$("input#endTime,input#startTime").val('');
			$("input#endTime,input#startTime").css("background-color","#d8d8d8");
		}else{
			$("input#endTime,input#startTime").removeAttr('disabled','false');
			$("input#endTime,input#startTime").css("background-color","#fff");
		}
		$('#offNote').val(company.offNote);
		$('input[type=radio][name=delivery][value=' + (company.delivery === 'Y' ? 'Y' : 'N') + ']').prop('checked', true),
		$('input[type=radio][name=sales][value=' + (company.sales === 'Y' ? 'Y' : 'N') + ']').prop('checked', true)
	})
	.fail(function(jqXHR){
		alert(jqXHR.responseJSON.error);
		window.history.back();
	})
	.always(function(){
		// 시간 검증 추가
		// https://stackoverflow.com/a/20806452
		$.validator.addMethod(
			'greaterTimeThan', 
			function(value, element, params) {    
				return Number(value.replace(':', '')) > Number($(params[0]).val().replace(':', '')); 
			}, 
			'{1}보다 이후의 시간이어야 합니다.'
		);

		// 입력값 검증 설정
		// https://jqueryvalidation.org/validate/
		$('#tab1').validate({
			rules: {
				name: {
					required: true
				},
				address1: {
//					required: true
				},
				address2: {
				},
				tel1: {
//					required: true,
					digits: true,
					minlength: 2
				},
				tel2: {
//					required: true,
					digits: true,
					minlength: 3,
					maxlength: 4
				},
				tel3: {
//					required: true,
					digits: true,
					minlength: 4,
					maxlength: 4
				},
				startTime: {
//					required: true
				},
				endTime: {
//					required: true,
					greaterTimeThan: ['#startTime', '시작시간']
				},
				tsf: {
				},
				offNote: {
				},
				delivery: {
//					required: true
				},
				sales: {
//					required: true
				}
			}
		});
	});
});

function history_back(){
	window.history.back();
}

// 판매장 수정
var updating = false;
function updateShop() {
	if(updating) { // 중복방지
		return 
	}

	// 수정 비활성화
	updating = true;

	// 입력값 검증
	// https://jqueryvalidation.org/valid/
	if($('#tab1').valid() && confirm('수정하시겠습니까?')) {

	} else {
		// 수정 활성화
		updating = false;
		return;
	}

	$.ajax({
		url: '/back/99_manage/shopUpdateUpdate.jsp',
		method: 'POST',
		data: {
			no: getParameterByName('no'),
			name: $('#name').val(),
			address1: $('#address1').val(),
			address2: $('#address2').val(),
			tel: $('#tel1').val() + $('#tel2').val() + $('#tel3').val(),
			startTime: $('#startTime').val().replace(':', ''),
			endTime: $('#endTime').val().replace(':', ''),
			tsf: $('#tsf').prop("checked") ? 'Y' : 'N',
			offNote: $('#offNote').val(),
			delivery: $('input[type=radio][name=delivery]:checked').val(),
			sales: $('input[type=radio][name=sales]:checked').val()
		}
	})
	.done(function(data){
		if(data.update === 1) {
			shop();
		} else {
			// 메시지 TO-DO

			// 수정 활성화
			updating = false;
		}
	})
	.fail(function(jqXHR){
		alert(jqXHR.responseJSON.error);

		// 수정 활성화
		updating = false;
	});
}

function popupPostcode() {
	// Daum 우편번호 서비스 : http://postcode.map.daum.net/guide
	daum.postcode.load(function(){
		new daum.Postcode({
				oncomplete: function(data) {
					$('#address1').val(data.address);
					$('#address2').focus();
				}
		}).open();
	});
}