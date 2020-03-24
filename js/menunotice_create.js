$(function () {

	/* 공통부분 시작======================================================================== */

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	/* 공통부분 종료======================================================================== */

});

// 공지사항 리스트를 불러온다.
function noticeCont(){

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
			url:'/back/04_home/noticeInsert.jsp?random=' + (Math.random()*99999),
			data : {rcvTitle: noticeCreateTitle, rcvContent: noticeCreate, vm_cp_no: getCookie("onSelectCompanyNo"), userNo: getCookie("userNo") },
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
