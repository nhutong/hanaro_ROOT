$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111

	getLeft();
	$(".nav_home").addClass("active");

	getLeftMenu('home');
	$("#nh_home_home").addClass("active");
	
	getHeader();
	$(".nav_home").addClass("active");

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
//			getNoticeList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
			document.getElementById("nh_main").src = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
		}
	});
	
	$("#searchKeyword").keypress(function (e) {
        if (e.which == 13){
                   home_post_search();  // 실행할 이벤트
        }
    });

	// 페이징 표시 (관리자 게시판 리스트 조회)
	// https://pagination.js.org/
	$('#pagination').pagination({
		dataSource: '/back/04_home/post.jsp',
		ajax: function() {
			return {
				data: {
					searchKeyword: $('#searchKeyword').val()
				}
			};
		},
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			var $tbody = $('#tab1_table').empty();

			_.forEach(list,
				function(item) {console.log(item);
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

// 관리자 게시판 템플릿
var tpl_tr_tab1_table = _.template('<tr data-no="<%- no %>">' +
	'<% if(postTypeCd === "NOTICE") { %><td class="board_notice">공지</td><% } else { %><td><%- no %></td><% } %>' +
	'<% if(postStatusCd === "DELETED") { %><td><%- title %></td><% } else { %><td><a href="#" onclick="home_post_popup(\'<%- no %>\', \'<%- refCpNo %>\')"><%- title %></a></td><% } %>' +
	'<td><%- regName %></td><td><%- regDate %></td><td><%- viewCount %></td></tr>');

// 게시물 등록 폼 템플릿
var tpl_create_post_form = _.template('<form><table>' +
	'<tr><td>제목</td><td><input type="text" name="title"></td></tr>' +
  '<tr><td>내용</td><td><textarea name="content" cols="30" rows="5"></textarea></td></tr>' +
	'<tr><td></td><td><button type="button" onclick="canclePost()">취소</button><button type="button" onclick="createPost()">등록</button></td></tr></tbody></table></form>');

// 게시물 검색 (검색키워드로 다시 조회)
function home_post_search() {
	var $pagination = $('#pagination')
	// $pagination.pagination('go', $pagination.pagination('getSelectedPageNum')); // 현재 페이지 다시 조회
	$pagination.pagination('go', 1); // 첫 페이지 다시 조회
}

function home_post_create() {
	$('#home_post_wrap')
		.empty()
		.append(tpl_create_post_form());
		
	$('#home_post_wrap form')
		.validate({
			rules: {
				title: {
					required: true,
					maxlength: 128
				},
				content: {
					required: true
				}
			}
		});
}

// 게시물 등록취소
function canclePost(){
    $('#home_post_wrap').empty();
}

// 게시물 등록
var creatingPost = false;
function createPost() {
	if(creatingPost) { // 중복방지
		return;
	}

	// 등록 비활성화
	creatingPost = true;

	var $form = $('#home_post_wrap form');

	// 입력값 검증
	// https://jqueryvalidation.org/valid/
	if(!$form.valid()) {
		// 등록 활성화
		creatingPost = false;
		return;
	}

	$.ajax({
		url: '/back/04_home/postCreateInsert.jsp',
		method: 'POST',
		data: {
//			refCpNo: $('#refCpNo').val(),
			refCpNo: getCookie("onSelectCompanyNo"),
			postTypeCd: $('#postTypeCd').val(),
			title: $form.find('[name=title]').val(),
			content: $form.find('[name=content]').val()
		}
	})
	.done(function(data){
		if(data.insert) {
			home();
		} else {
			// 메시지 TO-DO

			// 등록 활성화
			creatingPost = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 등록 활성화
		creatingPost = false;
	});
}

// 게시물 읽기 팝업
function home_post_popup(no, refCpNo){
	var popupX = (window.screen.width/2) - (400/2);
//   window.open('home_read.html?no=' + no + '&refCpNo=' + refCpNo,'관리자 게시판 읽기','width=440,height=600,location=no,status=no,scrollbars=yes,left='+ popupX +',top=200')
   window.open('home_read.html?no=' + no + '&refCpNo=' + refCpNo,'관리자 게시판 읽기','width=440,height=600,location=no,status=no,scrollbars=yes,left='+ popupX +',top=200')
}


