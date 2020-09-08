// 관리자 템플릿
var tpl_tr_tab1_table = _.template('<tr data-no="<%- no %>">' +
	'<td><a href="#" onclick="manage_edit(\'<%- no %>\')"><%- empNo %></a></td>' + 
	'<td><%- cellphone %></td><td><%- company %></td><td><%- name %></td><td><%- role %></td><td><%- status %></td><td><%- lastDate %></td><td><%- regDate %></td></tr>');

$(function () {
	getHeader();

	getLeft();
  $(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_manage").addClass("active");

	// 관리자 수정 (click)
  // https://api.jquery.com/on/, https://api.jquery.com/category/events/event-object/
	$('#tab1_table').on('dblclick', 'tr', function(event) {
		manage_edit($(event.currentTarget).attr('data-no'));
	});

	// 페이징 표시 (관리자 리스트 조회)
	// https://pagination.js.org/
	$('#pagination').pagination({
		dataSource: '/back/99_manage/manage.jsp',
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 15,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
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
});

function manage_edit(no){window.location.href="../manage/manage_edit.html?no=" + no;} // 운영 - 사용자수정