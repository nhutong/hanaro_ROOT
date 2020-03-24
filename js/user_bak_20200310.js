// 판매장 템플릿
	var tpl_tr_tab1_table = _.template('<tr id="member<%- no %>" data-no="<%- no %>"><td><%- no %></td>' +
	'<td><%- company %></td><td><%- tel.replace("+82","0") %></td><td><%- name %></td><td><%- no %></td>' + 	
	//동의 컬럼열 
	'<td><%- privacy %></td><td><%- regDate %></td><td><%- push %></td><td><%- push_agree_date %></td><td><%- push_disagree_date %></td><td><%- location %></td>'+	
	'<td><%- address %></td><td><%- orderCount %></td><td><%- totalOrderPrice %>' +
	'</td><td class="memo"><a href="#" class="btn btn-sm btn-success" data-name="<%- name %>" data-no="<%- no %>" data-memo="<%- memo %>" data-toggle="modal" data-target="#memoModal"><i class="far fa-file-alt"></i></a></td>'

	);

$(function () {
	getHeader();

	getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');	
	$("#myplanb_menu_user").addClass("active");
	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	if(userRoleCd === 'ROLE1'){ 
		// 본사관리자의 경우 등록 버튼 추가
		//$('.btn_box2').append('<span class="admin_btn sign_up_menu" onclick="shop_create();">등록</span>');
	}

	// 사용자 수정 (click)
  	// https://api.jquery.com/on/, https://api.jquery.com/category/events/event-object/
	$('#btnUserSearch').on('click', function(){ searchUser() } ) ;
	$('#keyword').on('keypress', function(e){ 
		//console.log(event.keyCode);
		if(event.keyCode !== 13)  return; 
		searchUser(); 		
	} ) ;	
		
	$('#user_down').on('click', function(){ getUserListNoPaging()});
	//$('#privacy').on('change', function(){ searchUser() } ) ;
	$('#push').on('change', function(){ searchUser() } ) ;
	$('#location').on('change', function(){ searchUser() } ) ;
	$('#memoModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var name = button.data('name');
		var memberNo = button.data('no');
		var memo = button.data('memo'); 
		var modal = $(this);
		modal.find('.modal-title').text(name + '님 고객 메모');
		modal.find('#memo').val(memo);
		modal.find('#memo').data('memberNo', memberNo);		
	  });

	  $('#btnSave').on('click', function(){		
		var memo = $('#memo').val();
		var memberNo = $('#memo').data('memberNo');
		updateUser(memberNo, memo);
	  });
	
	searchUser();

});

// 사용자 조회
function searchUser(){
	
	// 페이징 표시 (판매장 리스트 조회)
	// https://pagination.js.org/
	var keyword = encodeURIComponent($('#keyword').val());	
	var push = $('#push').val();
	var agree_loc = $('#location').val();

	$('#pagination').pagination({
		dataSource: '/back/99_manage/user.jsp?keyword='+keyword+'&push='+push+'&location='+agree_loc,
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {			
			if(keyword && !list.length) {
				alert('일치하는 정보가 없습니다');
				return;
			}
			console.log(list);

			var $tbody = $('#tab1_table').empty();
			_.forEach(list,
				function(item) {
					$tbody.append(tpl_tr_tab1_table(item));
				}
			);
		},
		formatAjaxError: function(jqXHR) {
			alert(jqXHR.responseJSON.error);
			window.history.back();
		}
	});
}

// 사용자 정보 수정
function updateUser(memberNo, memo){
	
	// 페이징 표시 (판매장 리스트 조회)
	// https://pagination.js.org/	
	var formData = {memberNo :memberNo,memo:memo};
	$.post("/back/99_manage/userUpdate.jsp",
		formData,
		function(resultJSON){
			console.log(resultJSON);
			//var updateResult = JSON.parse(result);
			if(resultJSON.result == "success"){
				alert("저장되었습니다.");				
				$('#btnClose').click();
				searchUser();
			}else{
				alert(userLoginData[0].result_msg);
				return;
			}
		}
	);
}

//엑셀 다운로드
function getUserListNoPaging(){
	
	// 페이징 표시 (판매장 리스트 조회)
	// https://pagination.js.org/
	var keyword = $('#keyword').val();	
	var push = $('#push').val();
	var agree_loc = $('#location').val();

	//데이터 조회 후 엑셀 함수 호출
	$.get('/back/99_manage/user.jsp?keyword='+keyword +'&push='+push+'&location='+agree_loc + '&pageNumber=1&pageSize=99999999',
	function(result){
		var headList = ['매장', '휴대폰번호', '이름', '회원번호',	
						'개인정보동의',	'동의일자', '광고동의', '광고동의일시', '광고해제일시', '위치정보활용동의', '최근 수정일',	
						'최근주문주소',	'총주문건수',	'총주문금액', '회원 메모' ];
		createExcel(headList, result.list);
	});
}


// 엑셀 다운로드용 함수
function createExcel(headList, rowList){
 
 
	var createXLSLFormatObj = [];

	/* XLS Head Columns */
	var xlsHeader = headList ; //["EmployeeID", "Full Name"];

	/* XLS Rows Data */
	var xlsRows = rowList;

	createXLSLFormatObj.push(xlsHeader);
	$.each(xlsRows, function(index, value) {
		var innerRowData = [];
		$.each(value, function(ind, val) {

			innerRowData.push(val);
		});
		createXLSLFormatObj.push(innerRowData);
	});


	/* File Name */
	
	var filename = "회원목록.xlsx";

	/* Sheet Name */
	var ws_name = "회원목록";

	if (typeof console !== 'undefined') console.log(new Date());
	var wb = XLSX.utils.book_new(),
		ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

	/* Add worksheet to workbook */
	XLSX.utils.book_append_sheet(wb, ws, ws_name);

	/* Write workbook and Download */
	if (typeof console !== 'undefined') console.log(new Date());
	XLSX.writeFile(wb, filename);
	if (typeof console !== 'undefined') console.log(new Date());
}
