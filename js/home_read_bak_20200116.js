var userNo = Number(getCookie('userNo'));
var userRoleCd = getCookie('userRoleCd');

// 게시물 템플릿
var tpl_post_trs = _.template('<tr class="home_read_title"><th>제목</th><td colspan="6"><%- title %></td></tr>' +
	'<tr class="home_read_sub"><td width="20%"></td><td width="20%"></td>' +
	'<td class="home_read_sml">작성자</td><td><%- regName %></td><td class="home_read_sml">작성일</td><td><%- regDate %></td></tr>' +
	'<tr class="home_read_text"><td colspan="6"><div style="width: 100%;border: 0px;resize: none;" ><%- content %></div></td></tr>');

// 게시물 수정폼 템플릿
var tpl_post_trs_for_edit = _.template('<tr class="home_read_title"><th>제목</th><td colspan="5"><input type="text" name="title" value="<%- title %>" style="width: 100%;"></td></tr>' +
	'<tr class="home_read_sub"><td width="20%"></td><td width="20%"></td>' +
	'<td>작성자</td><td><%- regName %></td><td>작성일</td><td><%- regDate %></td></tr>' +
	'<tr><td colspan="6"><textarea name="content" cols="30" rows="10" style="width: 100%;border: 0px;resize: none;" ><%- content %></textarea></td><tr>' +
	'<tr><td colspan="2"><input type="hidden" name="refCpNo" value="<%- refCpNo %>">' +
	'<% if(userRoleCd === "ROLE1") { %><select name="postTypeCd" style="margin-right: 5px;">' +
	'<option value="POST" <% if(postTypeCd === "POST") { %>selected<% } %>>게시물</option>' +
	'<option value="NOTICE" <% if(postTypeCd === "NOTICE") { %>selected<% } %>>공지</option>' +
	'</select><% } else { %><input type="hidden" name="postTypeCd" value="<%- postTypeCd %>"><% } %></td>' +
	'<td colspan="4" style="text-align: right;"><button type="button" onclick="cancelUpdatePost()" style="background-color: #a0a0a0;margin-right: 5px;font-size: 13px;color: #fff;border: none;box-shadow: 0;padding: 5px;border-radius: 5px;">취소</button>' +
	'<button type="button" onclick="updatePost()" style="background-color: #00b140;font-size: 13px;color: #fff;border: none;box-shadow: 0;padding: 5px;border-radius: 5px;">수정</button></td></tr>');


// 댓글 템플릿
var tpl_comment_divs = _.template('<div class="comment_list"><div class="comment_cont">' +
  '<div class="comment_inner_cont"><div class="commenter_name"><%- regName %></div>' +
	'<div class="comment_top"><div class="commenter_date"><%- regDate %></div>' +
	'<% if(userNo === regNo || userRoleCd === "ROLE1") { %><div class="comment_delete" onclick="deleteCommentOfPost(\'<%- no %>\', \'<%- refCpNo %>\')">삭제</div><% } %>' +
	'</div></div><div class="commenter_text"><%- content %></div></div></div>');

$(function () {


	// 관리자 게시판 게시물, 댓글 및 데이터 조회
	$.ajax({
		url: '/back/04_home/postRead.jsp?no=' + getParameterByName('no') + '&refCpNo=' + getParameterByName('refCpNo'),
		method: 'GET' 
	})
	.done(function(results){
		var $table = $('#home_read_table');
		var $edit = $('#readEditBtn');

		// 게시물 (공지, 일반 게시물)
		$table
			.empty()
			.append(tpl_post_trs(results.post))
			.data('post', results.post); // 수정폼으로 전환을 위해서 데이터 저장 : https://api.jquery.com/data/

		if(userNo === results.post.regNo || userRoleCd === "ROLE1") {
			// 게시물 수정 (더블click)
		   //https://api.jquery.com/on/, https://api.jquery.com/off/, https://api.jquery.com/category/events/event-object/
			//$edit.on('click', 'tr', function(event) {
				//var $t = $('#home_read_table');
				//var data = $t.data('post'); // 수정폼으로 전환을 위해서 데이터 조회 : https://api.jquery.com/data/
				//$tf
					//.off('dblclick', 'tr')
					//.empty()
                    //.empty("#home_comment_div")
					//.append(tpl_post_trs_for_edit(data));
			//});
            
            // 게시물 수정 (수정버튼)
            $edit.on('click', function(){
               var $table1 = $('#home_read_table');
                var data = $table1.data('post');
                
                $table1
				  .on('click')
				  .empty()
				  .append(tpl_post_trs_for_edit(data));

            })

			// 게시물 수정 입력값 검증 설정
			// https://jqueryvalidation.org/validate/
			$('#home_post_form').validate({
				rules: {
					title: {
						required: true
					},
					content: {
						required: true
					}
				}
			});			
		}

		// 댓글
		var $comment_div = $('#home_comment_div').empty();
		_.forEach(results.comments,
			function(comment) {
				$comment_div.append(tpl_comment_divs(comment));
			}
		);
	})
	.fail(function(jqXHR){
		alert(jqXHR.responseJSON.error);
		window.close();
	})
	.always(function(){
		// 댓글 등록 입력값 검증 설정
		// https://jqueryvalidation.org/validate/
		$('#home_comment_form').validate({
			rules: {
				commentContent: {
					required: true
				}
			}
		});
	});

});

// 댓글 등록
var creatingComment = false;
function createCommentOfPost() {
	if(creatingComment) { // 중복방지
		return;
	}

	// 등록 비활성화
	creatingComment = true;

	var $form = $('#home_comment_form');

	// 입력값 검증
	// https://jqueryvalidation.org/valid/
	if(!$form.valid()) {
		// 등록 활성화
		creatingComment = false;
		return;
	}

	$.ajax({
		url: '/back/04_home/postCreateInsert.jsp',
		method: 'POST',
		data: {
			refPostNo: getParameterByName('no'),
			refCpNo: getParameterByName('refCpNo'),
			postTypeCd: 'COMMENT',
			content: $('#homeComment').val()
		}
	})
	.done(function(data){
		if(data.insert) {
			location.reload();
		} else {
			// 메시지 TO-DO

			// 등록 활성화
			creatingComment = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 등록 활성화
		creatingComment = false;
	});
}

// 댓글 삭제
var deletingComment = false;
function deleteCommentOfPost(no, refCpNo) {
	if(deletingComment) { // 중복방지
		return;
	}

	// 삭제 비활성화
	deletingComment = true;

	if(confirm('정말 삭제하시겠습니까??')) {

	} else {
		// 삭제 활성화
		deletingComment = false;
		return;
	}

	$.ajax({
		url: '/back/04_home/postReadDelete.jsp',
		method: 'POST',
		data: {
			no: no,
			refPostNo: getParameterByName('no'),
			refCpNo: refCpNo,
			postTypeCd: 'COMMENT'
		}
	})
	.done(function(data){
		if(data.delete == 1) {
			location.reload();
		} else {
			// 메시지 TO-DO

			// 삭제 활성화
			deletingComment = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 삭제 활성화
		deletingComment = false;
	});
}

function cancelUpdatePost() {
	location.reload();
}

// 게시물 수정
var updatingPost = false;
function updatePost() {
	if(updatingPost) { // 중복방지
		return;
	}

	// 수정 비활성화
	updatingPost = true;

	var $form = $('#home_post_form');

	// 입력값 검증
	// https://jqueryvalidation.org/valid/
	if(!$form.valid()) {
		// 수정 활성화
		updatingPost = false;
		return;
	}

	$.ajax({
		url: '/back/04_home/postReadUpdate.jsp',
		method: 'POST',
		data: {
			no: getParameterByName('no'),
			refCpNo: $form.find('[name=refCpNo]').val(),
			postTypeCd: $form.find('[name=postTypeCd]').val(),
			title: $form.find('[name=title]').val(),
			content: $form.find('[name=content]').val()
		}
	})
	.done(function(data){
		if(data.update == 1) {
			location.reload();
		} else {
			// 메시지 TO-DO

			// 수정 활성화
			updatingPost = false;
		}
	})
	.fail(function(){
		// 메시지 TO-DO

		// 수정 활성화
		updatingPost = false;
	});
}
