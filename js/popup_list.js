$(function() {
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
	var sday = leadingZeros(today.getDate()-10,2);
	var eday = leadingZeros(today.getDate(),2);

	// $("#excel_start_date").val(year+'-'+month+'-'+sday);
	// $("#excel_end_date").val(year+'-'+month+'-'+eday);		

	$("#popup_start_date").val(year+'-'+month+'-'+sday);
	$("#popup_end_date").val(year+'-'+month+'-'+eday);	

	$("#sort_select").on("change",function(){
		if ($("#sort_select").val())
		{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});

	$("#btnSearch").on("click",function(){
		getPopupList(getCookie("onSelectCompanyNo"));
	});
});

function searchEnter(e) {
	if (e.keyCode == 13) {
		getPopupList(getCookie("onSelectCompanyNo"));
	}
}

// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr id="member<%- popup_no %>" data-no="<%- popup_no %>"><td><%- popup_no %></td>' +
	'<td><a href="popup_edit.html?popupNo=<%- popup_no %>" ><%- popup_title %></a></td><td><a href="popup_edit.html?popupNo=<%- popup_no %>" ><img src="<%- img_url %>"/></a></td><td><%- company_name %></td><td><%- period %></td>' + 	
	'<td><%- reg_name %></td><td><%- lst_name %></td><td><%- reg_date %></td><td><%- show_flag %></td>'
	);

$(function () {
	getHeader();
	$(".nav_home").addClass("active");

	getLeft();
	getLeftMenu('home');
	$("#nh_home_popup").addClass("active");
	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	if(userRoleCd === 'ROLE1' || userRoleCd === 'ROLE2' ){
		$('#popup_submit').append('<button id="popupSubmit" onclick="popup_create();">등록 </button>') ;
	}	
	getPopupList();

});

function getPopupList(compNo){
	if (!compNo) compNo = getCookie("onSelectCompanyNo");
	const s_date = $("#popup_start_date").val();
	const e_date = $("#popup_end_date").val();
	const category = $(".search_select").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	let dataSourceUrl = '/back/04_home/popup.jsp?company='+compNo+'&s_date='+s_date+'&e_date='+e_date+'&category='+category+'&keyword='+keyword;
	dataSourceUrl += "&status="+flag;
	$('#pagination').pagination({
		dataSource: dataSourceUrl,
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			var $tbody = $('#popupListTbody').empty();
			console.log(list);

			_.forEach(list,
				function(item) {
					if (item['show_flag'] == 'Y') {
						item['show_flag'] = "반영";
					} else {
						item['show_flag'] = "미반영";
					}
					let datey = new Date(item['reg_date']);
					item['reg_date'] 	= datey.getFullYear() + "-";
					item['reg_date'] += ( datey.getMonth() + 1 ).toString().length > 1 ? datey.getMonth() + 1 : "0" + (datey.getMonth() + 1);
					item['reg_date'] += "-" + ((datey.getDate().toString().length > 1) ? datey.getDate() : "0" + datey.getDate());
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
