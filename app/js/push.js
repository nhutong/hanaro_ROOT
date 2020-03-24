$(function(){
	
    // getShare();
    pushCont();
})


// 푸시 리스트를 불러온다.
function pushCont(){
	
		var text = '';

		$.ajax({
			url:'http://www.it7.kr:8080/back/04_home/push.jsp?random=' + (Math.random()*99999),
			data : {userCompanyNo: localStorage.getItem("vm_cp_no"), memberNo: localStorage.getItem("memberNo")}, 
			method : 'GET' 
		}).done(function(result){
			
			if (result == "NoN"){

				//push cont 내부 li가 없을 때 보더 숨기고 문의내역이 없다는 내용 붙이기
				 var pushEmpty = $("#pushContWrap").children("li").length;
				 if(pushEmpty == 0){
				 	$("#push_list").hide();
				 	$("#push_list").after("<div class='qna_no_cont'>알림이 없습니다.<div>");
				 	$(".qna_no_cont").css("margin","12px 15px");
				 }

			}else{

				var jsonResult = JSON.parse(result);

	     		console.log(jsonResult);

				var jsonResult_push = jsonResult.CompanyList
				for(var i in jsonResult_push){
					 text +='<li>';
	                 text +='   <h4>'+jsonResult_push[i].VM_CP_NAME+'</h4>';
	                 text +='   <p><a href="../'+jsonResult_push[i].event_no+'">'+jsonResult_push[i].ms_content+'</a></p>';
	                 text +=' </li>';
				}
				
				$("#pushContWrap").empty();
				$("#pushContWrap").append(text);

			}	

	})

}
