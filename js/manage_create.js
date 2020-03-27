var tpl_option_company = _.template('<option value="<%- no %>"><%- name %></option>');
var tpl_option_role = _.template('<option value="<%- code %>"><%- name %></option>');

$(function () {
	getHeader();

	getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_manage").addClass("active");

	// 데이터 조회
	$.ajax({
		url: '/back/99_manage/manageCreate.jsp',
		method: 'GET' 
	})
	.done(function(results){
		// 판매장
		var $company = $('#company').empty();
		$company.append(tpl_option_company({ no: '', name: '선택' }));
		_.forEach(results.companyList,
			function(item) {
				$company.append(tpl_option_company(item));
			}
		);

		// 역할
		var $role = $('#role').empty();
		$role.append(tpl_option_role({ code: '', name: '선택' }));
		_.forEach(results.roleList,
			function(item) {
				$role.append(tpl_option_role(item));
			}
		);
	})
	.fail(function(jqXHR){
		alert(jqXHR.responseJSON.error);
		window.history.back();
	})
	.always(function(){
		// 입력값 검증 설정
		// https://jqueryvalidation.org/validate/
		$('#tab1').validate({
			rules: {
				empNo: {
					required: true
				},
				cellphone1: {
					required: true
				},
				cellphone2: {
					required: true,
					digits: true,
					minlength: 3,
					maxlength: 4
				},
				cellphone3: {
					required: true,
					digits: true,
					minlength: 4,
					maxlength: 4
				},
				name: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				password: {
					required: true,
					minlength: 8
				},
				password_confirm: {
					required: true,
					minlength: 8,
					equalTo: "#password"
				},
				company: {
					required: true
				},
				role: {
					required: true
				}
			}
		});
	});
});

function history_back(){
	window.history.back();
}

// 관리자 등록
var creatingManager = false;
function createManager() {
	if(creatingManager) { // 중복방지
		return;
	}

	// 등록 비활성화
	creatingManager = true;

	// 입력값 검증
	// https://jqueryvalidation.org/valid/
	if(!$('#tab1').valid()) {
		// 등록 활성화		
		creatingManager = false;
		return;
	}

	var emailVal = $("#email").val();
	// 이메일 검증용 정규표현식
  	var emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;  
	if (!emailRegExp.test(emailVal)) {
		alert('이메일을 형식을 확인해주세요!');
		$("#email").select();
		creatingManager = false;
		return;
	}

	if($('#cellphone2').val().length < 3){
		alert('3자리 보다 적을 수 없습니다. 전화번호 형식을 확인해주세요!');
		$('#cellphone2').select();
		creatingManager = false;
		return;
	}

	if($('#cellphone2').val().length > 4){
		alert('4자리를 넘을 수 없습니다. 전화번호 형식을 확인해주세요!');
		$('#cellphone2').select();
		creatingManager = false;
		return;
	}

	if($('#cellphone3').val().length != 4){
		alert('전화번호 끝자리는 4자리입니다. 전화번호 형식을 확인해주세요.');
		$('#cellphone2').select();
		creatingManager = false;
		return;
	}

	$.ajax({
		url: '/back/99_manage/manageCreateInsert.jsp',
		method: 'POST',
		data: {
			empNo: $('#empNo').val(),
			cellphone: $('#cellphone1').val() + $('#cellphone2').val() + $('#cellphone3').val(),
			name: $('#name').val(),
			email: $('#email').val(),
			password: SHA256($('#password').val()),
			company: $('#company').val(),
			role: $('#role').val()
		}
	})
	.done(function(data){
		if(data.insert === 1) {
			alert('등록되었습니다.');
			manage();
		}else if(data == "NoN"){
			alert('사번이 중복됩니다.');
		}else {
			// 메시지 TO-DO

			// 등록 활성화
			creatingManager = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 등록 활성화
		creatingManager = false;
	});
}

//onchange로 매장선택시 역할 한정되게 하기 20200109 김나영

$("#company").on("change", function(){	    
    if(this.value == 0){	  
	  $("#role").val("ROLE1");
	   $("#role option[value=ROLE1]").attr("selected", "selected");
	   $("#role option[value=ROLE1]").removeAttr("hidden", "hidden");
	   $("#role option[value=ROLE1]").removeAttr("disabled", "disabled");	
	   $("#role option[value=ROLE2]").attr("hidden", "hidden");	
	   $("#role option[value=ROLE3]").attr("hidden", "hidden");	
    } else {
      $("#role option[value=ROLE2]").attr("selected", "selected");	
	  $("#role option[value=ROLE1]").attr("hidden", "hidden");	
	  $("#role option[value=ROLE1]").attr("disabled", "disabled");	
	  $("#role option[value=ROLE2]").removeAttr("hidden", "hidden");	
	  $("#role option[value=ROLE3]").removeAttr("hidden", "hidden");	
    }
});