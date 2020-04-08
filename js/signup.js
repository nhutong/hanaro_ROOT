//인증 확인
var auth = "";

window.onload = init1;
function init1(){	
	getHeader();
	getCompanyList();
}

function getCompanyList(){
	$.get("/back/01_sign/getCompanyList.jsp",		
		function(resultJSON){						
			//console.log(resultJSON);
			companyList = resultJSON['list'];
			if(companyList.lengh) return;
			setCompanyOptions(companyList);
		}
	);
}

function setCompanyOptions(companyList){
	var options = '';
	$(companyList).each( function (idx, company) {
		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
	});
	$('#user_company').append(options);
}

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
	   $("#user_role option[value=ROLE1]").removeAttr("hidden", "hidden");
	   $("#user_role option[value=ROLE2]").attr("hidden", "hidden");	
	   $("#user_role option[value=ROLE3]").attr("hidden", "hidden");	
    } else {
      $("#user_role option[value=ROLE2]").attr("selected", "selected");	
	  $("#user_role option[value=ROLE1]").attr("hidden", "hidden");	
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
	$("#user_hp").val($("#user_hp").val().replace(/[^0-9]/g, '')); //숫자만
	var user_hp = $("#user_hp").val();
	/*2020-01-08 휴대폰번호 Validation을 위한 수정 - 김나영*/
	var regPhone = /(01[0|1|6|9|7])(\d{3}|\d{4})(\d{4}$)/g;
	if(!regPhone.test(user_hp)){
	  alert('잘못된 휴대폰 번호입니다.');
	  $('#phone').focus();
	  return false;    
	}
	var user_company = $("#user_company").val();
	var user_role = $("#user_role").val();	
	if(!chkPwd( $.trim($('#user_pw1').val()))){ 
		 alert('비밀번호는 영문,숫자를 혼합하여 8~20자 이내로 입력해주세요');    
		 return false;
		}else{
		  $('#user_pw1').val('');
		}
	if(!user_numb){alert("사번을 입력해주세요");return;};
	if(user_email1 == ""){alert("이메일을 입력해주세요");return;};
	if(user_email2 == ""){alert("이메일 도메인을 입력해주세요");return;};
	var user_email = user_email1+'@'+user_email2;
	if(user_pw1 == ""){alert("비밀번호를 입력해주세요");return;};
	if(user_pw1.length < 8){alert("비밀번호를 8자 이상 입력해주세요");return;};
	if(user_pw1.length > 20){alert("비밀번호를 20자 이하로 입력해주세요");return;};
	if(user_pw2 == ""){alert("비밀번호 확인을 입력해주세요");return;};
	if(user_pw1 != user_pw2){alert("비밀번호가 서로 다릅니다");return;};
	if(user_name == ""){alert("이름을 입력해주세요");return;};
	if(!user_hp){alert("휴대폰번호를 입력해주세요");return;};
	if(user_hp < 10){alert("휴대폰번호는 01012345678 형식으로 입력해주세요");return;};
	if(!user_company){alert("판매장을 선택해주세요");return;};
	if(!user_role){alert("역할을 선택해주세요");return;};
	

	var formData = {
		user_numb : user_numb,	
		user_email : user_email,
		user_hp : user_hp,
		user_name : user_name,
		user_pw : SHA256(user_pw1),				
		user_company : user_company,
		user_role : user_role		
	};

	console.log(formData);
	$.post("/back/01_sign/signUp.jsp",formData,function(result){
		console.log(result);
		if(result.trim() === 'SUCCESS'){
			alert(user_name+"님 등록 되셨습니다");
			location.href = '/kacm/';
		}else if(result.trim() === 'empno'){
			alert(user_numb + " 이미 등록된 사번입니다.");
			return;
		}else if(result.trim() === 'email'){
			alert(user_email + " 이미 등록된 이메일입니다.");
			return;
		}else{
			alert("오류가 발생했습니다. 다시 시도해주세요.\n 지속적으로 발생시 관리자에게 문의하세요.");
		}
		// var userLoginData = JSON.parse(result);
		
		// if(userLoginData[0].result_msg == "success"){
		// 	alert("회원가입 되셨습니다");
		// 	setCookie2("user_no",userLoginData[0]['user_no'], 1);
		// 	setCookie2("user_token",userLoginData[0]['user_token'], 1);
		// 	setCookie2("cont_no",userLoginData[0]['cont_no'], 1);
		// 	setCookie2("cont_token",userLoginData[0]['cont_token'], 1);
		// 	main();
		// }else{
		// 	alert(userLoginData[0].result_msg);
		// 	return;
		// }
	});
});

$("#user_email2_select").on("change", function(){
	$("#user_email2").val($(this).val());
});

$("#all_check").on("click", function(){
	$(':input[name="agree"]').prop("checked", this.checked);
});

//인증번호 발송 api
$("#authcode_btn").on("click", function(){
	var phone = $("#user_hp").val();
	if(phone == ""){
		alert("휴대폰번호를 입력해주세요");
		return;
	}
	$.post("/back-end/01-user/msg/user_signup_msg.php",{
		phone: phone
	},function(result){
		if(result == "success"){
			alert("문자가 발송 되었습니다");
			return;
		}else if(result == "limit"){
			alert("잠시후 다시 시도해주시기 바랍니다");	
		}else{
			alert("전송 실패");
		}
	})
});
//인증확인 api
$("#authcode_btn2").on("click", function(){
	var auth_code = $("#auth_code").val();
	var phone = $("#user_hp").val();
	if(auth_code == ""){
		alert("인증번호를 입력해주세요");
		return;
	}
	$.post("/back-end/01-user/user_auth_check.php",{
		phone: phone,
		authcode: auth_code
	},function(result){
		if(result == "match"){
			alert("인증 되었습니다");
			auth = "Y";
			return;
		}else{
			alert("인증 실패");
		}
	})
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



