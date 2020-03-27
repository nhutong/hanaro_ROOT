$(function(){
          
    noticeCont();

	//var pushEmpty = $("#noticeCont").children("li").length;
	//if(pushEmpty == 0){
		//$("#noticeCont").hide();
		//$("#noticeCont").after("<div class='notice_no_cont'>공지사항이 없습니다.<div>")
		//$(".notice_wrap").css("background-color","transparent");
		//$(".notice_wrap").css("border","0")
	//} 
})
        


// 공지사항 리스트를 불러온다.
function noticeCont(){
	
		var text = '';

		$.ajax({
			url:'/back/04_home/notice.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: localStorage.getItem("vm_cp_no") },
			method : 'GET' 
		}).done(function(result){
			
			if (result == "NoN")
			{
                text +='<div class="qna_no_cont">';
                text +='공지사항이 없습니다.';
                text +='</div>'; 

                $(".notice_wrap").css("background-color","transparent");
                $(".notice_wrap").css("border","0");
				
               }else{
               
               
			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList

			for(var i in jsonResult_notice){
				
				text +='<li class="notice_inner_wrap notice_click">';
				text +='   <span class="notice_title">'+jsonResult_notice[i].nt_title+'</span>';
				text +='   <span class="notice_date">'+jsonResult_notice[i].reg_date+'</span>';
				text +='   <span>';
				text +='	 <img src="../images/down.png" alt="내리기" class="notice_btn"></span>';
				text +='   <div class="notice_cont">';
				text +='		<p>'+jsonResult_notice[i].nt_content+'</p>';
				text +='   </div>';
				text +='</li>';

			}
         }
			
		$("#noticeCont").empty();
		$("#noticeCont").append(text);

		var pushEmpty = $("#noticeCont").children("li").length;
		if(pushEmpty == 0){
			$("#noticeCont").hide();
			$("#noticeCont").after("<div class='notice_no_cont'>공지사항이 없습니다.<div>")
			$(".notice_wrap").css("background-color","transparent");
			$(".notice_wrap").css("border","0")
		}

		$(".notice_click").click(function(){
                  $(this).children(".notice_cont").toggleClass("active");
                  $(this).children(".notice_btn").toggleClass("rotate")
			});
	})

}