// cordova device ready
document.addEventListener("deviceready", onDeviceReady, false);	

function onDeviceReady() {

}

$("#loginAlertOk").on("click", agreePrivacy);

function agreePrivacy(){
	$(".agree_modal_wrap").hide();
    requestReadPermission();
}

function successCallback(result) {
	//console.log(result);
	//console.log("result.phoneNumber:"+result.phoneNumber);
	//console.log("result.simSerialNumber:"+result.simSerialNumber);
	//console.log("result.cards[0].phoneNumber:"+result.cards[0].phoneNumber);
	//console.log("result.cards[0].simSerialNumber:"+result.cards[0].simSerialNumber);

	var phoneNumber = result.phoneNumber;
	var simSerialNumber = result.simSerialNumber;

	if( typeof(result.phoneNumber) != "undefined" ){
		var phoneNumber = result.phoneNumber;
	}else{
		var phoneNumber = result.cards[0].phoneNumber;
	}

	if ( typeof(result.simSerialNumber) != "undefined" ){
		var simSerialNumber = result.simSerialNumber;
	}else{
		var simSerialNumber = result.cards[0].simSerialNumber;
	}

	if ( typeof(simSerialNumber) != "undefined" ){
		sessionStorage.setItem("usim",SHA256(simSerialNumber));
	}

	if ( typeof(phoneNumber) != "undefined" ){	
		if( phoneNumber.substr(0,3) == "+82" ){
			phoneNumber = "0" + phoneNumber.substr(3);
		}		
		sessionStorage.setItem("tel",phoneNumber);
	}

}

function errorCallback(error) {
  alert(error);
}

// Android only: check permission
function hasReadPermission() {
  window.plugins.sim.hasReadPermission(successCallbackHas, requestReadPermission);
}

function successCallbackHas() {
	window.plugins.sim.getSimInfo(successCallback, errorCallback);
}

// Android only: request permission
function requestReadPermission() {
	//console.log("requestReadPermission");
  window.plugins.sim.requestReadPermission(successCallbackRequest, errorCallbackRequest);
}

function successCallbackRequest() {
	//console.log("successCallbackRequest");
	window.plugins.sim.getSimInfo(successCallback, errorCallback);
}

function errorCallbackRequest() {
	//console.log("errorCallbackRequest");
//	alert("필수권한 거부로, 앱 실행이 불가합니다.\n앱을 재시작하여 필수권한을 수락해주시기 바랍니다.");
	exitApp();
}

function alertDismissed() {
    // do something
	if(navigator.app){
	   navigator.app.exitApp();
	}else if(navigator.device){
	   navigator.device.exitApp();
	}
}

//종료
function exitApp(){

	navigator.notification.alert(
		'필수권한 거부로, 앱 실행이 불가합니다. 앱을 재시작하여 필수권한을 수락해주시기 바랍니다.',  // message
		alertDismissed,         // callback
		'하나로마트',            // title
		'확인'                  // buttonName
	);
};

$("#agreeAll").click(function(){
		var chkAgreeAll = $('input:checkbox[id="agreeAll"]').is(":checked");
				//console.log(chkAgreeAll);
		if (chkAgreeAll == true)
			{
				$( 'input:checkbox[id="agreeSim"], input:checkbox[id="agreeLocation"], input:checkbox[id="agreePush"]').prop( 'checked',true);
			}else{
				$( 'input:checkbox[id="agreeSim"], input:checkbox[id="agreeLocation"], input:checkbox[id="agreePush"]').prop( 'checked',false);
			}
})


$(".login_submit_btn").click(function(){
	
	var agreementChk1 = $(".login_check_wrap input[id='agreeAll']").is(':checked');//모두동의
	var agreementChk2 = $(".login_check_wrap input[id='agreeSim']").is(':checked');//개인정보수집동의
	var agreementChk3 = $(".login_check_wrap input[id='agreeLocation']").is(':checked');//location 동의
	var agreementChk4 = $(".login_check_wrap input[id='agreePush']").is(':checked');//Push 동의

	var d = new Date();
	var currentDate = d.getFullYear() + "년 " + ( d.getMonth() + 1 ) + "월 " + d.getDate() + "일";

	if (agreementChk2 == true)
	{
		localStorage.setItem("agree_privacy","Y");

		if (agreementChk3 == true)
		{
			localStorage.setItem("agree_location","Y");
		}else{
			localStorage.setItem("agree_location","N");
		}

		if (agreementChk4 == true)
		{
			localStorage.setItem("agree_push","Y");
			alert("하나로마트 앱\n"+currentDate+"에 혜택(광고성정보)알림 수신 동의 처리 되었습니다.\n※ 수신동의는 설정메뉴에서 변경가능합니다.");
		}else{
			localStorage.setItem("agree_push","N");
			alert("하나로마트 앱\n"+currentDate+"에 혜택(광고성정보)알림 수신 거부 처리 되었습니다.\n※ 수신동의는 설정메뉴에서 변경가능합니다.");
		}

		$.post("https://www.nhhanaromart.com/back/02_app/mSignup.jsp",
		{
			tel : sessionStorage.getItem("tel"),	
			usim : sessionStorage.getItem("usim"),
			agree_privacy : localStorage.getItem("agree_privacy"),
			agree_push : localStorage.getItem("agree_push"),				
			agree_location : localStorage.getItem("agree_location"),
			company_no : localStorage.getItem("vm_cp_no")
		},
		function(result){
			console.log(result);
			if(result.trim() == 'ERROR'){
				alert("오류가 발생했습니다. 다시 시도해주세요.\n 지속적으로 발생시 관리자에게 문의하세요.");
			}else if(result.trim() != ''){
				console.log("회원등록및로그인");				
				localStorage.setItem("usim",sessionStorage.getItem("usim"));
				localStorage.setItem("tel",sessionStorage.getItem("tel"));
				localStorage.setItem("memberNo",result.trim());
				location.href="check_location.html";
			}else{
				alert("오류가 발생했습니다. 다시 시도해주세요.\n 지속적으로 발생시 관리자에게 문의하세요.");
			}
		});
	}else{
	
		alert("개인정보 수집 미동의시 로그인이 불가능합니다.");
	}


})

$('.login_check_wrap img').parent().siblings("p").hide();
$('.main_cont:nth-child(2) .login_check_wrap img').parent().siblings("p").show();
$(".login_check_wrap img").click(function(){
		$(this).parent().siblings("p").toggle();
})