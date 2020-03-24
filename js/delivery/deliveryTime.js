$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	getHeader();
	$(".nav_delivery").addClass("active");

	getLeft();
	getLeftMenu('delivery');
	$("#nh_delivery_delivery_time").addClass("active");

	$('#company').on('change', function(){getDeliveryRoundInfo()});
	getCompanyList();	

});

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
	getDeliveryRoundInfo();
}

function numberWithCollons(x) {
    return x.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ":");
}

function getDeliveryRoundInfo(){
	$.get("/back/07_delivery/deliveryRound.jsp?company_no=" + $('#company').val(),
		function(resultJSON){						
			console.log(resultJSON);
			var roundList = resultJSON['list'];	
			$('#deliveryRoundList').empty();
			$(roundList).each(function(idx, item){
				console.log(item);
				var roundTemplate = 
				'   <tr>  '  + 
				'   	<th>'+(idx+1)+'</th>  '  + 
				'   	<td id="delviery_time'+item.round_id+'">'  +
						numberWithCollons(item.delivery_start_time) + ' - ' + numberWithCollons(item.delivery_end_time) +
				'   	</td>  '  + 
				'   	<td>  '  + 
				'		<select class="open_flag" name="open_flag" id="open_flag'+item.round_id+'">' + 
				'		    <option value="Y"> 오픈 </option>' +
				'		    <option value="N"> 마감 </option>' +
				'		</select>' + 
				'  		</td>  '  +				
				'   	<td id="order_closing_cnt'+item.round_id+'"> '+ item.order_closing_cnt + ' 건 </td>'  + 
				'   	<td>  '  + (item.order_cnt||0) + '</td>';

				$('#deliveryRoundList').append(roundTemplate);
				$('#open_flag'+item.round_id).val(item.open_flag);				
					
			});
			
			$('.open_flag').on('change', function(){
				var round_id = this.id.replace('open_flag', '');

				updateDeliveryRoundStatus(round_id, this.value);
			});
		}
	);
}

function updateDeliveryRoundStatus(round_id, open_flag){

	var formData = {		
		company_no : $('#company').val(),	
		round_id : round_id,	
		open_flag : open_flag		
	};
	
	if(!confirm('배송회차 오픈 상태를 수정하시겠습니까?')) return;
	
	$.post(
		"/back/07_delivery/deliveryRoundStatusUpdate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert(resultJSON.error[0]);
			}
			
			if(resultJSON['update'] > 0){
				alert('저장되었습니다.');
				getDeliveryRoundInfo();
			}
		}
	)
	
}
