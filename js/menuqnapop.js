$(function () {

	nt_no = getParameterByName('nt_no');   // 메뉴번호

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	noticePopup(nt_no);
	noticePopupRe(nt_no);
});
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
function getByte(str) {
	var byte = 0;
	for (var i=0; i<str.length; ++i) {
		// 기본 한글 2바이트 처리
		(str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
	}
	return byte;
}
function changeEditMode() {
	const rcvNtNo = nt_no;
	$.ajax({
		url:'/back/04_home/manageQnaDetail.jsp?random=' + (Math.random()*99999),
		data : {nt_no: rcvNtNo },
		method : 'GET' 
	}).done(function(result){
		var jsonResult = JSON.parse(result);
		var jsonResult_qna = jsonResult.CompanyList
		$("#textCounting").css('display', 'block');
		$("#nt_titleQna").css('display', 'none');
		$("#nt_titleQna_re").css('display', 'block');
		$("#qnaPopModifyBtn").css('display', 'none');
		$("#qnaPopSubmitBtn").css('display', 'inline');
		$("#nt_contentQna").summernote({
			height: 300,                 // 에디터 높이
			minHeight: null,             // 최소 높이
			maxHeight: null,             // 최대 높이
			focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
			lang: "ko-KR",
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
					document.getElementById("countTxt").innerHTML = " ( " + textc + " / 2048 ) ";;
					if (textc > 2048) {
						alert("글자 수가 초과하였습니다.");
						return false;
					}
				}
			}
		});
		const textc = getByte(document.querySelector("div.note-editable").outerText);
		document.getElementById("countTxt").innerHTML = textc;
	})
}
function noticePopup(rcvNtNo){
	
		var text = '';
		
		$.ajax({
			url:'/back/04_home/manageQnaDetail.jsp?random=' + (Math.random()*99999),
			data : {nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList

			var re=/(\n|\r\n)/g

			for(var i in jsonResult_notice){

				text +='                <tr class="menuqna_pop_title">';
				text +='					<th>제목</th>';
				text +='					<td colspan="7">'+jsonResult_notice[0].nt_title+'</td>';
				text +='				</tr>';
				text +='				<tr class="menuqna_pop_sub">';
				// text +='					<td width="15%"></td>';
				// text +='					<td width="15%"></td>';
				text +='					<td class="menuqna_pop_sml">작성자</td>';
				text +='					<td colspan="1">'+jsonResult_notice[0].reg_tel+'</td>';
				text +='					<td class="menuqna_pop_sml">작성일</td>';
				text +='					<td colspan="2">'+jsonResult_notice[0].reg_date+'</td>';

				// 회원 연락처 추가 20200610 김중백
				text +='					<td class="menuqna_pop_sml">연락처</td>';
				text +='					<td colspan="2">'+jsonResult_notice[0].mem_tel+'</td>';
				text +='				</tr>';
				text +='				<tr class="menuqna_pop_text">';
				text +='				   <td colspan="8">';
				text +='				   <div style="width: 100%;border: 0px;resize: none;" >'+jsonResult_notice[0].nt_content.replace(re,"<br>")+'';
				text +='				   </div>';
				text +='				   </td>';
				text +='			   </tr>';

			}
			
		$("#menuqna_pop_read_table").empty();
		$("#menuqna_pop_read_table").append(text);

	})

}

function noticePopupRe(rcvNtNo){
	
		var text = '';
		
		$.ajax({
			url:'/back/04_home/manageQnaReDetail.jsp?random=' + (Math.random()*99999),
			data : {nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList

			var re=/(\n|\r\n)/g
			$("#nt_titleQna").html(jsonResult_notice[0].nt_title);
			$("#nt_titleQna_re").val(jsonResult_notice[0].nt_title);
			$("#reg_telQna").html(jsonResult_notice[0].reg_tel);
			$("#reg_dateQna").html(jsonResult_notice[0].reg_date);
			$("#nt_contentQna").html(jsonResult_notice[0].nt_content.replace(re,"<br>"));
		// 	for(var i in jsonResult_notice){

		// 		text +='                <tr class="menuqna_pop_title">';
		// 		text +='					<th>답변제목</th>';
		// 		text +='					<td colspan="6">'+jsonResult_notice[0].nt_title+'</td>';
		// 		text +='				</tr>';
		// 		text +='				<tr class="menuqna_pop_sub">';
		// 		text +='					<td width="15%"></td>';
		// 		text +='					<td width="15%"></td>';
		// 		text +='					<td class="menuqna_pop_sml">답변자</td>';
		// 		text +='					<td>'+jsonResult_notice[0].reg_tel+'</td>';
		// 		text +='					<td class="menuqna_pop_sml">답변일</td>';
		// 		text +='					<td>'+jsonResult_notice[0].reg_date+'</td>';
		// 		text +='				</tr>';
		// 		text +='				<tr class="menuqna_pop_text">';
		// 		text +='				   <td colspan="6">';
		// 		text +='				   <div style="width: 100%;border: 0px;resize: none;" >'+jsonResult_notice[0].nt_content.replace(re,"<br>")+'';
		// 		text +='				   </div>';
		// 		text +='				   </td>';
		// 		text +='			   </tr>';

		// 		$("#qna_answer").hide();
		// 		$("#menuqna_pop_btn_wrap").hide();

		// 	}
			
		// $("#menuqna_pop_read_table_re").empty();
		// $("#menuqna_pop_read_table_re").append(text);

	})

}

function editFormQna () {
	console.log('수정');
}

// 공지사항 리스트를 불러온다.
function noticeCreate(rcv_nt_no){

	var noticeCreateTitle = encodeURIComponent($("#nt_titleQna_re").val());
	var brVal = $("#nt_contentQna").summernote('code');
	$("#nt_contentQna").summernote('destroy');
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
			url:'/back/04_home/manageQnaReInsert.jsp?random=' + (Math.random()*99999),
			data : {rcvTitle: noticeCreateTitle, rcvContent: noticeCreate, vm_cp_no: getCookie("onSelectCompanyNo"), userNo: getCookie("userNo"), nt_no: rcv_nt_no },
			method : 'POST' 
		}).done(function(result){
			if(result == "NoN"){
				console.log(result);	
			}else{
				console.log(result);
				$("#textCounting").css("display", "none");
				$("#qnaPopSubmitBtn").css("display", "none");
				$("#qnaPopModifyBtn").css("display", "inline");
				// opener.location.reload(true);
				// window.close();
			}
		})

}

/*판매장 변경시, */
	$("#qnaPopSubmitBtn").on("click",function(e){
		
		e.preventDefault();
		noticeCreate(nt_no);
		
	});