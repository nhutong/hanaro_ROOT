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
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList
			var re=/(\n|\r\n)/g

			for(var i in jsonResult_notice){

				text +='                <tr class="menunotice_pop_title">';
				text +='					<th>제목</th>';
				text +='					<td colspan="5">'+jsonResult_notice[0].nt_title+'</td>';
				text +='				</tr>';
				text +='				<tr class="menunotice_pop_sub">';
				text +='					<td width="10%"></td>';
				text +='					<td width="10%"></td>';
				text +='					<td width="10%" class="menunotice_pop_sml">작성자</td>';
				text +='					<td>'+jsonResult_notice[0].vm_name+'</td>';
				text +='					<td width="10%" class="menunotice_pop_sml">작성일</td>';
				text +='					<td>'+jsonResult_notice[0].reg_date+'</td>';
				text +='				</tr>';
				text +='				<tr class="menunotice_pop_text">';
				text +='				   <td colspan="6">';
				text +='				   <div style="width: 100%;border: 0px;resize: none;" >'+jsonResult_notice[0].nt_content.replace(re,"<br>")+'';
				text +='				   </div>';
				text +='				   </td>';
				text +='			   </tr>';

			}
			
		$("#menunotice_pop_read_table").empty();
		$("#menunotice_pop_read_table").append(text);

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

// 공지사항 리스트를 불러온다.
function noticeUpdate(){

	location.href='menunotice_update.html?nt_no='+nt_no;

}