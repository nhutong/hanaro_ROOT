// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr data-no="<%- no %>"><td><%- no %></td>' +
	'<td><a href="#" onclick="shop_update(\'<%- no %>\')"><%- name %></a></td><td><%- address1 %></td><td><%- tel %></td>' + 
	'<td><span class="shopUrl" onclick="window.open(\'https://www.nhhanaromart.com/app/home/main.html?vm_cp_no=<%- no %>\',\'_blank\',\'width=414 , height=650, resizable=no, left=500, top=200\'); localStorage.setItem(\'vm_cp_no\',<%- no %>)">http://www.nhhanaromart.com/app/home/main.html?vm_cp_no=<%- no %></span></td>' +
	'<td><%- regDate %></td>' +
	'<% if(delivery === "Y") { %><td class="store_delivery" onclick="delivery()">사용중</td><% } else { %><td>미사용</td><% } %>' +
	'<% if(sales === "Y") { %><td>영업</td><% } else { %><td>휴업</td><% } %>');

$(function () {
	getHeader();
	$(".nav_manage").addClass("active");
	
	getLeft();
	getLeftMenu('manage');
	$("#myplanb_menu_shop").addClass("active");

	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	if(userRoleCd === 'ROLE1'){ 
		// 본사관리자의 경우 등록 버튼 추가
		$('.btn_box2').append('<span class="admin_btn sign_up_menu" onclick="shop_create();">등록</span>');
	}

	// 판매장 수정 (click)
  // https://api.jquery.com/on/, https://api.jquery.com/category/events/event-object/
	$('#tab1_table').on('dblclick', 'tr', function(event) {
		shop_update($(event.currentTarget).attr('data-no'));
	});
	


	// 페이징 표시 (판매장 리스트 조회)
	// https://pagination.js.org/
	$('#pagination').pagination({
		dataSource: '/back/99_manage/shop.jsp',
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
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

	function shop_update(no){
		window.location.href="../manage/shop_update.html?no=" + no;
	} // 운영 - 판매장수정

	