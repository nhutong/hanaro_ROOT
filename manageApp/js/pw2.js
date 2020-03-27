
$("#signup_btn").on("click", function(){
	var email = sessionStorage.getItem("email");
	if(!email){
		alert("이메일 인증을 먼저 받으세요!");
		location.href = '/sign/find_pw1.html';		
	}
	var password = $("#user_pw1").val();
	if($("#user_pw1").val() != $("#user_pw2").val()){
		alert("비밀번호가 서로 다릅니다");
		return;
	}

	if(password.length < 8){
		alert("비밀번호는 8자리 이상이어야 합니다.");
		return;
	}
	if(!chkPwd( $.trim($('#user_pw1').val()))){ 
		 alert('비밀번호는 영문,숫자를 혼합하여 8~20자 이내로 입력해주세요');    
		 $('#user_pw1').val('');
		 return false;
	}

	$.post("/back/01_sign/newPw.jsp",{
		email: email,
		password: SHA256(password)
	},function(result){
		var jsonResult = JSON.parse(result);
		if(jsonResult[0].result == "success"){
			alert("변경 되었습니다. 로그인 화면으로 이동합니다.");
			sessionStorage.removeItem("email");
			main();
		}else{
			alert("변경에 실패하였습니다. 다시 시도해주세요.");
		}
	})
});


function main(){
	location.href = '/';
}

//비밀번호 영문+숫자조합 체크
function chkPwd(str){

 var reg_pwd = /^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

 if(!reg_pwd.test(str)){

  return false;

 }

 return true;

}