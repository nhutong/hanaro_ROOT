//인증번호 발송 api
$("#authcode_btn").on("click", function(){
	var email = $("#email").val();
	if(email == ""){
		alert("메일주소를 입력해주세요.");
		return;
	}
	$.post("/back/01_sign/authEmailSend.jsp",
		{ email: email }
	,function(result){
			var jsonResult = JSON.parse(result);
		if(jsonResult[0].result == "success"){
			alert("메일이 발송 되었습니다. \n인증번호를 확인하여 아래에 입력해주세요.");
			return;
		}else if(jsonResult[0].result == "no_user"){
			alert("입력하신 메일로 가입된 회원이 없습니다");
			return false;
		}else if(jsonResult[0].result == "limit"){
			alert("잠시후 다시 시도해주시기 바랍니다");	
		}else{
			alert("전송 실패");
		}
	})
});

//인증확인 api
$("#authcode_btn2").on("click", function(){
	var auth_code = $("#auth_code").val();
	var email = $("#email").val();
	if(auth_code == ""){
		alert("인증번호를 입력해주세요");
		return;
	}
	$.post("/back/01_sign/authEmailCheck.jsp",{
		email: email,
		authcode: auth_code
	},function(result){
		var jsonResult = JSON.parse(result);
		if(jsonResult[0].result == "success"){
			alert("인증 되었습니다");
			sessionStorage.setItem("email", email);
			pw2();
		}else{
			alert("인증 실패");
		}
	})
});

$("#cancel_btn").on("click", function(){
	window.history.back();
});

function pw2(){
	location.href = '/sign/find_pw2.html';
}
