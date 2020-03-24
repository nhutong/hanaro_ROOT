

$(function(){

	
	var tel = localStorage.getItem("tel");
	pushSetting(tel);
	
	//회원탈퇴버튼
	$("#memRe").click(function(){
		memberResign();
	});
	/*Push 버튼 클릭시 정보 바꾼다.*/
    $("#agreePushSwitch").on("click",function(){
		
		var pushValue;
	
		if( $("#agreePush").prop('checked') == true ){
			pushValue = "N";
			$("#agreePush").prop('checked',"false");
		}else{
			pushValue = "Y";
			$("#agreePush").prop('checked',"true");
		}

		$.ajax({
			url:'/back/04_home/setting_push.jsp?random=' + (Math.random()*99999), 
			data : {tel:tel, agree_push: pushValue},
			method : 'GET' 
		}).done(function(result){
			
			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				pushSetting(tel);
			}
		});
    });

	/*위치정보동의 버튼 클릭시 정보 바꾼다.*/
    $("#agreeLocationSwitch").on("click",function(){
		
		var locationValue;
	
		if( $("#agreeLocation").prop('checked') == true ){
			locationValue = "N";
			$("#agreeLocation").prop('checked',"false");
		}else{
			locationValue = "Y";
			$("#agreeLocation").prop('checked',"true");
		}

		$.ajax({
			url:'/back/04_home/setting_location.jsp?random=' + (Math.random()*99999), 
			data : {tel:tel, agree_location: locationValue},
			method : 'GET' 
		}).done(function(result){
			
			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				pushSetting(tel);
			}
		});
    });

})




//push Setting

function pushSetting(rcvTel){
		
//		$("#agreePush").prop('checked', false);
//		$("#agreeLocation").prop('checked', false);
		
	$.ajax({
        url:'/back/04_home/setting.jsp?random=' + (Math.random()*99999), 
		data : {tel:rcvTel},
        method : 'GET' 
    }).done(function(result){
		
		var jsonResult = JSON.parse(result);
//		console.log(jsonResult);
//console.log(jsonResult.CompanyList);
		var jsonResult_comp = jsonResult.CompanyList

		if( jsonResult_comp[0].agree_push == "N" ){
			$("#agreePush").prop('checked', false);
		}else{
			$("#agreePush").prop('checked', true);
		}

		if( jsonResult_comp[0].agree_location == "N" ){
			$("#agreeLocation").prop('checked', false);
		}else{
			$("#agreeLocation").prop('checked', true);
		}
	});
}

//탈퇴하기
function memberResign(){
	var result = confirm("모든 혜택( 쿠폰, 스탬프 )과 정보가 사라집니다 ( 1회성 쿠폰의 경우, 탈퇴 후 재가입하셔도 재발행되지 않습니다 ). 정말 탈퇴하시겠습니까?");
	if(result){
			alert("탈퇴처리 되었습니다. 앱이 종료됩니다.");
	}else{
		alert("취소하셨습니다.");
	}
}