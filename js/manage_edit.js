var tpl_option_company = _.template('<option value="<%- no %>"><%- name %></option>');
var tpl_option_role = _.template('<option value="<%- code %>"><%- name %></option>');
var tpl_option_status = _.template('<option value="<%- code %>"><%- name %></option>');

$(function () {
	getHeader();

	getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_manage").addClass("active");

	// 관리자 및 데이터 조회
	$.ajax({
		url: '/back/99_manage/manageEdit.jsp?no=' + getParameterByName('no'),
		method: 'GET' 
	})
	.done(function(results){
		// 관리자
		var manager = results.data;

//		$('#empNo').val(manager.empNo);
		$('#empNo').append(manager.empNo);
		
		$('#cellphone1').val(manager.cellphone.substring(0, 3));
		$('#cellphone2').val(manager.cellphone.substring(3, 7));
		$('#cellphone3').val(manager.cellphone.substring(7, 11));

		$('#name').val(manager.name);

		$('#email').val(manager.email);

		// 판매장
		var $company = $('#company').empty();
		$company.append(tpl_option_company({ no: '', name: '선택' }));
		_.forEach(results.companyList,
			function(item) {
				$company.append(tpl_option_company(item));
			}
		);
		$company.val(manager.companyNo);

		// 역할
		var $role = $('#role').empty();
		$role.append(tpl_option_role({ code: '', name: '선택' }));
		_.forEach(results.roleList,
			function(item) {
				$role.append(tpl_option_role(item));
			}
		);
		$role.val(manager.roleCd);

//		if(manager.companyNo == 0){
//			
//		}else{
//			
//		}

		// 상태
		var $status = $('#status').empty();
		$status.append(tpl_option_status({ code: '', name: '선택' }));
		_.forEach(results.userStatusList,
			function(item) {
				$status.append(tpl_option_status(item));
			}
		);
		$status.val(manager.statusCd);

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
				company: {
					required: true
				},
				role: {
					required: true
				},
				status: {
					required: true
				}
			}
		});
	});
});

function history_back(){
	window.history.back();
}

// 관리자 수정
var updatingManager = false;
function updateManager() {
	if(updatingManager) { // 중복방지
		return 
	}

	// 수정 비활성화
	updatingManager = true;

	// 입력값 검증
	// https://jqueryvalidation.org/valid/
	if($('#tab1').valid() && confirm('수정하시겠습니까?')) {

	} else {
		// 수정 활성화
		updatingManager = false;
		return;
	}

	$.ajax({
		url: '/back/99_manage/manageEditUpdate.jsp',
		method: 'POST',
		data: {
			no: getParameterByName('no'),
			empNo: $('#empNo').html(),
			cellphone: $('#cellphone1').val() + $('#cellphone2').val() + $('#cellphone3').val(),
			name: $('#name').val(),
			email: $('#email').val(),
			company: $('#company').val(),
			role: $('#role').val(),
			status: $('#status').val()
		}
	})
	.done(function(data){
		if(data.update === 1) {
			alert('수정되었습니다.');
			manage();
		}else if(data == "NoN"){
			alert('사번이 중복됩니다.');
		} else {
			// 메시지 TO-DO

			// 수정 활성화
			updatingManager = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 수정 활성화
		updatingManager = false;
	});
}


// 관리자 삭제
var deletingManager = false;
function deleteManager() {
	if(deletingManager) { // 중복방지
		return 
	}

	// 삭제 비활성화
	deletingManager = true;

	if(confirm('정말 삭제하시겠습니까?')) {
		alert('삭제되었습니다.')
	} else {
		// 삭제 활성화
		deletingManager = false;
		return;
	}

	$.ajax({
		url: '/back/99_manage/manageEditDelete.jsp',
		method: 'POST',
		data: {
			no: getParameterByName('no'),
			empNo: $('#empNo').val()
		}
	})
	.done(function(data){
		if(data.delete === 1) {
			manage();
		} else {
			// 메시지 TO-DO

			// 삭제 활성화
			deletingManager = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 삭제 활성화
		deletingManager = false;
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