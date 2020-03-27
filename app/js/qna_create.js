$(function(){
    
	  
})

//qna 불러오기
function qna_create(){

	var qna_title = encodeURIComponent($("#qna_title").val());
	var qna_content = encodeURIComponent($("#qna_content").val());

	if ( qna_title == null || chrLen(qna_title) == 0)
	{
		alert("제목을 입력하시기 바랍니다.");
		return false;
	}

	if ( qna_content == null || chrLen(qna_content) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}

		$.ajax({
			url:'/back/04_home/qnaInsert.jsp?random=' + (Math.random()*99999), 
			data : {tel: localStorage.getItem("tel") , vm_cp_no: localStorage.getItem("vm_cp_no"), title: qna_title, contents: qna_content },
			method : 'GET' 
		}).done(function(result){
			
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);
			alert("문의사항이 등록되었습니다.");
			location.herf="qna.html"
	})

}
