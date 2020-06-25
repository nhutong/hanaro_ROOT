$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111////
	var searchTextbox = getParameterByName('searchText');
	if (searchTextbox == "undefined")
	{
		searchTextbox = "";
	}

	if (searchTextbox == "" )
	{
	}else{
	   $("#searchTextbox").val(searchTextbox);
	}

	var pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
	    pageNo = 1;
	}

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
//			prodList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
			document.getElementById("nh_main").src = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
		}
	});
	
	$("#searchKeyword").keypress(function (e) {
        if (e.which == 13){
			prodList(1, $("#searchKeyword").val());
			// prodList_paging(1, $("#searchKeyword").val());
        }
    });

	prodList(pageNo, searchTextbox);
	// prodList_paging(pageNo, searchTextbox);

});

// 관리자 게시판 게시물 리스트를 가져온다
function prodList(rcvPageNo, rcvSearchText = "") {

	$.ajax({
        url:'/back/04_home/postList.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText},
        method : 'GET' 
    }).done(function(result){

        console.log("postlist=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#tab1_table").html("");
            console.log("============= postlist callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        

				text +='<tr>';
				text +='	<td width="10%" style="text-align:center;">'+decodeURIComponent(item['post_no'])+'</td>';
                text +='    <td width="45%" onclick="home_post_popup('+decodeURIComponent(item['post_no'])+');">'+decodeURIComponent(item['title'])+'</td>';
                text +='    <td width="15%" style="text-align:center;">'+decodeURIComponent(item['vm_name'])+'</td>';
                text +='    <td width="20%" style="text-align:center;">'+decodeURIComponent(item['regDate'])+'</td>';
                text +='    <td width="10%" style="text-align:center;">'+decodeURIComponent(item['view_count'])+'</td>';
                text +='</tr>';

			});
			$("#tab1_table").empty();
			$("#tab1_table").append(text);
		}
		prodList_paging(rcvPageNo, rcvSearchText);
    });

}

// 게시물 읽기 팝업
function home_post_popup(no){
	var popupX = (window.screen.width/2) - (400/2);
	window.open('home_read.html?no=' + no,'관리자 게시판 읽기','width=800,height=800,location=no,status=no,scrollbars=yes,left='+ popupX +',top=200')
}

function home_post_create() {
	if (getCookie("userRoleCd") != "ROLE1")
	{
		$("#notice_fg").hide();
	}
}
	// 200622 김수경 썸머노트 적용 테스트
	$('#post_content').summernote({
		height: 300,                 // 에디터 높이
		minHeight: null,             // 최소 높이
		maxHeight: null,             // 최대 높이
		focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
		lang: "ko-KR",					// 한글 설정
		placeholder: '최대 2048자까지 쓸 수 있습니다',	//placeholder 설정
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontsize', ['fontsize']],
			['fontname', ['fontname']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['table', ['table']],
			['insert', ['link', 'picture', 'video']],
			['view', ['fullscreen', 'codeview', 'help']],
		  ],			
		callbacks: { // 콜백을 사용
			// 이미지를 업로드할 경우 이벤트를 발생
			onImageUpload: function(files, editor, welEditable) {
				sendFile(files[0], this);
			}
		}
	});
	
  /* summernote에서 이미지 업로드시 실행할 함수 */
			function sendFile(file, editor) {
				// 파일 전송을 위한 폼생성
				 data = new FormData();
				 data.append("uploadFile", file);
				 $.ajax({ // ajax를 통해 파일 업로드 처리
					 data : data,
					 type : "POST",
					 url : "../back/00_include/summernote_imageUpload.jsp",
					 cache : false,
					 contentType : false,
					 processData : false,
					 success : function(data) { // 처리가 성공할 경우
						// 에디터에 이미지 출력
						 $(editor).summernote('editor.insertImage', data.url);
						}
					});
				}
  	// 200622 김수경 썸머노트 적용 테스트

// 게시물 등록취소
function canclePost(){
    document.getElementById('home_post_wrap').style.display = "none";
}

// 게시물 등록
function createPost() {
	var post_title = $("#post_title").val();
	var post_content = $("#post_content").val();
	var notice_fg = $("#notice_fg").val();

	if ( post_title == null || chrLen(post_title) == 0)
	{
		alert("제목을 입력하시기 바랍니다.");
		return false;
	}

	if ( post_content == null || chrLen(post_content) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}
		if ( post_content == null || chrLen(post_content) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}


	$.ajax({
        url:'/back/04_home/postInsert.jsp?random=' + (Math.random()*99999),
		data : {post_title: post_title, post_content: post_content, reg_no: getCookie("userNo"), noticeFg: notice_fg},
        method : 'GET' 
    }).done(function(result){

        console.log("postinsert=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= postinsert callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			home();
        }
    });
}

// 상품리스트 페이징를 가져온다
function prodList_paging(rcvPageNo, rcvSearchText) {

	$.ajax({
        url:'/back/04_home/postList_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText},
        method : 'GET' 
    }).done(function(result){

        console.log("prodlist_paging=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            console.log("============= prodlist_paging callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 6;
			var next_no = parseInt(rcvPageNo) + 6;

			var text = "";

           if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -5)
			{
			}else if(total_paging_cnt < 5 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" href="home.html?pageNo=1&searchText=">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" href="home.html?pageNo='+pre_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				const className = (parseInt(rcvPageNo) == k) ? "page-item active" : "page-item";
				text += '<li class="'+className+'"><a class="page-link" onclick="prodList('+k+')" href="javascript:void(0);">'+k+'</a></li>';
				// if (parseInt(rcvPageNo) == k)
				// {
				// 	text += '<li class="page-item active"><a class="page-link" href="home.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				// }else{
				// 	text += '<li class="page-item"><a class="page-link" href="home.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				// }
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				text += '<li class="page-item"><a class="page-link" href="home.html?pageNo='+next_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}
