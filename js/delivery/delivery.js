$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	getHeader();
    $(".nav_delivery").addClass("active");

	getLeft();
	getLeftMenu('delivery');
	$("#nh_delivery_delivery").addClass("active");
	
	getCompanyList();

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

	$(function() {
		$("#start_date").datepicker();
		$("#end_date").datepicker();

		if($('#noDeliveryDay').prop('checked')){
			$("#unDeliverableDay").attr("disabled",false)
		}else{
			$("#unDeliverableDay").attr("disabled",true)
		}
	});	

	var userRoleCd = getCookie('userRoleCd');

	$('#deliverySubmit').on('click', function(){
		if(userRoleCd == 'ROLE3'){
			alert("저장가능한 권한이 없습니다. 매장관리자에게 문의하세요.")
		}else{
			updateDeliveryMaster();
		}
	});	

	$('#company').on('change', function(){
			getDeliveryInfo();
			getDeliveryRoundInfo();
	});	
	
	$("#noDeliveryDay").on("change", function(){
		if($('#noDeliveryDay').prop('checked')){
			$("#unDeliverableDay").attr("disabled",false)
		}else{
			$("#unDeliverableDay").attr("disabled",true)
		}
	})
	
	/* 20200127 - 배송기능미사용으로 설정시, 알럿을 띄우고, 판매장설정화면으로 이동 */
	if ( getCookie("VM_delivery_FG") != "Y" && getCookie("userCompanyNo") != "0" )
	{
		alert("현재 배송기능 미사용으로 설정되어 있습니다. 해당메뉴로 이동합니다.");
		location.href="/manage/shop_update.html?no="+getCookie("userCompanyNo");
	}

});


function updateDeliveryMaster(){
	var dongList = [];
	$('.selected_option').each(function(idx, el){
		dongList.push($(el).data('dong'));
	})
	
	var formData = {		
		company_no : $('#company').val(),
		dong_list : dongList.join(),
		min_amount : $('#del_price').val(),
		undeliverable_weekend_flag : ($('#noDeliveryWeekend').prop('checked') ? 'Y' : 'N'),
		undeliverable_holiday_flag : ($('#noDeliveryHoliday').prop('checked') ? 'Y' : 'N'),
		undeliverable_day : ($('#noDeliveryDay').prop('checked') ?  $('#unDeliverableDay').val() : ''),
		undeliverable_period_flag : ($('#noDeliveryPeriod').prop('checked') ? 'Y' : 'N'),
		undeliverable_date_start : null,
		undeliverable_date_end : null
	};
	

	if($('#noDeliveryPeriod').prop('checked')){
		formData.undeliverable_date_start =  $('#start_date').val() ;
		formData.undeliverable_date_end =  $('#end_date').val() ;

		if(!formData.undeliverable_date_start){
			alert('배송불가 시작일을 넣어주세요.');
			$('#start_date').focus();
			return;
		}

		if(!formData.undeliverable_date_end){
			alert('배송불가 종료일을 넣어주세요.');
			$('#end_date').focus();
			return;
		}

		if(formData.undeliverable_date_start > formData.undeliverable_date_end){
			alert('배송불가 시작일이 종료일보다 이후입니다. 날짜를 확인해주세요.');
			$('#start_date').focus();
			return;
		}
	}
	
	$.post(
		"/back/07_delivery/deliveryUpdate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert(resultJSON.error[0]);
			}
			
			if(resultJSON['update'] > 0){
				alert('저장되었습니다.');
				getDeliveryInfo();
			}
		}
	)
	
}

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

function setCompanyOptions(companyList){
	var options = '';
	$(companyList).each( function (idx, company) {
		if(company.VM_CP_NO == 0 ) return;
		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
	});
	$('#company').append(options);
	getDeliveryInfo();
	getDeliveryRoundInfo();
}

function getDeliveryInfo(){
	initDeliveryInfo();
	$.get("/back/07_delivery/delivery.jsp?company_no=" + $('#company').val(),
		function(resultJSON){						
			console.log(resultJSON);
			var deliveryInfo = resultJSON.list[0];
			if(deliveryInfo){
				if( deliveryInfo['dong_list']){
					var dongListArr = deliveryInfo.dong_list.split(',');
					console.log(dongListArr);				
					$(dongListArr).each(function(idx, dongName) {
						addDong(dongName);
					})
				}
	
				$('#del_price').val(deliveryInfo.min_amount);
				
				var weekendFlag = (deliveryInfo.undeliverable_weekend_flag == 'Y' ? true: false);
				$('#noDeliveryWeekend').prop('checked' , weekendFlag);
				
				var holidayFlag = (deliveryInfo.undeliverable_holiday_flag == 'Y' ? true: false);
				$('#noDeliveryHoliday').prop('checked' , holidayFlag);
	
				var dayFlag = (deliveryInfo.undeliverable_day ? true: false);
				$('#noDeliveryDay').prop('checked' , dayFlag);
				$('#unDeliverableDay').val(deliveryInfo.undeliverable_day);
	
				var periodFlag = (deliveryInfo.undeliverable_date_start ? true: false);
				$('#noDeliveryPeriod').prop('checked' , periodFlag);
				$('#start_date').val(deliveryInfo.undeliverable_date_start);
				$('#end_date').val(deliveryInfo.undeliverable_date_end);
			}			
		}
	);
}

function initDeliveryInfo(){
	$('#dongList').empty();
	$('#del_price').val();
	$('#del_price').val(0);								
	$('#noDeliveryWeekend').prop('checked' , false);
	$('#noDeliveryHoliday').prop('checked' , false);
	$('#noDeliveryDay').prop('checked' , false);
	$('#unDeliverableDay').val('');
	$('#noDeliveryPeriod').prop('checked' , false);
	$('#start_date').val('');
	$('#end_date').val('');
}

function getDeliveryRoundInfo(){
	$('#deliveryRoundList').empty();
	$.get("/back/07_delivery/deliveryRound.jsp?company_no=" + $('#company').val(),
		function(resultJSON){						
			console.log(resultJSON);
			var roundList = resultJSON['list'];				
			$(roundList).each(function(idx, item){
				console.log(item);
				var roundTemplate = 
				'   <tr>  '  + 
				'   				<th>'+(idx+1)+'</th>  '  + 
				'   				<td>  '  + 
				'   					<select id="delviery_start_time'+item.round_id+'" name="time_start">                                                                                                                                  '  + 
				'   						<option value="0000">00:00</option>   '  + 
				'   						<option value="0100">01:00</option>   '  + 
				'   						<option value="0200">02:00</option>  '  + 
				'   						<option value="0300">03:00</option>  '  + 
				'   						<option value="0400">04:00</option>  '  + 
				'   						<option value="0500">05:00</option>  '  + 
				'   						<option value="0600">06:00</option>  '  + 
				'   						<option value="0700">07:00</option>  '  + 
				'   						<option value="0800">08:00</option>                                                                          '  + 
				'   						<option value="0900">09:00</option>  '  + 
				'   						<option value="1000">10:00</option>  '  + 
				'   						<option value="1100">11:00</option>  '  + 
				'   						<option value="1200">12:00</option>  '  + 
				'   						<option value="1300">13:00</option>  '  + 
				'   						<option value="1400">14:00</option>  '  + 
				'   						<option value="1500">15:00</option>  '  + 
				'   						<option value="1600">16:00</option>  '  + 
				'   						<option value="1700">17:00</option>  '  + 
				'   						<option value="1800">18:00</option>  '  + 
				'   						<option value="1900">19:00</option>  '  + 
				'   						<option value="2000">20:00</option>  '  + 
				'   						<option value="2100">21:00</option>  '  + 
				'   						<option value="2200">22:00</option>  '  + 
				'   						<option value="2300">23:00</option>  '  + 
				'   						<option value="2400">24:00</option>  '  + 
				'   					</select>  '  + 
				'   					&nbsp;-&nbsp;  '  + 
				'   					<select id="delviery_end_time'+item.round_id+'" name="time_end">  '  + 
				'   						<option value="0000">00:00</option>   '  + 
				'   						<option value="0100">01:00</option>   '  + 
				'   						<option value="0200">02:00</option>  '  + 
				'   						<option value="0300">03:00</option>  '  + 
				'   						<option value="0400">04:00</option>  '  + 
				'   						<option value="0500">05:00</option>  '  + 
				'   						<option value="0600">06:00</option>  '  + 
				'   						<option value="0700">07:00</option>  '  + 
				'   						<option value="0800">08:00</option>                                                                          '  + 
				'   						<option value="0900">09:00</option>  '  + 
				'   						<option value="1000">10:00</option>  '  + 
				'   						<option value="1100">11:00</option>  '  + 
				'   						<option value="1200">12:00</option>  '  + 
				'   						<option value="1300">13:00</option>  '  + 
				'   						<option value="1400">14:00</option>  '  + 
				'   						<option value="1500">15:00</option>  '  + 
				'   						<option value="1600">16:00</option>  '  + 
				'   						<option value="1700">17:00</option>  '  + 
				'   						<option value="1800">18:00</option>  '  + 
				'   						<option value="1900">19:00</option>  '  + 
				'   						<option value="2000">20:00</option>  '  + 
				'   						<option value="2100">21:00</option>  '  + 
				'   						<option value="2200">22:00</option>  '  + 
				'   						<option value="2300">23:00</option>  '  + 
				'   						<option value="2400">24:00</option>  '  + 
				'   					</select>  '  + 
				'   				</td>  '  + 
				'   				<td>  '  + 
				'   					자동마감&nbsp;<input type="text" id="order_closing_cnt'+item.round_id+'" class="del_num_tea" value="'+item.order_closing_cnt+'">건  '  + 
				'   				</td>  '  + 
				'   				<td>  '  + 
				'   					<button class="roundDelBtn" id="roundDelBtn'+item.round_id+'" data-round-id="'+item.round_id+'">삭제</button>  '  + 
				'   					<button class="roundUpdateBtn" id="roundUpdateBtn'+item.round_id+'" data-round-id="'+item.round_id+'">수정</button>  '  + 
				'  				</td>;  ' ; 

				$('#deliveryRoundList').append(roundTemplate);				
				$('#delviery_start_time'+ item.round_id).val(item.delivery_start_time);
				$('#delviery_end_time'+ item.round_id).val(item.delivery_end_time);

//				$(`#roundDelBtn${item.round_id}`).on('click', function(){
				$('#roundDelBtn'+item.round_id).on('click', function(){
					deleteDeliveryRound($(this).data('roundId'));
				});

//				$(`#roundUpdateBtn${item.round_id}`).on('click', function(){
				$('#roundUpdateBtn'+item.round_id).on('click', function(){
					updateDeliveryRound($(this).data('roundId'));
				});				
			});			
		}	
	);

	//추가건 
	var newRoundTemplate = 
			
	'   <tr>  '  + 
	'         <th>신규추가</th>  '  + 
	'         <td>  '  + 
	'             <select id="delviery_start_time_new" name="time_start">                                                                                                                                  '  + 
	'                 <option value="0000">00:00</option>   '  + 
	'                 <option value="0100">01:00</option>   '  + 
	'                 <option value="0200">02:00</option>  '  + 
	'                 <option value="0300">03:00</option>  '  + 
	'                 <option value="0400">04:00</option>  '  + 
	'                 <option value="0500">05:00</option>  '  + 
	'                 <option value="0600">06:00</option>  '  + 
	'                 <option value="0700">07:00</option>  '  + 
	'                 <option value="0800">08:00</option>                                                                          '  + 
	'                 <option value="0900">09:00</option>  '  + 
	'                 <option value="1000">10:00</option>  '  + 
	'                 <option value="1100">11:00</option>  '  + 
	'                 <option value="1200">12:00</option>  '  + 
	'                 <option value="1300">13:00</option>  '  + 
	'                 <option value="1400">14:00</option>  '  + 
	'                 <option value="1500">15:00</option>  '  + 
	'                 <option value="1600">16:00</option>  '  + 
	'                 <option value="1700">17:00</option>  '  + 
	'                 <option value="1800">18:00</option>  '  + 
	'                 <option value="1900">19:00</option>  '  + 
	'                 <option value="2000">20:00</option>  '  + 
	'                 <option value="2100">21:00</option>  '  + 
	'                 <option value="2200">22:00</option>  '  + 
	'                 <option value="2300">23:00</option>  '  + 
	'                 <option value="2400">24:00</option>  '  + 
	'             </select>  '  + 
	'             &nbsp;-&nbsp;  '  + 
	'             <select id="delviery_end_time_new" name="time_end">                                                                  '  + 
	'                 <option value="0000">00:00</option>   '  + 
	'                 <option value="0100">01:00</option>   '  + 
	'                 <option value="0200">02:00</option>  '  + 
	'                 <option value="0300">03:00</option>  '  + 
	'                 <option value="0400">04:00</option>  '  + 
	'                 <option value="0500">05:00</option>  '  + 
	'                 <option value="0600">06:00</option>  '  + 
	'                 <option value="0700">07:00</option>  '  + 
	'                 <option value="0800">08:00</option>                                                                          '  + 
	'                 <option value="0900">09:00</option>  '  + 
	'                 <option value="1000">10:00</option>  '  + 
	'                 <option value="1100">11:00</option>  '  + 
	'                 <option value="1200">12:00</option>  '  + 
	'                 <option value="1300">13:00</option>  '  + 
	'                 <option value="1400">14:00</option>  '  + 
	'                 <option value="1500">15:00</option>  '  + 
	'                 <option value="1600">16:00</option>  '  + 
	'                 <option value="1700">17:00</option>  '  + 
	'                 <option value="1800">18:00</option>  '  + 
	'                 <option value="1900">19:00</option>  '  + 
	'                 <option value="2000">20:00</option>  '  + 
	'                 <option value="2100">21:00</option>  '  + 
	'                 <option value="2200">22:00</option>  '  + 
	'                 <option value="2300">23:00</option>  '  + 
	'                 <option value="2400">24:00</option>  '  + 
	'             </select>  '  + 
	'         </td>  '  + 
	'         <td>  '  + 
	'             자동마감&nbsp;<input type="text" id="order_closing_cnt_new" class="del_num_tea">&nbsp;건  '  + 
	'         </td>  '  + 
	'         <td>  '  + 
	'             <button id="deliveryAddBtn">추가등록</button>  '  + 
	'         </td>  '  + 
	'</tr>  ' ; 
		
	$('#deliveryRoundList').append(newRoundTemplate	);
	$('#deliveryAddBtn').on('click', function(){
		createDeliveryRound();
	});	
}


function createDeliveryRound(){

	var formData = {		
		company_no : $('#company').val(),		
		delviery_start_time : $('#delviery_start_time_new').val(),
		delviery_end_time : $('#delviery_end_time_new').val(),
		order_closing_cnt : $('#order_closing_cnt_new').val()
	};

	if(!formData.delviery_start_time){
		alert('배송 시작시각을 선택해주세요.');
		$('#delviery_start_time_new').focus();
		return;
	}

	if(!formData.delviery_end_time){
		alert('배송 종료시각을 선택해주세요.');
		$('#delviery_end_time_new').focus();
		return;
	}

	if(formData.delviery_start_time > formData.delviery_end_time){
		alert('배송 시작 시각이 종료 시각 이후입니다.');
		$('#delviery_start_time_new').focus();
		return;
	}
	
	
	$.post(
		"/back/07_delivery/deliveryRoundCreate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert("저장되지 않았습니다. 정보를 다시 한 번 확인하여 주시기 바랍니다.");
			}
			
			if(resultJSON['insert'] > 0){
				alert('저장되었습니다.');
				getDeliveryRoundInfo();
			}
		}
	)
	
}

function updateDeliveryRound(round_id){

	var formData = {		
		company_no : $('#company').val(),	
		round_id : round_id,	
		delviery_start_time : $('#delviery_start_time'+round_id).val(),
		delviery_end_time : $('#delviery_end_time'+round_id).val(),
		order_closing_cnt : $('#order_closing_cnt'+round_id).val()
	};

	if(!formData.delviery_start_time){
		alert('배송 시작시각을 선택해주세요.');
		$('#delviery_start_time_new').focus();
		return;
	}

	if(!formData.delviery_end_time){
		alert('배송 종료시각을 선택해주세요.');
		$('#delviery_end_time_new').focus();
		return;
	}

	if(formData.delviery_start_time > formData.delviery_end_time){
		alert('배송 시작 시각이 종료 시각 이후입니다.');
		$('#delviery_start_time_new').focus();
		return;
	}
	
	if(!confirm('배송회차 정보를 수정하시겠습니까?')) return;
	
	$.post(
		"/back/07_delivery/deliveryRoundUpdate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert("저장되지 않았습니다. 정보를 다시 한 번 확인하여 주시기 바랍니다.");
			}
			
			if(resultJSON['update'] > 0){
				alert('저장되었습니다.');
				getDeliveryRoundInfo();
			}
		}
	)
	
}

function deleteDeliveryRound(round_id){
	if(!confirm('배송회차 정보를 삭제하시겠습니까?')) return;
	var formData = {		
		company_no : $('#company').val(),
		round_id : round_id
	};
	
	$.post(
		"/back/07_delivery/deliveryRoundDelete.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert("저장되지 않았습니다. 정보를 다시 한 번 확인하여 주시기 바랍니다.");
			}
			
			if(resultJSON['delete'] > 0){
				alert('삭제되었습니다.');
				getDeliveryRoundInfo();
			}
		}
	)
	
}

/* 주소 검색 */

function openZipSearch() {
	new daum.Postcode({
		oncomplete: function(data) {
			console.log(data);
			//$('#sample4_roadAddress').val(data.bname); // 우편번호 (5자리)
			addDong(data.bname);
		}
	}).open();
}

function addDong(dongName){	
	var isExists = false;	
	$('#dongList').children().each(function(idx, el){
		if(el.innerText == dongName){
			alert('이미 추가된 동입니다.');
			isExists = true;
			return;
		}		
	}) ;
	if(isExists) return;

	$('#dongList').append('<div data-dong="'+dongName+'" class="selected_option">'+ dongName +'</div>');
	$('.selected_option').on('click', function(){
		$(this).remove();
	});
}
