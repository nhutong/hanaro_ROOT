$(function () {

	nt_no = getParameterByName('nt_no');   // 메뉴번호

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	noticePopup(nt_no);
});
// 200622 김수경 썸머노트 적용 테스트
function getByte(str) {
	var byte = 0;
	for (var i=0; i<str.length; ++i) {
		// 기본 한글 2바이트 처리
		(str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
	}
	return byte;
}
$('#noticeCreate').summernote({
	height: 300,                 // 에디터 높이
	minHeight: null,             // 최소 높이
	maxHeight: null,             // 최대 높이
	focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
	lang: "ko-KR",					// 한글 설정
	placeholder: '여기에 내용을 입력하세요',	//placeholder 설정
	fontNames: ['Noto Sans KR', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'sans-serif'],
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
		},
		onKeyup: function(e) {
			const textc = getByte(document.querySelector("div.note-editable").outerText);
			//document.getElementById("textCountingSpan").innerHTML = textc;
			if (textc > 2048) {
				alert("글자 수가 초과하였습니다.");
				return false;
			}
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

function noticePopup(rcvNtNo){
	
		$.ajax({
			url:'/back/04_home/noticeDetail.jsp?random=' + (Math.random()*99999),
			data : {nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList

			for(var i in jsonResult_notice){

				$("#noticeCreateTitle").val(jsonResult_notice[0].nt_title);
				// $("#noticeCreate").val(jsonResult_notice[0].nt_content);
				$("#noticeCreate").summernote({
					height: 300,                 // 에디터 높이
					minHeight: null,             // 최소 높이
					maxHeight: null,             // 최대 높이
					focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
					lang: "ko-KR",					// 한글 설정
				});
			}
	})

}

// 공지사항 리스트를 불러온다.
function noticeUpdate(){

	var noticeCreateTitle = encodeURIComponent($("#noticeCreateTitle").val());
	var brVal = $("#noticeCreate").val();
	var brValResult = brVal.replace(/\n/g, "<br/>");
	var noticeCreate = encodeURIComponent(brValResult);

	if ( noticeCreateTitle == null || chrLen(noticeCreateTitle) == 0)
	{
		alert("제목을 입력하시기 바랍니다.");
		return false;
	}
	
	if ( noticeCreate == null || chrLen(noticeCreate) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}	

		$.ajax({
			url:'/back/04_home/noticeUpdate.jsp?random=' + (Math.random()*99999),
			data : {rcvTitle: noticeCreateTitle, rcvContent: noticeCreate, nt_no: nt_no, userNo: getCookie("userNo") },
			method : 'POST' 
		}).done(function(result){
			if(result == "NoN"){
				console.log(result);	
			}else{
				console.log(result);
				opener.location.reload(true);
				window.close();		
			}
		})

}