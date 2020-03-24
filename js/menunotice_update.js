$(function () {

	nt_no = getParameterByName('nt_no');   // 메뉴번호

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	noticePopup(nt_no);
});

function noticePopup(rcvNtNo){
	
		$.ajax({
			url:'/back/04_home/noticeDetail.jsp?random=' + (Math.random()*99999),
			data : {nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList

			for(var i in jsonResult_notice){

				$("#noticeCreateTitle").val(jsonResult_notice[0].nt_title);
				$("#noticeCreate").val(jsonResult_notice[0].nt_content);

			}
	})

}

// 공지사항 리스트를 불러온다.
function noticeUpdate(){

	var noticeCreateTitle = encodeURIComponent($("#noticeCreateTitle").val());
	var brVal = $("#noticeCreate").val();
	var brValResult = brVal.replace(/\n/g, "<br/>");
	var noticeCreate = encodeURIComponent(brValResult);

	if ( noticeCreateTitle == null || chrLen(noticeCreateTitle) == 0)
	{
		alert("제목을 입력하시기 바랍니다.");
		return false;
	}
	
	if ( noticeCreate == null || chrLen(noticeCreate) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}	

		$.ajax({
			url:'/back/04_home/noticeUpdate.jsp?random=' + (Math.random()*99999),
			data : {rcvTitle: noticeCreateTitle, rcvContent: noticeCreate, nt_no: nt_no, userNo: getCookie("userNo") },
			method : 'GET' 
		}).done(function(result){
			if(result == "NoN"){
				console.log(result);	
			}else{
				console.log(result);
				opener.location.reload(true);
				window.close();		
			}
		})

}