


$("#loginAlertOk").on("click", agreePrivacy);



//��� ���ù�ư
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


//�α��ο��� ��ư Ŭ���� ��ġ�������� �Ѿ
$(".login_submit_btn").click(function(){
	
	var agreementChk1 = $(".login_check_wrap input[id='agreeAll']").is(':checked');//��ε���
	var agreementChk2 = $(".login_check_wrap input[id='agreeSim']").is(':checked');//����������������
	var agreementChk3 = $(".login_check_wrap input[id='agreeLocation']").is(':checked');//location ����
	var agreementChk4 = $(".login_check_wrap input[id='agreePush']").is(':checked');//Push ����

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
	
		alert("�������� ���� �̵��ǽ� �α����� �Ұ����մϴ�.");
	}


})

$('.login_check_wrap img').parent().siblings("p").hide();
$(".login_check_wrap img").click(function(){
		$(this).parent().siblings("p").toggle();
})

function agreePrivacy(){
		$(".agree_modal_wrap").hide();
}