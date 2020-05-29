//   판매장 리스트 소트 테스트 (200529 김수경)
$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111

	var pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
	    pageNo = 1;
	}
		  /* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
		CuserCompanyNo = getCookie("userCompanyNo");
	
		/* 우상단 선택된 판매장번호 정보를 담는다. */
		onSelectCompanyNo = getCookie("onSelectCompanyNo");
	
		var targetCompanyNo = "";
		if (onSelectCompanyNo != "")
		{
			if (onSelectCompanyNo != CuserCompanyNo)
			{
				targetCompanyNo = onSelectCompanyNo;
			}else{
				targetCompanyNo = CuserCompanyNo;
			}
		}else{
			targetCompanyNo = CuserCompanyNo;
		}
	
		/* 최초 로그인한 유저번호로 바인딩한다. */
		getManagerList(CuserCompanyNo, targetCompanyNo);
	
	/*판매장 변경시, 
	1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
	2. 저장된 쿠키정보를 이용하여 긴급공지내용을 바인딩한다. 
	3. iframe 내부 모바일웹의 판매장셋팅을 위해, 로컬스토리지에 판매장번호를 셋팅한다.
	4. 선택한 판매장번로를 이용하여 iframe reload 한다.*/
	$("#sort_select").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			prodList(pageNo, getCookie("onSelectCompanyNo"));
			prodList_paging(pageNo, getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	
	prodList(pageNo, targetCompanyNo);
	prodList_paging(pageNo, targetCompanyNo);

});

		/* 공통부분 종료======================================================================== */ 
//   판매장 리스트 소트 테스트 (200529 김수경)

// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr id="member<%- event_no %>" data-no="<%- event_no %>"><td><%- event_no %></td>' +
	'<td><a href="event_edit.html?event_no=<%- event_no %>" ><img src="<%- img_url %>"/></a>'+ 
	'</td><td><%- company_name %></td><td><a href="event_edit.html?event_no=<%- event_no %>" ><%- event_title %></a></td><td><%- period %></td>' +
	'<td><%- reg_name %></td><td><%- reg_date %><td><%- activated_status %></td>'
	);

$(function () {
	getHeader();
	$(".nav_event").addClass("active");

	getLeft();
	getLeftMenu('event');
	$("#nh_event_list").addClass("active");

	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	if(userRoleCd === 'ROLE1' || userRoleCd === 'ROLE2'){
		$("#eventSubmit").show();
	}else{
		$("#eventSubmit").hide();
	}	
	getEventList();
});

function getEventList(){
	var userRoleCd = getCookie('userRoleCd');
	$('#pagination').pagination({
		dataSource: '/back/05_event/event.jsp?userRoleCd='+userRoleCd,
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			console.log(list);
			var $tbody = $('#eventList').empty();
			_.forEach(list,
				function(item) {
					$tbody.append(tpl_tr_tab1_table(item));
				}
			);
		},
		formatAjaxError: function(jqXHR) {
			alert(jqXHR.responseJSON.error);
			//window.history.back();			
			deleteAllCookies();
			login();
		}
	});
}
