// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr id="member<%- popup_no %>" data-no="<%- popup_no %>"><td><%- popup_no %></td>' +
	'<td><a href="popup_edit.html?popupNo=<%- popup_no %>" ><%- popup_title %></a></td><td><a href="popup_edit.html?popupNo=<%- popup_no %>" ><img src="<%- img_url %>"/></a></td><td><%- company_name %></td><td><%- period %></td>' + 	
	'<td><%- reg_name %></td><td><%- reg_date %>'
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

function getPopupList(){

	$('#pagination').pagination({
		dataSource: '/back/04_home/popup.jsp',
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
