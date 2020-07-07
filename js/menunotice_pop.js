$(function () {

	nt_no = getParameterByName('nt_no');   // 메뉴번호

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	noticePopup(nt_no);
});

function noticePopup(rcvNtNo){
	
		var text = '';
		
		$.ajax({
			url:'/back/04_home/noticeDetail.jsp?random=' + (Math.random()*99999),
			data : {nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		// console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList[0];
			var re=/(\n|\r\n)/g;
			$(".reWriteTitle").html(jsonResult_notice.nt_title);
			$("#reWriteTitle").val(jsonResult_notice.nt_title);
			$(".reWriteBody").html(jsonResult_notice.nt_content.replace(re,"<br>"));
			$("#writePeople").html(jsonResult_notice.vm_name);
			$("#writeDate").html(jsonResult_notice.reg_date);

			// for(var i in jsonResult_notice){
			// 	text +='                <tr class="menunotice_pop_title">';
			// 	text +='					<th>제목</th>';
			// 	text +='					<td colspan="5"><div class="reWriteTitle">'+jsonResult_notice[0].nt_title+'</div></td>';
			// 	text +='				</tr>';
			// 	text +='				<tr class="menunotice_pop_sub">';
			// 	text +='					<td width="10%"></td>';
			// 	text +='					<td width="10%"></td>';
			// 	text +='					<td width="10%" class="menunotice_pop_sml">작성자</td>';
			// 	text +='					<td>'+jsonResult_notice[0].vm_name+'</td>';
			// 	text +='					<td width="10%" class="menunotice_pop_sml">작성일</td>';
			// 	text +='					<td>'+jsonResult_notice[0].reg_date+'</td>';
			// 	text +='				</tr>';
			// 	text +='				<tr class="menunotice_pop_text">';
			// 	text +='				   <td colspan="6">';
			// 	text +='				   <div style="width: 100%;border: 0px;resize: none;" class="reWriteBody" >'+jsonResult_notice[0].nt_content.replace(re,"<br>")+'';
			// 	text +='				   </div>';
			// 	text +='				   </td>';
			// 	text +='			   </tr>';
			// }
			
		// $("#menunotice_pop_read_table").empty();
		// $("#menunotice_pop_read_table").append(text);

	})

}

function noticeDel(){

		if (confirm("정말 삭제하시겠습니까??") == true){
		$.ajax({
			url:'/back/04_home/noticeDel.jsp?random=' + (Math.random()*99999),
			data : {nt_no: nt_no},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제 완료되었습니다.");
				opener.location.reload(true);
				window.close();	
			}
		});

	}else{   //취소
		return;
	}

}
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
// 공지사항 리스트를 불러온다.
function noticeUpdate(){

	// location.href='menunotice_update.html?nt_no='+nt_no;
	$("#noticePopEditBtnAfter").css("display", "inline");
	$("#noticePopEditBtn").css("display", "none");
	changeEditMode(nt_no);
}
function getByte(str) {
	var byte = 0;
	for (var i=0; i<str.length; ++i) {
		// 기본 한글 2바이트 처리
		(str.charCodeAt(i) > 127) ? byte += 2 : byte++ ;
	}
	return byte;
}
function changeEditMode(rcvNtNo) {
	$.ajax({
		url:'/back/04_home/noticeDetail.jsp?random=' + (Math.random()*99999),
		data : {nt_no: rcvNtNo },
		method : 'GET' 
	}).done(function(result){
		var jsonResult = JSON.parse(result);
		var jsonResult_notice = jsonResult.CompanyList
		// $(".reWriteTitle").val(jsonResult_notice[0].nt_title);
		$("#textCounting").css('display', 'block');
		$(".reWriteTitle").css('display', 'none');
		$("#reWriteTitle").css('display', 'block');
		// $("#noticeCreate").val(jsonResult_notice[0].nt_content);
		$(".reWriteBody").summernote({
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
					document.getElementById("countTxt").innerHTML = " ( " + textc + " / 2048 ) ";
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

function noticeUpdateAfter(){

	var noticeCreateTitle = encodeURIComponent($("#reWriteTitle").val());
	var brVal = $(".reWriteBody").summernote('code');
	$(".reWriteBody").summernote('destroy');
	// var brVal = $(".reWriteBody").val();
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
				// opener.location.reload(true);
				 // window.close();		
			}
		})

}