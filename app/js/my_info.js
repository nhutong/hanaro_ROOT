$(function(){
	
	var tel = localStorage.getItem("tel");
	myInfo(tel);
	/*2020-02-18 주석처리 한 부분 - 나영*/
	$("#infoSubmitBtn").css("background-color","#828282");
	$("#infoProChk").on("change",function(){
		if( $("#infoProChk").is(":checked") == true ){
			$("#infoSubmitBtn").css("background-color","#00b140");
		}else{
			$("#infoSubmitBtn").css("background-color","#828282");
		}	
	})
	/*2020-02-18 주석처리 한 부분 - 나영*/

	/*Push 버튼 클릭시 정보 바꾼다.*/
    $("#infoSubmitBtn").on("click",function(){
		
		var name = $("#myInfoName").val();
		var address1 = $("#myInfoAddress1").val();
		var address2 = $("#myInfoAddress2").val();
		/*2020-02-18 주석처리 한 부분 - 나영*/
		var infoChk = $("#infoProChk").is(":checked");
		/*2020-02-18 주석처리 한 부분 - 나영*/
		if ( name == null || chrLen(name) == 0)
		{
			alert("이름을 입력하시기 바랍니다.");
			return false;
		}

		if ( address1 == null || chrLen(address1) == 0)
		{
			alert("전체 주소를 입력하시기 바랍니다.");
			return false;
		}

		if ( address2 == null || chrLen(address2) == 0)
		{
			alert("전체 주소를 입력하시기 바랍니다.");
			return false;
		}
		/*2020-02-18 주석처리 한 부분 - 나영*/
		if ( infoChk == false)
		{
			alert("개인정보 제공에 동의해주세요.");
			return false;
		}
		/*2020-02-18 주석처리 한 부분 - 나영*/
		$.ajax({
			url:'/back/01_sign/myInfoUpdate.jsp?random=' + (Math.random()*99999), 
			data : {tel:tel, name: name, address1: address1, address2: address2},
			method : 'GET' 
		}).done(function(result){
			
			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("나의 정보를 수정하였습니다.")
				myInfo(tel);
			}
		});
    });

})

//나의 전화번호를 불러온다.
function myInfo(rcvTel){
//	$("#myInfoTel").empty();
//	$("#myInfoTel").append(rcvTel);
console.log("rcvTel:"+rcvTel);
	$.ajax({
        url:'/back/01_sign/myInfo.jsp?random=' + (Math.random()*99999), 
		data : {tel: rcvTel},
        method : 'GET' 
    }).done(function(result){		
		var resultSplit = result.trim().split(',');
		console.log(resultSplit);
		var jsonResult = JSON.parse(resultSplit[0]);
		var jsonResult_comp = jsonResult.CompanyList
		$("#myInfoTel").empty();
		$("#myInfoTel").append(decodeURIComponent(jsonResult_comp[0].member_no));
		$("#myInfoName").val(decodeURIComponent(jsonResult_comp[0].name));
		$("#myInfoAddress1").val(decodeURIComponent(jsonResult_comp[0].address1));
		$("#myInfoAddress2").val(decodeURIComponent(jsonResult_comp[0].address2));
	});
}