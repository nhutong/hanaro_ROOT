
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
//	getEventList(CuserCompanyNo, targetCompanyNo);

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
	
	var pushTopTxt = $("#pushTopTxt").val();
	var vm_cp_select = $("#sort_select").val();
	var event_no = $("#event_no").val();
	var pushSendHr = $("#pushSendHr").val();
	var pushSendMin = $("#pushSendMin").val();
	var pm_img_path = $("#push_img_path").attr("src");

	if ( pushTopTxt == null || chrLen(pushTopTxt) == 0)
	{
		alert("PUSH 내용을 입력하시기 바랍니다.");
		return false;
	}

	e.preventDefault();
	if(confirm('등록하시겠습니까??')) {

		$.ajax({
			url:'/back/10_push/postCreateInsert.jsp?random=' + (Math.random()*99999),
			data : {pm_img_path: pm_img_path, pushTopTxt: pushTopTxt, vm_cp_no: vm_cp_select, reg_no: getCookie("userNo"), event_no: event_no, pushSendHr:pushSendHr, pushSendMin:pushSendMin},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("등록이 완료되었습니다.");
				push();
			}
		});

	} else {
		
	}
});

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