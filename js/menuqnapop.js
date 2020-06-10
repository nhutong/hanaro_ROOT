$(function () {

	nt_no = getParameterByName('nt_no');   // 메뉴번호

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	noticePopup(nt_no);
	noticePopupRe(nt_no);
});

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

			for(var i in jsonResult_notice){

				text +='                <tr class="menuqna_pop_title">';
				text +='					<th>답변제목</th>';
				text +='					<td colspan="6">'+jsonResult_notice[0].nt_title+'</td>';
				text +='				</tr>';
				text +='				<tr class="menuqna_pop_sub">';
				text +='					<td width="15%"></td>';
				text +='					<td width="15%"></td>';
				text +='					<td class="menuqna_pop_sml">답변자</td>';
				text +='					<td>'+jsonResult_notice[0].reg_tel+'</td>';
				text +='					<td class="menuqna_pop_sml">답변일</td>';
				text +='					<td>'+jsonResult_notice[0].reg_date+'</td>';
				text +='				</tr>';
				text +='				<tr class="menuqna_pop_text">';
				text +='				   <td colspan="6">';
				text +='				   <div style="width: 100%;border: 0px;resize: none;" >'+jsonResult_notice[0].nt_content.replace(re,"<br>")+'';
				text +='				   </div>';
				text +='				   </td>';
				text +='			   </tr>';

				// $("#qna_answer").hide();
				// $("#menuqna_pop_btn_wrap").hide();

			}
			
		$("#menuqna_pop_read_table_re").empty();
		$("#menuqna_pop_read_table_re").append(text);

	})

}

// 공지사항 리스트를 불러온다.
function noticeCreate(rcv_nt_no){

	var noticeCreateTitle = encodeURIComponent($("#reTitle").val());
	var noticeCreate = encodeURIComponent($("#menuQna").val());

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
			method : 'GET' 
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

/*판매장 변경시, */
	$("#qnaPopSubmitBtn").on("click",function(e){
		
		e.preventDefault();
		noticeCreate(nt_no);
		
	});