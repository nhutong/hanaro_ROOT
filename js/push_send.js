$(function () {

	pm_no = getParameterByName('pm_no');

	if( pm_no ==  "" ){
		pm_no = "0";
	}else{
	}

	getLeft();

	getLeftMenu('push');
	$("#nh_push_push").addClass("active");
	
	getHeader();
	$(".nav_push").addClass("active");

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	var targetCompanyNo = "";
	if (onSelectCompanyNo != "")
	{
		if (onSelectCompanyNo != CuserCompanyNo)
		{
			targetCompanyNo = onSelectCompanyNo;
		}else{
			targetCompanyNo = CuserCompanyNo;
		}
	}else{
		targetCompanyNo = CuserCompanyNo;
	}

	/* 최초 로그인한 유저번호로 바인딩한다. */
	getManagerList(CuserCompanyNo, targetCompanyNo);
	//getEventList(CuserCompanyNo, targetCompanyNo);

	getPushInfo(pm_no);	

	$('#layer_popup_link_open button').on('click',function(){
		getLinkList();
		$('#layer_popup_link_wrap').show();
	});	

	$('#layer_popup_link_close button').on('click',function(){
		$('#layer_popup_link_wrap').hide();
	});	

	$(document).on('click','.linkClick',function() {
		$('#event_no').val( $(this).text() );		
		$('#layer_popup_link_wrap').hide();
	});	
	
	$("#pushType").on("change",function(){
		if ($("#pushType").val() == "realtime" ){
			$("#pushSendFromDate").prop('disabled', true);
			$("#pushSendToDate").prop('disabled', true);

			$("#pushSendHr").prop('disabled', true);
			$("#pushSendMin").prop('disabled', true);
			// $("#pushInterval").prop('disabled', true);
			var arr = ["월", "화", "수", "목", "금", "토", "일"];
			arr.forEach(function(item) {
				$("#" + whatDay(item)).prop("disabled", true);
			});
			checkDay();
			$(".checkBoxBtn").prop('disabled', true);
		}else{
			$("#pushSendFromDate").prop('disabled', false);
			$("#pushSendToDate").prop('disabled', false);

			$("#pushSendHr").prop('disabled', false);
			$("#pushSendMin").prop('disabled', false);
			// $("#pushInterval").prop('disabled', false);
			var arr = ["월", "화", "수", "목", "금", "토", "일"];
			arr.forEach(function(item) {
				$("#" + whatDay(item)).prop("disabled", false);
			});
			$(".checkBoxBtn").prop('disabled', false);
		}
	});

	$("#pushTarget").on("change",function(){
		if ($("#pushTarget").val() == "고객전체" ){		
			$("#push_target_tel").prop('disabled', true);	
			$("#excelUploadFile").prop('disabled', true);	
		}else{
			$("#push_target_tel").prop('disabled', false);	
			$("#excelUploadFile").prop('disabled', false);	
		}			
	});		
	

});

function getPushInfo(rcv_pm_no){

	if ( rcv_pm_no == "0" || rcv_pm_no == "" ){ //신규등록
		$("#pushNo").val('0');
		$("#pushDelTr").hide();		
		$("#pushStatusTr").hide();					
		$("#pmt_no_cnt").val("0");	
		$("#pmt_no_cnt_title").text("0명");	
		console.log("excelpath("+$("#excel_path").val()+")");		   
	}else{
		$("#pushNo").val(rcv_pm_no);
		$("#pushDelTr").show();	
		$("#pushStatusTr").show();			
		$.get('/back/10_push/getPushInfo.jsp?pm_no='+rcv_pm_no,	
		function(result) {
			//console.log(result);
			var info = result.list[0];
			$("#pushTopTxt").val(info.ms_content);
			$("#sort_select").val(info.vm_cp_no);
			$("#event_no").val(info.event_no);
			$("#pushSendHr").val(info.pm_hour);
			$("#pushSendMin").val(info.pm_min);
			$("#push_img_path").attr("src",info.pm_img_path);
			$("#pushSendFromDate").val(info.pm_from_date);
			$("#pushSendToDate").val(info.pm_to_date);
			const arrayInterval = info.pm_interval.split(',');
			// $("#pushInterval").val(info.pm_interval);
			arrayInterval.forEach(function(item) {
				$("#" + whatDay(item)).prop("checked", true);
			});
			$("#pushTarget").val(info.pm_target);
			$("#pushType").val(info.pm_type);	
			$("#pushDel").val(info.del_fg);
			$("#excel_path").val(info.excel_path);	
			$("#pushStatus").val(info.pm_status);
	
			if ($("#pushType").val() == "realtime" ){
				$("#pushSendFromDate").prop('disabled', true);
				$("#pushSendToDate").prop('disabled', true);
	
				$("#pushSendHr").prop('disabled', true);
				$("#pushSendMin").prop('disabled', true);
				// $("#pushInterval").prop('disabled', true);
				var arr = ["월", "화", "수", "목", "금", "토", "일"];
				arr.forEach(function(item) {
					$("#" + whatDay(item)).prop("disabled", true);
				});
				checkDay();
				$(".checkBoxBtn").prop('disabled', true);
			}else{
				$("#pushSendFromDate").prop('disabled', false);
				$("#pushSendToDate").prop('disabled', false);
	
				$("#pushSendHr").prop('disabled', false);
				$("#pushSendMin").prop('disabled', false);
				// $("#pushInterval").prop('disabled', false);	
				var arr = ["월", "화", "수", "목", "금", "토", "일"];
				arr.forEach(function(item) {
					$("#" + whatDay(item)).prop("disabled", false);
				});
				$(".checkBoxBtn").prop('disabled', false);
			}
		
			if ($("#pushTarget").val() == "고객전체" ){		
				$("#push_target_tel").prop('disabled', true);	
				$("#excelUploadFile").prop('disabled', true);	
			}else{
				$("#push_target_tel").prop('disabled', false);	
				$("#excelUploadFile").prop('disabled', false);	
			}	
	
			var total = result.total;
			$("#pmt_no_cnt").val(total);	
			$("#pmt_no_cnt_title").text(total+"명");	        

			var today = new Date();
			var year = today.getFullYear();
			var month = leadingZeros(today.getMonth()+1,2);
			var day = leadingZeros(today.getDate(),2);
		
			$("#pushSendFromDate").val(year+'-'+month+'-'+day);
			$("#pushSendToDate").val(year+'-'+month+'-'+day);	
			
			// console.log("excelpath("+$("#excel_path").val()+")");			
					
		});		

	}
}

/*이미지 파일 업로더 */
var enterUpload = document.getElementById('uploadFile');
enterUpload.addEventListener('change', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
		// $("#excel_path").val(result);
		$("#push_img_path").attr("src", "/upload/"+result.trim());
		// alert("업로드 완료");
	});
});

//푸시 타깃 저장 - 엑셀파일 업로더
//var enterUpload = document.getElementById('push_excel_btn');
//enterUpload.addEventListener('click', function(evt){
var enterUpload = document.getElementById('excelUploadFile');
enterUpload.addEventListener('change', function(evt){	
	var inputFile = document.getElementById('excelUploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
		var pushTarget = $('#pushTarget').val();
		var pm_no = $("#pushNo").val();		
		var excel_path = $("#excel_path").val();
		$("#push_target_tel").val('');				
		//if ( pushTarget == "대상등록" ){		
			// if( pm_no == "0" || pm_no == ""){
			// 	alert("엑셀파일이 로드되었습니다. 저장버튼을 눌러주세요");
			// }else{
			// 	var result = push_target_excel_import();
			// 	console.log(result);
			// 	// if( push_target_excel_import() ){
			// 	// 	console.log("bbbbbbb");					
			// 	// 	getPushInfo(pm_no);
			// 	// }				
			// }			
		//}		
	});
});

//푸시 타깃 저장
function push_target_excel_import(){
	var pm_no = $("#pushNo").val();
	var pushTarget = $('#pushTarget').val();
	var excel_path = $("#excel_path").val();
	const extension = excel_path.split(".")[1];
	const baseUrl = (extension == "xls") ? "pushTargetXlsImport.jsp" : (extension == "xlsx") ? "pushTargetXlsxImport.jsp" : "null";

	if ( pushTarget == "대상등록" ){
		$.ajax({
			url:'/back/10_push/'+baseUrl+'?random=' + (Math.random()*99999),
			data : {excel_path: excel_path, pm_no: pm_no, overwrite: "Y"},
			method : 'GET' 
		}).done(function(result){
			var resultSplit = result.trim().split(",");
			if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
				alert("엑셀양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
			}else if(resultSplit[0] == 'no_pm'){
				alert("엑셀등록 중 "+ pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
			}else if(resultSplit[0] == 'pmt_no_dup'){
				alert("엑셀등록 중 푸시대상이 이미 등록되어 있습니다.");
			}else if(resultSplit[0] == 'no_no_exist'){
				alert("엑셀등록 중 회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
			}else if(resultSplit[0] == 'no_not_number'){
				alert("엑셀등록 중 회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
			}else{
				alert("엑셀 등록이 완료되었습니다(등록 "+resultSplit[1]+"건, 삭제 "+resultSplit[2]+"건)");
				getPushInfo(pm_no);
			}
		});						
	}else{
		alert("전송대상이 고객전체일 경우 대상등록이 불필요 합니다.");
	}	
}

//푸시 타깃 저장
function push_target_tel_import(){
	var pm_no = $("#pushNo").val();
	var pushTarget = $('#pushTarget').val();
	var push_target_tel = $("#push_target_tel").val();

	if ( pushTarget == "대상등록" ){
		$.ajax({
			url:'/back/10_push/pushTargetImport.jsp?random=' + (Math.random()*99999),
			data : {pm_no: pm_no, push_target_tel: push_target_tel},
			method : 'GET' 
		}).done(function(result){
			var resultSplit = result.trim().split(",");
			if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
				alert("전화번호 등록오류!"+resultSplit[1]);
			}else{
				alert("전화번호 등록이 완료되었습니다(등록 "+resultSplit[1]+"건, 삭제 "+resultSplit[2]+"건)");
				getPushInfo(pm_no);
			}
		});						
	}else{
		alert("전송대상이 고객전체일 경우 대상등록이 불필요 합니다.");
	}		
}

// 푸쉬타깃저장
$("#push_target_tel").on("change", function(e) {
	e.preventDefault();
	var pushTarget = $('#pushTarget').val();
	var pm_no = $('#pushNo').val();		
	$("#excelUploadFile").val('');
	$("#excel_path").val('');		

	//if (e.keyCode == 13) {		
		// if ( pushTarget == "대상등록" ){		
		// 	if( pm_no == "0" || pm_no == ""){
		// 		// alert("신규등록의 경우 타깃 등록 전 저장버튼을 눌러주세요");
		// 	}else{
		// 		if( push_target_tel_import() == true ){
		// 			getPushInfo(pm_no);
		// 		}else{
		// 			console.log("else");
		// 		}
		// 	}			
		// }
	//}
});

// 즉시예약전송
$("#pushSendBtn").on("click",function(e){
	e.preventDefault();	
	var pushArr = ["월", "화", "수", "목", "금", "토", "일"];
	var totalPushInterval = "";
	pushArr.forEach(function(item, idx) {
		if ($("#" + whatDay(item)).prop("checked")) {
			if (idx == 0) {
				totalPushInterval += item;
			} else {
				totalPushInterval += "," + item;
			}
		}
	});
	var formData = {
		pm_no : $("#pushNo").val(),
		pushTopTxt : $("#pushTopTxt").val(),
		vm_cp_no : $('#sort_select').val(),
		event_no : $('#event_no').val(),
		reg_no : getCookie("userNo"),
		pushSendHr : $('#pushSendHr').val(),
		pushSendMin : $('#pushSendMin').val(),
		pm_img_path : $("#push_img_path").attr("src"),
		pushSendFromDate : $('#pushSendFromDate').val(),
		pushSendToDate : $('#pushSendToDate').val(),
		// pushInterval : $('#pushInterval').val(),
		pushInterval: totalPushInterval,
		pushTarget : $('#pushTarget').val(),
		pushType : $('#pushType').val(),
		pushDel : $('#pushDel').val()
	} ;
	console.log(formData);

	if ( formData.pushTopTxt == null || chrLen(formData.pushTopTxt) == 0){
		alert("PUSH 내용을 입력하시기 바랍니다.");
		return false;
	}

	if ( formData.pushType == "realtime" ){
	}else{		
		if ( formData.pushType == 'reserve' && ( formData.pushSendFromDate == null || chrLen(formData.pushSendFromDate) == 0 ) ){
			alert("전송시작일자를 입력하시기 바랍니다.");
			return false;
		}	
	
		if ( formData.pushType == 'reserve' && ( formData.pushSendToDate == null || chrLen(formData.pushSendToDate) == 0 ) ){
			alert("전송종료일자를 입력하시기 바랍니다.");
			return false;
		}			
	}

	if ( formData.pushDel == 'Y' ){
		alert("해당 메시지는 삭제되었습니다.");
		return false;		
	}	

	if ( pushTarget == "대상등록" ){		
		if( formData.pmt_no_cnt <= "0"){
			alert("[오류]푸시대상이 등록되지 않았습니다.");
			return false;
		}
	}

	if( $('#pushStatus').val() == '저장' ){	
	}else{
		alert("[오류]저장 후 전송하여 주세요!");
		return false;
	}

	if ($("#pushType").val() == "realtime" ){	
		var pm_no = $("#pushNo").val();	
		$.ajax({
			url:'https://172.16.9.21//PushSms/back-end/pushRealtime.php?random=' + (Math.random()*99999), 
			data : {pm_no: pm_no},
			method : 'GET' 
		}).done(function(result){
			// console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){
				console.log(result);
				alert("푸시 즉시전송 중 에러가 발생하였습니다.");					
			}else{
				//console.log("============= notice callback ========================");
				console.log(result);
				alert("푸시 즉시전송이 완료되었습니다");
				getPushInfo(formData.pm_no);
			}
		});	
	}else{

		var formData = {
			pm_no : $("#pushNo").val(),
			reg_no : getCookie("userNo")
		} ;

		$.post( '/back/10_push/pushReserve.jsp',
		formData, 			
		function(resultJSON){
			if(resultJSON['update'] > 0){
				alert('푸시 전송예약이 완료되었습니다.');
				getPushInfo(formData.pm_no);
			}else {
				console.log(resultJSON['error']);
				alert("푸시 전송예약 중 에러가 발생하였습니다.");
			}
		});				
	}

		
});

// 푸쉬저장
$("#pushSaveBtn").on("click",function(e){
	e.preventDefault();
	var arrs = ["월", "화", "수", "목", "금", "토", "일"];
	var totalPushInterval = "";
	arrs.forEach(function(item, idx) {
		if ($("#" + whatDay(item)).prop("checked")) {
			if (idx == 0) {
				totalPushInterval += item;
			} else {
				totalPushInterval += "," + item;
			}
		}
	});
	var formData = {
		pm_no : $("#pushNo").val(),
		pushTopTxt : $("#pushTopTxt").val(),
		vm_cp_no : $('#sort_select').val(),
		event_no : $('#event_no').val(),
		reg_no : getCookie("userNo"),
		pushSendHr : $('#pushSendHr').val(),
		pushSendMin : $('#pushSendMin').val(),
		pm_img_path : $("#push_img_path").attr("src"),
		pushSendFromDate : $('#pushSendFromDate').val(),
		pushSendToDate : $('#pushSendToDate').val(),
		// pushInterval : $('#pushInterval').val(),
		pushInterval: totalPushInterval,
		pushTarget : $('#pushTarget').val(),
		pushType : $('#pushType').val(),
		pushDel : $('#pushDel').val(),
		pushStatus : '저장'
	} ;

	var excel_path = $('#excel_path').val();
	var push_target_tel = $('#push_target_tel').val();	

	if ( formData.pushTopTxt == null || chrLen(formData.pushTopTxt) == 0){
		alert("PUSH 내용을 입력하시기 바랍니다.");
		return false;
	}

	if ( formData.pushType == "realtime" ){
	}else{		
		if ( formData.pushType == 'reserve' && ( formData.pushSendFromDate == null || chrLen(formData.pushSendFromDate) == 0 ) ){
			alert("전송시작일자를 입력하시기 바랍니다.");
			return false;
		}	
	
		if ( formData.pushType == 'reserve' && ( formData.pushSendToDate == null || chrLen(formData.pushSendToDate) == 0 ) ){
			alert("전송종료일자를 입력하시기 바랍니다.");
			return false;
		}			
	}

	if ( formData.pushDel == 'Y' ){
		alert("해당 메시지는 삭제되었습니다.");
		return false;		
	}
	
	if( formData.pm_no == "0" || formData.pm_no == ""){
		$.ajax({
			url:'/back/10_push/postCreateInsert.jsp?random=' + (Math.random()*99999),
			data : formData,
			method : 'GET' 
		}).done(function(result){
			var resultSplit = result.trim().split(",");
			//console.log("noticeList=========================================");
			if(resultSplit[0] == ('NoN') || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
				console.log(resultSplit);
				alert("저장(신규등록) 오류!");
			}else{
				//console.log("============= notice callback ========================");
				//console.log(resultSplit);
				pm_no = resultSplit[1];
				$("#pushNo").val(resultSplit[1]);
				alert("저장(신규등록)이 완료되었습니다.");
				if ( push_target_tel != "" ){				
					if( push_target_tel_import() ){
						getPushInfo(pm_no);				
					}						
				}else if ( excel_path != "" ){
					if( push_target_excel_import() ){
						getPushInfo(pm_no);				
					}	
				}
				getPushInfo(pm_no);								
			}
		});	
	}else{
		$.post( '/back/10_push/pushUpdate.jsp',
		formData, 			
		function(resultJSON){
			if(resultJSON['update'] > 0){
				alert('저장이 완료되었습니다');
				if ( push_target_tel != "" ){									
					if( push_target_tel_import() ){
						getPushInfo(pm_no);				
					}						
				}else if ( excel_path != "" ){
					if( push_target_excel_import() ){
						getPushInfo(pm_no);				
					}	
				}
				getPushInfo(formData.pm_no);
			}else {
				console.log(resultJSON['error']);
				alert("저장 중 에러가 발생하였습니다.");
			}
		});		
	}
});

// 푸쉬삭제
$("#pushDelBtn").on("click",function(e){
	e.preventDefault();
	if(confirm("삭제하시겠습니까?") == true){
		var formData = {
			pm_no : $("#pushNo").val(),
			reg_no : getCookie("userNo"),
		} ;

		$.post( '/back/10_push/pushDelete.jsp',
		formData, 			
		function(resultJSON){
			if(resultJSON['update'] > 0){
				alert('삭제되었습니다.');
				//push();
				getPushInfo(formData.pm_no);
			}else {
				console.log(resultJSON['error']);
				alert("삭제 중 에러가 발생하였습니다.");
			}
		});	
	}
});



function getLinkList(){
	var companyNo = $("#sort_select").val();
	var formData = {
		companyNo: companyNo
	};
	//console.log(companyNo);
	$.get('/back/00_include/getLinkList.jsp',
		formData,
		function(result) {
			//console.log(result);
			var Linklist = result['list'];
			var text = '';	
			text +='    <tr>';
			text +='        <td>홈화면</td>' ;
			text +='        <td class="linkClick">home/main.html</td>' ;
			text +='    </tr>';			
			text +='    <tr>';
			text +='        <td>쿠폰</td>' ;
			text +='        <td class="linkClick">home/coupon.html</td>' ;
			text +='    </tr>';	
			text +='    <tr>';				
			text +='        <td>이벤트</td>' ;
			text +='        <td class="linkClick">home/event.html</td>' ;
			text +='    </tr>';
			text +='    <tr>';
			text +='        <td>공지사항</td>' ;
			text +='        <td class="linkClick">home/notice.html</td>' ;
			text +='    </tr>';								
			$(Linklist).each( function (idx, linkeach) {
				text +='    <tr>';
				text +='        <td>' + linkeach.select_name  + '</td>' ;
				text +='        <td class="linkClick">' + linkeach.select_value + '</td>' ;
				text +='    </tr>';
			});
			$("#layer_popup_link_list").empty();					
			$("#layer_popup_link_list").append(text);				
		});
}
function checkDay(c) {
	$("#cb0").prop("checked", false);
	$("#cb1").prop("checked", false);
	$("#cb2").prop("checked", false);
	$("#cb3").prop("checked", false);
	$("#cb4").prop("checked", false);
	$("#cb5").prop("checked", false);
	$("#cb6").prop("checked", false);
	if (c == 'A') {
		$("#cb0").prop("checked", true);
		$("#cb1").prop("checked", true);
		$("#cb2").prop("checked", true);
		$("#cb3").prop("checked", true);
		$("#cb4").prop("checked", true);
		$("#cb5").prop("checked", true);
		$("#cb6").prop("checked", true);
	} else if (c == 'D') {
		$("#cb0").prop("checked", true);
		$("#cb1").prop("checked", true);
		$("#cb2").prop("checked", true);
		$("#cb3").prop("checked", true);
		$("#cb4").prop("checked", true);
	} else if (c == 'E'){
		$("#cb5").prop("checked", true);
		$("#cb6").prop("checked", true);
	}
}

function whatDay(d) {
	let isID = "";
	switch (d){
      case "월" :
		  isID = 'cb0';
          break;
      case "화" :
		  isID = 'cb1';
          break;
      case "수" :
		  isID = 'cb2';
          break;
      case "목" :
		  isID = 'cb3';
            break;
      case "금" :
		  isID = 'cb4';
          break;
      case "토" :
		  isID = 'cb5';
		  break;
	  case "일" :
		  isID = 'cb6';
		  break;
      default :
		  isID = 'cb7';
	}
	return isID;
}