$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");

		getLeft();
		getLeftMenu('event');
		$("#nh_event_stamp_num").addClass("active");

		/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
		CuserCompanyNo = getCookie("userCompanyNo");
		CuserCompanyName = getCookie("userCompanyName");

		getCompanyList();
		getStaffList();
	
		$('#btnCreate').on('click', function(){		
			var staff_name =$('#staff_name').val();
			var stamp_pw =$('#stamp_pw').val();
			var company_no = $('#company').val();
			var stampLength = stamp_pw.length;

			if(!stamp_pw) {
				alert('스탬프 비밀번호를 넣어주세요.');
				return
			}
			
			if(stampLength > 9) {
				alert('스탬프 비밀번호는 4자리에서 8자리만 가능합니다.');
				return;
			}

			if(stampLength < 4) {
				alert('스탬프 비밀번호는 4자리에서 8자리만 가능합니다.');
				return;
			}			
			if(!staff_name) {
				alert('이름을 넣어주세요.');
				return;
			}

			var formData = {
				company_no : company_no,
				staff_name : staff_name,
				stamp_pw : stamp_pw			
			} ;

			console.log(formData);
			createStaff(formData);
		});

		
	});

// tbody tamplete
var tpl_tr_tab1_table = _.template('<tr id="staff<%- staff_no %>" data-no="<%- staff_no %>">'+
	'<td><%- staff_no %></td>' +
	'<td><%- staff_name %></td>' +	
	'<td><input type="text" id="stamp_pw<%- staff_no %>" value="<%- stamp_pw %>" maxlength="8"/></td>' +
	'<td><%- company_name %></td>' +	
	'<td><%- reg_name %> </td>' +
	'<td><%- reg_date %> </td>' +
	'<td><button class="stamp_num_edit_btn" onclick="updateStaff(<%- staff_no %>)">수정</button>' +
	'<button class="stamp_num_del_btn" onclick="deleteStaff(<%- staff_no %>)">삭제</button></td></tr>'
);

function getStaffList(){

	$('#pagination').pagination({
		dataSource: '/back/05_event/staff.jsp',
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			console.log(list);
			var $tbody = $('#staffList').empty();
			_.forEach(list,
				function(item) {
					$tbody.append(tpl_tr_tab1_table(item));
				}
			);

			$('.stamp_num_edit_btn').on('click', function(){
				console.log($(this).data('staff-no'));
			});
		},
		formatAjaxError: function(jqXHR) {
			alert(jqXHR.responseJSON.error);
			window.history.back();
		}
	});
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
	if(CuserCompanyNo == 0){
		$(companyList).each( function (idx, company) {
		if(company.VM_CP_NO == 0 ) return;
		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
		});
	}else{
		options += '<option value=' + CuserCompanyNo + '>' + CuserCompanyName + '</option>' ;
	}
	
	$('#company').append(options);
}

function createStaff(formData){
	$.post( '/back/05_event/staffCreate.jsp',
		formData, 			
		function(resultJSON){
			if(resultJSON['insert'] > 0){
				alert('등록되었습니다');
				$('#staff_name').val('');
				$('#stamp_pw').val('');					
				getStaffList();
			}else if(resultJSON['insert'] == 0){
				alert('중복된 비밀번호가 존재합니다.');
			}else {
				alert(resultJSON['error']);
			}
		}
	);
}

function updateStaff(staff_no){
	var formData = {
		staff_no : staff_no,
		stamp_pw : $('#stamp_pw'+staff_no).val()
	}
		
			var stampLength = formData.stamp_pw.length;
			
			if(!stampLength) {
				alert('스탬프 비밀번호를 넣어주세요.');
				return
			}
			
			if(stampLength > 9) {
				alert('스탬프 비밀번호는 4자리에서 8자리만 가능합니다.');
				return;
			}

			if(stampLength < 4) {
				alert('스탬프 비밀번호는 4자리에서 8자리만 가능합니다.');
				return;
			}			


	if(!confirm('수정하시겠습니까?')) return;

	console.log(formData);
	$.post( '/back/05_event/staffUpdate.jsp',
		formData, 			
		function(resultJSON){
			if(resultJSON['update'] > 0){
				alert('수정되었습니다');								
				getStaffList();
			}else if(resultJSON['insert'] == 0){
				alert('중복된 비밀번호가 존재합니다.');
			}else {
				alert(resultJSON['error']);
			}
		}
	);
}

function deleteStaff(staff_no){
	var formData = {
		staff_no : staff_no
	}

	if(!confirm('삭제하시겠습니까?')) return;
	console.log(formData);
	$.post( '/back/05_event/staffDelete.jsp',
		formData, 			
		function(resultJSON){
			if(resultJSON['delete'] > 0){
				alert('삭제되었습니다');				
				getStaffList();
			}else {
				alert(resultJSON['error']);
			}
		}
	);
}
	