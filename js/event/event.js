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
	/*input box 일자 기본값 셋팅*/
	var today = new Date();
	var year = today.getFullYear();
	var month = leadingZeros(today.getMonth()+1,2);
	var sday = leadingZeros(today.getDate()-2,2);
	var eday = leadingZeros(today.getDate(),2);

	// $("#excel_start_date").val(year+'-'+month+'-'+sday);
	// $("#excel_end_date").val(year+'-'+month+'-'+eday);		

	$("#event_start_date").val(year+'-'+month+'-'+sday);
	$("#event_end_date").val(year+'-'+month+'-'+eday);	

	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	if(userRoleCd === 'ROLE1' || userRoleCd === 'ROLE2'){
		$("#eventSubmit").show();
	}else{
		$("#eventSubmit").hide();
	}

	$("#sort_select").on("change",function(){
		if ($("#sort_select").val())
		{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			//noticeCont(getCookie("onSelectCompanyNo"));
			getEventList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});

	$("#btnSearch").on("click",function(){
		getEventList(getCookie("onSelectCompanyNo"));
	});
	$("#show_flag_status").on("change", function() {
		getEventList(getCookie("onSelectCompanyNo"));
	});

	getEventList();
});
function searchEnter(e) {
	getEventList(getCookie("onSelectCompanyNo"));
}

function getEventList(compNo){
	if (!compNo) compNo = getCookie("onSelectCompanyNo");
	var userRoleCd = getCookie('userRoleCd');
	const s_date = $("#event_start_date").val();
	const e_date = $("#event_end_date").val();
	const category = $(".search_select").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	let dataSourceUrl = '/back/05_event/event.jsp?company='+compNo+'&s_date='+s_date+'&e_date='+e_date+'&category='+category+'&keyword='+keyword;
	dataSourceUrl += "&status="+flag+"&userRoleCd="+userRoleCd;
	$('#pagination').pagination({
		dataSource: dataSourceUrl,
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
