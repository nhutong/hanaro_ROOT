


$("#loginAlertOk").on("click", agreePrivacy);



//모두 선택버튼
$("#agreeAll").click(function(){
		var chkAgreeAll = $('input:checkbox[id="agreeAll"]').is(":checked");
				console.log(chkAgreeAll);
		if (chkAgreeAll == true)
			{
				$( 'input:checkbox[id="agreeSim"], input:checkbox[id="agreeLocation"], input:checkbox[id="agreePush"]').prop( 'checked',true);
			}else{
				$( 'input:checkbox[id="agreeSim"], input:checkbox[id="agreeLocation"], input:checkbox[id="agreePush"]').prop( 'checked',false);
			}
})


//로그인에서 버튼 클릭시 위치선택으로 넘어감
$(".login_submit_btn").click(function(){
	
	var agreementChk1 = $(".login_check_wrap input[id='agreeAll']").is(':checked');//모두동의
	var agreementChk2 = $(".login_check_wrap input[id='agreeSim']").is(':checked');//개인정보수집동의
	var agreementChk3 = $(".login_check_wrap input[id='agreeLocation']").is(':checked');//location 동의
	var agreementChk4 = $(".login_check_wrap input[id='agreePush']").is(':checked');//Push 동의

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
		}else{
			localStorage.setItem("agree_push","N");
		}
		
		location.href="check_location.html";

	}else{
	
		alert("개인정보 수집 미동의시 로그인이 불가능합니다.");
	}


})

$('.login_check_wrap img').parent().siblings("p").hide();
$(".login_check_wrap img").click(function(){
		$(this).parent().siblings("p").toggle();
})

function agreePrivacy(){
		$(".agree_modal_wrap").hide();
}