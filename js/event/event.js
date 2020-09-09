/*
// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr id="member<%- event_no %>" data-no="<%- event_no %>"><td><%- event_no %></td>' +
	'<td><a href="event_edit.html?event_no=<%- event_no %>" ><img src="<%- img_url %>"/></a>'+ 
	'</td><td><%- company_name %></td><td><a href="event_edit.html?event_no=<%- event_no %>" ><%- event_title %></a></td><td><%- period %></td>' +
	'<td><%- reg_name %></td><td><%- reg_date %><td><%- activated_status %></td>'
	);
*/
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
	/*input box 일자 기본값 셋팅  2020.09.03 심규문 fromdate 14일 default 셋팅*/	
	
	var todate = new Date();
	var fromdate = new Date();
	// input todate 설정 
	var toYear = todate.getFullYear();
	var toMonth = leadingZeros(todate.getMonth() + 1 , 2);
	var toDate = leadingZeros(todate.getDate() , 2);
	// input fromdate 설정 -14일 
	fromdate.setDate(fromdate.getDate() - 14);
	var fromYear = fromdate.getFullYear()
	var fromMonth = leadingZeros(fromdate.getMonth() + 1 , 2);
	var fromDate = leadingZeros(fromdate.getDate() , 2);

	$("#event_start_date").val(fromYear+'-'+fromMonth+'-'+fromDate);
	$("#event_end_date").val(toYear+'-'+toMonth+'-'+toDate);	

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
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});

	$("#btnSearch").on("click",function(){
		settingInfo();
	});
	getEventList();
});
function searchEnter(e) {
	if (e.keyCode == 13) {
		settingInfo();
	}
}

function settingInfo() {
	const s_date = $("#event_start_date").val();
	const e_date = $("#event_end_date").val();
	const category = $("#searchCategory").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	const params = {
		s_date: s_date,
		e_date: e_date,
		category: category,
		keyword: keyword,
		flag: flag
	}
	localStorage.setItem("eventList", JSON.stringify(params));
	getEventList(getCookie("onSelectCompanyNo"));
}
// 판매장 템플릿 버튼

var tpl_tr_tab1_table = _.template('<tr id="member<%- event_no %>" data-no="<%- event_no %>"><td><%- event_no %></td>' +
	'<td><a href="event_edit.html?event_no=<%- event_no %>" ><img src="<%- img_url %>"/></a>'+ 
	'</td><td><%- company_name %></td><td><a href="event_edit.html?event_no=<%- event_no %>" ><%- event_title %></a></td><td><%- period %></td>' +
	'<td><%- reg_name %></td><td><%- reg_date %></td><td align = "center" >' +
	'<li class="tg-list-item" style="list-style: none;">' +
	'<input class="tgl tgl-ios" id="cb<%- event_no %>" type="checkbox" <%- activatedY %> onclick="javascript:changeEventActive(\'<%-event_no%>\')">' +
	'<label class="tgl-btn" for="cb<%- event_no %>" align ="center"></label>' +
	'</li>' +
	'</td>'
	);


	function changeEventActive(no) {
		let flag;
		if ($("#cb"+no).prop("checked")) {
			flag = "Y";
		} else {
			flag = "N";
		}
		$.ajax({
			url:'/back/05_event/eventChangeActive.jsp?random=' + (Math.random()*99999), 
			data : {eventNo: no, activated: flag},
			method : 'POST' 
		});
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
	console.log(dataSourceUrl);
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
					if (item['activated'] == 'Y') {
						item['activatedY'] = "checked=checked";
						item['activatedN'] = "";
					} else {
						item['activatedN'] = "checked=checked";
						item['activatedY'] = "";
					}	
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
