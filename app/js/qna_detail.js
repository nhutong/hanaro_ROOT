$(function(){
    
	// 전역변수 파라미터 20200103	
	nt_no = getParameterByName('nt_no');   // qna번호
    qnaCont(nt_no);
	  
})

//qna 불러오기
function qnaCont(rcvNtNo){
	
		var text = '';

		/* 20200103 nt_no 파라미터 추가 */
		$.ajax({
			url:'/back/04_home/qnaDetail.jsp?random=' + (Math.random()*99999), 
			data : {tel: localStorage.getItem("tel") , vm_cp_no: localStorage.getItem("vm_cp_no"), nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var data = JSON.parse(result);

			data['CompanyList'].forEach(function(item, index){    
				
				text +='<div class="question_wrap">';
				text +='   <div class="question_title_wrap">';
				text +='		<div class="qna_status_wrap">';

				if( item['ref_nt_no'] == ""){
					text +='			<img src="../images/question.png" alt="답변대기">';
					text +='			<span class="qna_done">답변대기</span>';
				}else{
					text +='			<img src="../images/done.png" alt="답변완료">';
					text +='			<span class="qna_done">답변완료</span>';
				}

				text +='			<img src="../images/done.png" alt="답변완료">';
				text +='			<span class="qna_done">답변완료</span>';
				text +='		</div>';
				text +='		<div class="qna_title_wrap">';				
				text +='			 <span class="qna_title">'+item['nt_title']+'</span>';
				text +='		 <span class="qna_date">'+item['reg_date']+'</span>';					
				text +='		</div>';				
				text +='   </div>';
				text +='   <div class="question_cont_wrap">';
				text +='	   <p>'+item['nt_content']+'</p>';
				text +='   </div>';		   
			    text +='</div>';

				/* 문의내용에 답변이 있을 경우, 추가 20200103 */
				if (item['ref_nt_no'] == "")
				{
				}else{
					qnaContRe(item['ref_nt_no']);
				}

			});
			
		$("#question_wrap").empty();
		$("#question_wrap").append(text);

	})

}


//qna 불러오기
function qnaContRe(rcvNtNo){
	
		var text = '';

		$.ajax({
			url:'/back/04_home/qnaRe.jsp?random=' + (Math.random()*99999), 
			data : {ref_nt_no: rcvNtNo },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var data = JSON.parse(result);

			data['CompanyList'].forEach(function(item, index){    

			    text +='<div class="answer_wrap">';
				text +='   <div class="question_title_wrap">';
				text +='		<div class="answer_status_wrap">';
				text +='			<img src="../images/answer.png" alt="답변완료">';				
				text +='		</div>';
				text +='		<div class="qna_title_wrap">';
				text +='			 <span class="qna_title">A.'+item['nt_title']+'</span>';
				text +='		 <span class="qna_date">'+item['reg_date']+'</span>';
				text +='		</div>';		
				text +='   </div>';
				text +='   <div class="question_cont_wrap">';
				text +='	   <p>'+item['nt_content']+'</p>';
				text +='   </div>';
				text +='</div>';
			});
			
		$("#answer_wrap").empty();
		$("#answer_wrap").append(text);

	})

}