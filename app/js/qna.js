$(function(){
    
    qnaCont();

    
})

//qna 불러오기
function qnaCont(){
	
		var text = '';

		$.ajax({
			url:'/back/04_home/qna.jsp?random=' + (Math.random()*99999), 
			data : {tel: localStorage.getItem("tel") , vm_cp_no: localStorage.getItem("vm_cp_no") },
			method : 'GET' 
		}).done(function(result){
			
			if (result == "NoN")
			{
                text +='<div class="qna_no_cont">';
                text +='문의 내역이 없습니다.';
                text +='</div>';
                
                $(".qna_wrap").css("background-color","transparent");
                $(".qna_wrap").css("border","0");
                
			}else{            
            
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var data = JSON.parse(result);

			data['CompanyList'].forEach(function(item, index){    
				
                text +='<li class="qna_inner_wrap" onclick="qna_detail('+item['nt_no']+');">';
                text +='   <div class="qna_status_wrap">';
                // 답변완료
                if (item['ref_nt_no'] != "")
				{
					text +='        <img src="../images/done.png" alt="답변완료">';
                    text +='        <span class="qna_done">답변완료</span>';
				// 답변 대기 중
				}else{
					text +='        <img src="../images/question.png" alt="답변대기">';
                    text +='        <span class="qna_done">답변대기</span>';
				}
                text +='    </div>';
                text +='    <div class="qna_title_wrap">';
                text +='       <span class="qna_title">'+item['nt_title']+'</span>';
                text +='       <span class="qna_date">'+item['reg_date']+'</span>';

				text +='      <img src="../images/go.png" alt="자세히보기">';
            
                text +='  </div>';
                text +='</li>';
			});
        }

		$("#qnaCont").empty();
		$("#qnaCont").append(text);

	})

}