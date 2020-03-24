// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr id="stamp<%- stamp_no %>" data-no="<%- stamp_no %>">'+
	'<td><%- stamp_no %></td>' +
	'<td><a href="stamp_edit.html?stamp_no=<%- stamp_no %>" ><%- company_name %></a></td>' +
	'<td><%- status_name %></td>' +	
	'<td><%- start_date %> ~ <%- end_date %></td>' +
	'<td><%- min_price %></td>' +
	'<td><%- reg_name %> </td>' +
	'<td><%- reg_date %> </td>' 
	);

$(function () {
	getHeader();
	$(".nav_event").addClass("active");

	getLeft();
	getLeftMenu('event');
	$("#nh_event_stamp").addClass("active");

	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	if(userRoleCd === 'ROLE1'){
	
	}	

	getStampList();
});

function getStampList(){

	$('#pagination').pagination({
		dataSource: '/back/05_event/stamp.jsp',
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			console.log(list);
			var $tbody = $('#stampList').empty();
			_.forEach(list,
				function(item) {
					$tbody.append(tpl_tr_tab1_table(item));
				}
			);
		},
		formatAjaxError: function(jqXHR) {
			alert(jqXHR.responseJSON.error);
//			window.history.back();

			deleteAllCookies();
			login();
		}
	});
}
