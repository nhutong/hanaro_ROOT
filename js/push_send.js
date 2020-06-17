
$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111

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
			$("#pushInterval").prop('disabled', true);
		}else{
			$("#pushSendFromDate").prop('disabled', false);
			$("#pushSendToDate").prop('disabled', false);

			$("#pushSendHr").prop('disabled', false);
			$("#pushSendMin").prop('disabled', false);
			$("#pushInterval").prop('disabled', false);	
		}
	});

	$("#pushTarget").on("change",function(){
		if ($("#pushTarget").val() == "대상등록" ){		
			$(".push_target_import_cont").show();
		}else{
			$(".push_target_import_cont").hide();			
		}			
	});		
	

});

/*파일 업로더*/
var enterUpload = document.getElementById('uploadFile');
enterUpload.addEventListener('change', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
//		$("#excel_path").val(result);
		$("#push_img_path").attr("src", "/upload/"+result.trim());
		alert("업로드 완료");
	});
});

// 푸쉬입력
$("#pushSendBtn").on("click",function(e){
	e.preventDefault();

	var pushTopTxt = $("#pushTopTxt").val();
	var vm_cp_select = $("#sort_select").val();
	var event_no = $("#event_no").val();
	var pushSendHr = $("#pushSendHr").val();
	var pushSendMin = $("#pushSendMin").val();
	var pm_img_path = $("#push_img_path").attr("src");

	var pushSendFromDate = $("#pushSendFromDate").val();
	var pushSendToDate = $("#pushSendToDate").val();
	var pushInterval = $("#pushInterval").val();

	var pushTarget   = $("#pushTarget").val();
	var pushType   =  $("#pushType").val();	

	var excel_path = $("#excel_path").val();	

	var pm_no = "";

	if ( pushTopTxt == null || chrLen(pushTopTxt) == 0)
	{
		alert("PUSH 내용을 입력하시기 바랍니다.");
		return false;
	}

	if ($("#pushType").val() == "realtime" ){
	}else{		
		if ( pushType == 'reserve' && ( pushSendFromDate == null || chrLen(pushSendFromDate) == 0 ) ){
			alert("전송시작일자를 입력하시기 바랍니다.");
			return false;
		}	
	
		if ( pushType == 'reserve' && ( pushSendToDate == null || chrLen(pushSendToDate) == 0 ) ){
			alert("전송종료일자를 입력하시기 바랍니다.");
			return false;
		}			
	}

	if ($("#pushTarget").val() == "대상등록" ){	
		if ( excel_path == null || chrLen(excel_path) == 0){
			alert("푸시대상 엑셀파일을 업로드하시기 바랍니다.");
			return false;
		}		
	}else{
	}	

	$.ajax({
		url:'/back/10_push/postCreateInsert.jsp?random=' + (Math.random()*99999),
		data : {pm_img_path: pm_img_path, pushTopTxt: pushTopTxt, vm_cp_no: vm_cp_select, reg_no: getCookie("userNo"), event_no: event_no, pushSendHr:pushSendHr, pushSendMin:pushSendMin, pushSendFromDate: pushSendFromDate, pushSendToDate: pushSendToDate, pushInterval: pushInterval, pushTarget: pushTarget, pushType: pushType},
		method : 'GET' 
	}).done(function(result){
		var resultSplit1 = result.trim().split(",");
		//console.log("noticeList=========================================");
		if(resultSplit1[0] == ('NoN') || resultSplit1[0] == 'exception error' || resultSplit1[0] == 'empty'){
			console.log(resultSplit1);
		}else{
			//console.log("============= notice callback ========================");
			//console.log(resultSplit);
			pm_no = resultSplit1[1];
			if( pm_no == "" || pm_no == null || pm_no <= "0" ){
				alert("[오류]푸시 저장 후 푸시번호가 생성되지 않았습니다.");
			}else{
				$.ajax({
					url:'/back/10_push/pushTargetExcelImport.jsp?random=' + (Math.random()*99999),
					data : {excel_path: excel_path, pm_no: pm_no, overwrite: "N"},
					method : 'GET' 
				}).done(function(result){
					var resultSplit = result.trim().split(",");
					//console.log("leafletConProdInsert=========================================");
					console.log(resultSplit);
					if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
						alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
					}else if(resultSplit[0] == 'no_pm'){
						alert(pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
					}else if(resultSplit[0] == 'pmt_no_dup'){
						if(confirm('푸시대상이 이미 등록되어 있습니다. 삭제 및 대체하시겠습니까?')) {
							$.ajax({
								url:'/back/10_push/pushTargetExcelImport.jsp?random=' + (Math.random()*99999),
								data : {excel_path: excel_path, pm_no: pm_no, overwrite: "Y"},
								method : 'GET' 
							}).done(function(result){
								var resultSplit = result.trim().split(",");
								if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
									alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
								}else if(resultSplit[0] == 'no_pm'){
									alert(pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
								}else if(resultSplit[0] == 'pmt_no_dup'){
									alert("푸시대상이 이미 등록되어 있습니다.");
								}else if(resultSplit[0] == 'no_no_exist'){
									alert("회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
								}else if(resultSplit[0] == 'no_not_number'){
									alert("회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
								}else{
									push_target_import_close();
									alert("삭제 및 등록이 완료되었습니다. 영향 받은 행:"+resultSplit[1]);
									prodList(1, targetCompanyNo);
									prodList_paging(1, targetCompanyNo);
								}
							});
						}else{
						}
					}else if(resultSplit[0] == 'no_no_exist'){
						alert("회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
					}else if(resultSplit[0] == 'no_not_number'){
						alert("회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
					}else{
						//console.log("============= notice callback ========================");
						//console.log(result);
						//alert("등록이 완료되었습니다.");
						alert("등록이 완료되었습니다(푸시대상 엑셀파일 영향 받은 행:"+resultSplit[1]+")");
						push();						
					}
				});	
			}			
		}
	});
});

/*엑셀파일 업로더*/
//var enterUpload = document.getElementById('push_excel_btn');
//enterUpload.addEventListener('click', function(evt){
var enterUpload = document.getElementById('excelUploadFile');
enterUpload.addEventListener('change', function(evt){	
	var inputFile = document.getElementById('excelUploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
		//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
		alert("업로드 완료");
	});
});

/*파일 업로더*/
// var enterUpload = document.getElementById('uploadFile');
// enterUpload.addEventListener('change', function(evt){
// 	var inputFile = document.getElementById('uploadFile');
// 	new Upload(inputFile, function(result){
// //		$("#excel_path").val(result);
// 		$("#push_img_path").attr("src", "/upload/"+result.trim());
// 		alert("업로드 완료");
// 	});
// });

// /*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
// $("#push_excel_new").on("click",function(){

// 	var excel_path = $("#excel_path").val();
// 	var pm_no = $("#push_message_no").val();

// 	if ( excel_path == null || chrLen(excel_path) == 0)
// 	{
// 		alert("파일을 업로드하시기 바랍니다.");
// 		return false;
// 	}

// 	if ( pm_no == null || chrLen(pm_no) == 0)
// 	{
// 		alert("푸시번호를 알 수 없습니다.");
// 		return false;
// 	}	

// 	$.ajax({
//         url:'/back/10_push/pushTargetExcelImport.jsp?random=' + (Math.random()*99999),
// 		data : {excel_path: excel_path, pm_no: pm_no, overwrite: "N"},
//         method : 'GET' 
//     }).done(function(result){
// 		var resultSplit = result.trim().split(",");
// 		//console.log("leafletConProdInsert=========================================");
// 		console.log(resultSplit);
// 		if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
// 			alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
//         }else if(resultSplit[0] == 'no_pm'){
// 			alert(pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
//         }else if(resultSplit[0] == 'pmt_no_dup'){
// 			if(confirm('푸시대상이 이미 등록되어 있습니다. 삭제 및 대체하시겠습니까?')) {
// 				$.ajax({
// 					url:'/back/10_push/pushTargetExcelImport.jsp?random=' + (Math.random()*99999),
// 					data : {excel_path: excel_path, pm_no: pm_no, overwrite: "Y"},
// 					method : 'GET' 
// 				}).done(function(result){
// 					var resultSplit = result.trim().split(",");
// 					if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
// 						alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
// 					}else if(resultSplit[0] == 'no_pm'){
// 						alert(pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
// 					}else if(resultSplit[0] == 'pmt_no_dup'){
// 						alert("푸시대상이 이미 등록되어 있습니다.");
// 					}else if(resultSplit[0] == 'no_no_exist'){
// 						alert("회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
// 					}else if(resultSplit[0] == 'no_not_number'){
// 						alert("회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
// 					}else{
// 						push_target_import_close();
// 						alert("삭제 및 등록이 완료되었습니다. 영향 받은 행:"+resultSplit[1]);
// 						prodList(1, targetCompanyNo);
// 						prodList_paging(1, targetCompanyNo);
// 					}
// 				});
// 			}else{
// 			}
// 		}else if(resultSplit[0] == 'no_no_exist'){
// 			alert("회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
// 		}else if(resultSplit[0] == 'no_not_number'){
// 			alert("회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
// 		}else{
//             //console.log("============= notice callback ========================");
// 			//console.log(result);
// 			push_target_import_close();
//             alert("등록이 완료되었습니다. 영향 받은 행:"+resultSplit[1]);
// 			prodList(1, targetCompanyNo);
// 			prodList_paging(1, targetCompanyNo);
//         }
//     });
// });

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

//// 우상단 판매장을 리스팅한다.
//function getEventList(rcvCompanyNo, rcvTargetCompanyNo) {
//
//    $.ajax({
//        url:'/back/10_push/eventList.jsp?random=' + (Math.random()*99999),
//		data : {userCompanyNo: rcvCompanyNo},
//        method : 'GET' 
//    }).done(function(result){
//
//        console.log("noticeList=========================================");
//        if(result == ('NoN') || result == 'list error' || result == 'empty'){
//            console.log(result);
//        }else{
//			$("#event_no").html("");
//            console.log("============= notice callback ========================");
//            console.log(result);
//            var data = JSON.parse(result);
//			
//            data['CompanyList'].forEach(function(item, index){
//				if (rcvTargetCompanyNo == decodeURIComponent(item['company']))
//				{
//					$("#event_no").append('<option value="'+decodeURIComponent(item['event_no']).replace(/\+/g,' ')+'" selected>'+decodeURIComponent(item['event_title']).replace(/\+/g,' ')+'</option>');
//				}else{
//					$("#event_no").append('<option value="'+decodeURIComponent(item['event_no']).replace(/\+/g,' ')+'">'+decodeURIComponent(item['event_title']).replace(/\+/g,' ')+'</option>');
//				}
//          });
//
//        }
//    });
//}