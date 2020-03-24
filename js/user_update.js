$(function(){
	
	getHeader();
		
	 var userName = getCookie('userName');
	 var userEmpNo = getCookie('userEmpNo');
	 var userEmail = getCookie('userEmail');
	 var afterStr = userEmail.split('@');
	 var usercellPhone = getCookie('usercellPhone');
	 var userRoleName = getCookie('userRoleName');
	 var userCompanyName = getCookie('userCompanyName');
	
	

	$("#user_numb").val(userEmpNo);
	$("#user_numb").attr('readonly','readonly');
	$("#user_email1").val(afterStr[0]);
	$("#user_email2").val(afterStr[1]);
	$("#user_name").val(userName);
	$("#user_name").attr('readonly','readonly');
	$("#user_hp").val(usercellPhone);
	$("#user_company").empty();
	$("#user_role").empty();
	$("#user_company").append(userCompanyName);
	$("#user_role").append(userRoleName);
	$("#user_company, #user_role").css("font-size","13px");
	$("#user_company, #user_role").css("color","#666");

})

//그냥 로그인 (브라우저 끄면 쿠키 삭제)
function setCookie2(cookie_name, value, days) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + days);
  // 설정 일수만큼 현재시간에 만료값으로 지정

  var cookie_value = escape(value) + ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
  document.cookie = cookie_name + '=' + cookie_value+"; path=/";
}

$("#cancel_btn").on("click", function(){
	history.back();
});

$("#user_company").on("change", function(){	    
    if(this.value == 0){	  
	  $("#user_role").val("ROLE1");
	   $("#user_role option[value=ROLE1]").attr("selected", "selected");
	   $("#user_role option[value=ROLE2]").attr("hidden", "hidden");	
	   $("#user_role option[value=ROLE3]").attr("hidden", "hidden");	
    } else {
      $("#user_role option[value=ROLE2]").attr("selected", "selected");	
	  $("#user_role option[value=ROLE1]").attr("hidden", "hidden");	
	  $("#user_role option[value=ROLE1]").attr("disabled", "disabled");	
	  $("#user_role option[value=ROLE2]").removeAttr("hidden", "hidden");	
	  $("#user_role option[value=ROLE3]").removeAttr("hidden", "hidden");	
    }


});

$("#signup_btn").on("click", function(){
	var user_numb = $("#user_numb").val();
	var user_email1 = $("#user_email1").val();
	var user_email2 = $("#user_email2").val();
	var user_pw1 = $("#user_pw1").val();
	var user_pw2 = $("#user_pw2").val();
	var user_name = $("#user_name").val();
	
	var user_hp = $("#user_hp").val();
	var regPhone = /(01[0|1|6|9|7])(\d{3}|\d{4})(\d{4}$)/g;
	if(!regPhone.test(user_hp)){
	  alert('잘못된 휴대폰 번호입니다.');
	  $('#phone').focus();
	  return false;    
	}
	if(!chkPwd( $.trim($('#user_pw1').val()))){ 
		 alert('비밀번호는 영문,숫자를 혼합하여 8~20자 이내로 입력해주세요');    
		 return false;
		}else{
		  $('#user_pw1').val('');
		}
	
	if(user_email1 == ""){alert("이메일을 입력해주세요");return;};
	if(user_email2 == ""){alert("이메일 도메인을 입력해주세요");return;};
	var user_email = user_email1+'@'+user_email2;
	if(user_pw1 == ""){alert("비밀번호를 입력해주세요");return;};
	if(user_pw1.length < 8){alert("비밀번호를 8자 이상 입력해주세요");return;};
	if(user_pw1.length > 20){alert("비밀번호를 20자 이하로 입력해주세요");return;};
	if(user_pw2 == ""){alert("비밀번호 확인을 입력해주세요");return;};
	if(user_pw1 != user_pw2){alert("비밀번호가 서로 다릅니다");return;};
	if(!user_hp){alert("휴대폰번호를 입력해주세요");return;};
	if(user_hp < 10){alert("휴대폰번호는 01000000000 형식으로 입력해주세요");return;};
	

	var formData = {
		user_numb : user_numb,	
		user_email : user_email,
		user_hp : user_hp,
		user_name : user_name,
		user_pw : SHA256(user_pw1)	
	};

	console.log(formData);
	$.post("/back/01_sign/userUpdate.jsp",formData,function(result){
		console.log(result);
		if(result.trim() === 'SUCCESS'){

			setCookie1("user_email",user_email, 1);
			setCookie1("userEmail",user_email, 1);
			setCookie1("usercellPhone",user_hp, 1);
			alert(user_name+"님 수정 되셨습니다");
			location.href = '/home/home.html';
			
		}else{
			alert("오류가 발생했습니다. 다시 시도해주세요.\n 지속적으로 발생시 관리자에게 문의하세요.");
		}

	});
});

$("#user_email2_select").on("change", function(){
	$("#user_email2").val($(this).val());
});

//비밀번호 영문+숫자조합 체크
function chkPwd(str){
 var reg_pwd = /^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
 if(!reg_pwd.test(str)){
  return false;
 }else{
  return true; 
 }

}



