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
