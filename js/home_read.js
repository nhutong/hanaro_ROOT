
var postNo = getParameterByName('no');

$(function () {

	postDetail(postNo);
	postCommentList(postNo);

	$("#post_title_input").hide();
	$("#post_content_textarea").hide();
	$("#actEditBtn").hide();
	$("#notice_fg").hide();

	// 글수정모드로 변경
	$("#readEditBtn").on("click",function(e){

		e.preventDefault();
		$("#post_title").hide();
	    // 200622 김수경 썸머노트 적용 테스트
		// $("#post_content").hide();
		// $("#post_title_input").show();
		// $("#post_content_textarea").show();
		$("#post_content").show();
		$("#post_title_input").show();
	    // 200622 김수경 썸머노트 적용 테스트
		$("#readEditBtn").hide();
		$("#actEditBtn").show();
		$("#readDelBtn").hide();
		$("#home_comment_form").hide();
		
		if (getCookie("userRoleCd") == "ROLE1")
		{
			$("#notice_fg").show();
		}else{
			$("#notice_fg").hide();
		}
		$("#notice_fg").show();

		changeEditMode(postNo);
	});

});

// 글상세를 가져온다
function postDetail(rcvPostNo) {

	$.ajax({
        url:'/back/04_home/postRead.jsp?random=' + (Math.random()*99999), 
        data : {postNo: rcvPostNo},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var vm_no = "";

			var re=/(\n|\r\n)/g

            data['CompanyList'].forEach(function(item, index){                        
				
				$("#vm_name").append(decodeURIComponent(item['vm_name']));
				$("#reg_date").append(decodeURIComponent(item['regDate']));
				$("#post_title").append(decodeURIComponent(item['title']));
				$("#notice_fg").val(decodeURIComponent(item['post_type_cd']));
				$("#post_content").append(decodeURIComponent(item['content']).replace(re,"<br>"));
				vm_no = decodeURIComponent(item['vm_no']);

			});

			if (vm_no == getCookie("userNo"))
			{
				$("#readEditBtn").show();
				$("#readDelBtn").show();
			}else{
				$("#readEditBtn").hide();
				$("#actEditBtn").hide();
				$("#readDelBtn").hide();
			}
			
        }
    });

}

// 댓글을 가져온다
function postCommentList(rcvPostNo) {

	$.ajax({
        url:'/back/04_home/postCommentList.jsp?random=' + (Math.random()*99999), 
        data : {postNo: rcvPostNo},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#home_comment_div").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";
			var re=/(\n|\r\n)/g

            data['CompanyList'].forEach(function(item, index){                        

				text +='<div class="comment_list">';
				text +='	<div class="comment_cont">';
				text +='		<div class="comment_inner_cont">';
				text +='			<div class="commenter_name">'+decodeURIComponent(item['vm_name'])+'</div>';
				text +='			<div class="comment_top">';
				text +='				<div class="commenter_date">'+decodeURIComponent(item['regDate'])+'</div>';
				
				if (decodeURIComponent(item['vm_no']) == getCookie("userNo") )
				{
					text +='				<div class="comment_delete" onclick="deleteCommentOfPost('+decodeURIComponent(item['post_no'])+');">삭제</div>';
				}else{
					text +='				';
				}
				
				
				text +='			</div>';
				text +='		</div>';
				text +='		<div class="commenter_text">'+decodeURIComponent(item['content']).replace(re,"<br>")+'</div>';
				text +='	</div>';
				text +='</div>';

			});
			$("#home_comment_div").empty();
			$("#home_comment_div").append(text);
        }
    });

}

// 댓글 등록
function createCommentOfPost() {

	var post_content = $("#homeComment").val();

	if ( post_content == null || chrLen(post_content) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/04_home/postCreateInsert.jsp?random=' + (Math.random()*99999),
		data : {post_no: postNo, post_content: post_content, reg_no: getCookie("userNo")},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.reload();
        }
    });
}

// 댓글 삭제
function deleteCommentOfPost(rcvPostNo) {

	if(confirm('정말 삭제하시겠습니까??')) {

		$.ajax({
			url:'/back/04_home/postReadDelete.jsp?random=' + (Math.random()*99999),
			data : {post_no: rcvPostNo},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제 완료되었습니다.");
				location.reload();
			}
		});

	} else {
		
	}
}

// 글 삭제
$("#readDelBtn").on("click",function(e){

	e.preventDefault();
	if(confirm('정말 삭제하시겠습니까??')) {

		$.ajax({
			url:'/back/04_home/postReadDelete.jsp?random=' + (Math.random()*99999),
			data : {post_no: postNo},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제 완료되었습니다.");
				opener.location.href="/home/home.html"; 
				self.close();
			}
		});

	} else {
		
	}
});

// 글수정모드로 변경
function changeEditMode(rcvPostNo){

	$.ajax({
        url:'/back/04_home/postRead.jsp?random=' + (Math.random()*99999), 
        data : {postNo: rcvPostNo},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['CompanyList'].forEach(function(item, index){                        
	        	// 200622 김수경 썸머노트 적용 테스트
				$("#post_title_input").val(decodeURIComponent(item['title']));
				// $("#post_content_textarea").append(decodeURIComponent(item['content']));
				$("#post_content").summernote({
					height: 300,                 // 에디터 높이
					minHeight: null,             // 최소 높이
					maxHeight: null,             // 최대 높이
					focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
					lang: "ko-KR",					// 한글 설정
			});;
				// 200622 김수경 썸머노트 적용 테스트	
			});
		}
			});
		}

// 글 수정
$("#actEditBtn").on("click",function(e){

	var postTitle = $("#post_title_input").val();
	 // 200622 김수경 썸머노트 적용 테스트
	// var postContent = $("#post_content_textarea").val();
	var postContent = $("#post_content").summernote('code');
	$("#post_content").summernote('destroy');
	// 200622 김수경 썸머노트 적용 테스트

	var noticeFg = $("#notice_fg").val();

	if ( postTitle == null || chrLen(postTitle) == 0)
	{
		alert("제목을 입력하시기 바랍니다.");
		return false;
	}

	if ( postContent == null || chrLen(postContent) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}

	e.preventDefault();
	if(confirm('수정하시겠습니까??')) {

		$.ajax({
			url:'/back/04_home/postReadUpdate.jsp?random=' + (Math.random()*99999),
			data : {post_no: postNo, post_title: postTitle, post_content: postContent, notice_fg: noticeFg },
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("수정 완료되었습니다.");
				opener.location.reload(true); 
				self.close();
			}
		});

	} else {
		
	}
});
