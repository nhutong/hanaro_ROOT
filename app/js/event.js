$(function(){

	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호

	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.
	if (vm_cp_no == "")
	{
		// 웹에서 로그인을 통한 접근이 아닐경우
		if (localStorage.getItem("vm_cp_no") == null)
		{
			// 일단 양재점으로 셋팅한다.
			vm_cp_no = 1;
		// 웹이나 앱에서 로그인을 통한 정상적인 접근일 경우,
		}else{
			vm_cp_no = localStorage.getItem("vm_cp_no");
		}
	}

	getHeader(vm_cp_no);

	getLeft();
	
	/* 판매장명을 가지고와서, 제목에 바인딩한다. */
	setTimeout(function(){ getCpName(vm_cp_no); }, 100);

	eventList(vm_cp_no);
	eventListIng(vm_cp_no);
	eventListEnd(vm_cp_no);

	logInsert(localStorage.getItem("memberNo"), vm_cp_no, "-2");

 })


//이벤트 디테일 펼치기 접기
function eventDetail(){
    
    $(".event_list").removeClass("active");   
	$(".event_cont").hide();
	$(".event_cont_blk").hide();
    $(".event_thumb, .event_detail").click(function(){
		$(this).siblings(".event_cont").show();
		$(this).siblings(".event_cont_blk").show();
        $(this).parent(".event_list").siblings(".event_list").hide();
    })

    $(".event_detail >img, .event_cont_blk").click(function(){
        $(".event_cont").hide();
		$(".event_cont_blk").hide();
        $(".event_list").show();
    }) 

    //슬라이드에서 들어오면 이벤트페이지 펼치기
    oParams = getUrlParams();
    if(oParams.event_no == null){
    }else{	
        $(".event_list").removeClass("active");   
         $("#eventCont"+oParams.event_no+"").parent(".event_list").addClass("active");   
        $("#eventCont"+oParams.event_no+"").show();
		$(this).siblings(".event_cont_blk").show();
		$(".event_list.active").siblings(".event_list").hide();
    }    

}

//주소에서 string 가져오기

function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}


/* 이벤트 참여하기 */
function joinEvent(rcvEventNo){

	$.ajax({
		url:'/back/02_app/mEventJoin.jsp?random=' + (Math.random()*99999), 
		data : {eventNo: rcvEventNo, memberNo: localStorage.getItem("memberNo")},
		method : 'GET' 
	}).done(function(result){
			
		console.log("noticeList=========================================");
		if(result == 'dup'){
			alert("이벤트에 중복참여할수 없습니다.")
		}else if(result == 'exception error'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("이벤트에 참여하였습니다.")
		}
	});
}

/* 이벤트 - 전체 */
function eventList(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mEvent.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){
			if (result == "NoN")
			{
                text +='<div class="noCont">';
                text +='준비중입니다.';
                text +='</div>'; 
            }else{	
				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.BannerList;
				
				for(var i in jsonResult_notice){

					text +='<div class="event_list">';       
					text +='	<div class="event_thumb">';
					text +='	   <a href="#"><img src="../..'+jsonResult_notice[i].img_url+'" alt="이미지"></a>';
					text +='	</div>';
					text +='	<div class="event_detail">';
					text +='		<a href="#" class="event_name">'+jsonResult_notice[i].event_title+'</a>';
					text +='		<span class="event_date">'+jsonResult_notice[i].start_date+' ~ '+jsonResult_notice[i].end_date+'</span>';
					text +='	</div>';
					text +='	<div class="event_cont" id="eventCont'+jsonResult_notice[i].event_no+'">';
					text +='		<div class="event_detail">';
					text +='		<img src="../images/back.png" alt="되돌아가기">';
					text +='		<a href="#" class="event_name">'+jsonResult_notice[i].event_title+'</a>';
					text +='	</div>';
					text +='		<div class="event_thumb">';
					
					// if (jsonResult_notice[i].link_url == "")
					// {
					// 	text +='	   <a href="#"><img src="..'+jsonResult_notice[i].detail_img_url+'" alt="이미지"></a>';
					// }else{
					// 	text +='	   <a href="'+jsonResult_notice[i].link_url+'"><img src="..'+jsonResult_notice[i].detail_img_url+'" alt="이미지"></a>';
					// }				

					// text +='	</div>';
					// //text +='	  <p></p>'; 
					// text +='	  <button onclick="alert(\'모바일 앱을 통해서만 사용할 수 있습니다.\');">참여하기</button>';   
					
					/* 20200316 수정시작 */
					if (jsonResult_notice[i].eventLink == "N")
                    {
                        text +='	   <img src="'+jsonResult_notice[i].detail_img_url+'" alt="이미지">';
                        text +='	</div>';
                        //text +='	  <p></p>'; 
//                        text +='	  <button onclick="joinEvent('+jsonResult_notice[i].event_no+');">참여하기</button>';                          
                    }else{
                        text +='	   <img src="'+jsonResult_notice[i].detail_img_url+'" alt="이미지">';
                        text +='	</div>';
                        //text +='	  <p></p>'; 
//                        text +='	  <button onclick="window.open(\''+jsonResult_notice[i].link_url+'\');">자세히 보기</button>';  
						if (jsonResult_notice[i].event_alive_fg == "Y")
						{/* 20200229 하기 1줄 수정 보러가기 */
							text +='	  <button onclick="location.href=\'../'+jsonResult_notice[i].link_url+'\';">보러가기</button>'; 
						}else{
							text +='	  <button class="end">종료된 이벤트입니다.</button>';  
						}
			  
                    }
					/* 20200316 수정끝 */

					text +='	</div>';
					text +='	<div class="event_cont_blk"></div>';
					text +='</div>';

				}
			}
			
		$("#list_1").empty();
		$("#list_1").append(text);

		//이벤트 디테일 펼치기
		eventDetail();
	
	})

}

/* 이벤트 - 진행중 */
function eventListIng(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mEventIng.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){
	
			if (result == "NoN")
			{
                text +='<div class="noCont">';
                text +='준비중입니다.';
                text +='</div>';      
			}else{

				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.BannerList;
				
				for(var i in jsonResult_notice){

					text +='<div class="event_list">';       
					text +='	<div class="event_thumb">';
					text +='	   <a href="#"><img src="../..'+jsonResult_notice[i].img_url+'" alt="이미지"></a>';
					text +='	</div>';
					text +='	<div class="event_detail">';
					text +='		<a href="#" class="event_name">'+jsonResult_notice[i].event_title+'</a>';
					text +='		<span class="event_date">'+jsonResult_notice[i].start_date+' ~ '+jsonResult_notice[i].end_date+'</span>';
					text +='	</div>';
					text +='	<div class="event_cont">';
					text +='		<div class="event_detail">';
					text +='		<img src="../images/back.png" alt="되돌아가기">';
					text +='		<a href="#" class="event_name">'+jsonResult_notice[i].event_title+'</a>';
					text +='	</div>';
					text +='		<div class="event_thumb">';

					// if (jsonResult_notice[i].link_url == "")
					// {
					// 	text +='	   <a href="#"><img src="..'+jsonResult_notice[i].detail_img_url+'" alt="이미지"></a>';
					// }else{
					// 	text +='	   <a href="'+jsonResult_notice[i].link_url+'"><img src="..'+jsonResult_notice[i].detail_img_url+'" alt="이미지"></a>';
					// }

					// text +='	</div>';
					// //text +='	  <p></p>'; 
					// text +='	  <button onclick="joinEvent('+jsonResult_notice[i].event_no+');">참여하기</button>'; 
					
					/* 20200316 수정시작 */
					if (jsonResult_notice[i].eventLink == "N")
                    {
                        text +='	   <img src="'+jsonResult_notice[i].detail_img_url+'" alt="이미지">';
                        text +='	</div>';
                        //text +='	  <p></p>'; 
//                        text +='	  <button onclick="joinEvent('+jsonResult_notice[i].event_no+');">참여하기</button>';                          
                    }else{
                        text +='	   <img src="'+jsonResult_notice[i].detail_img_url+'" alt="이미지">';
                        text +='	</div>';
                        //text +='	  <p></p>'; 
//                        text +='	  <button onclick="window.open(\''+jsonResult_notice[i].link_url+'\');">자세히 보기</button>';  
						if (jsonResult_notice[i].event_alive_fg == "Y")
						{/* 20200229 하기 1줄 수정 보러가기 */
							text +='	  <button onclick="location.href=\'../'+jsonResult_notice[i].link_url+'\';">보러가기</button>'; 
						}else{
							text +='	  <button class="end">종료된 이벤트입니다.</button>';  
						}
			  
                    }
					/* 20200316 수정끝 */

					text +='	</div>';
					text +='	<div class="event_cont_blk"></div>';
					text +='</div>';

				}

			}
			
		$("#list_2").empty();
		$("#list_2").append(text);

		//이벤트 디테일 펼치기
		eventDetail();
	
	})

}

/* 이벤트 - 종료 */
function eventListEnd(rcv_vm_cp_no){

		var text = '';

		$.ajax({
			url:'/back/02_app/mEventEnd.jsp?random=' + (Math.random()*99999), 
			data : {userCompanyNo: rcv_vm_cp_no},
			method : 'GET' 
		}).done(function(result){
	
			if (result == "NoN")
			{
                text +='<div class="noCont">';
                text +='준비중입니다.';
                text +='</div>';      
			}else{

				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.BannerList;
				
				for(var i in jsonResult_notice){

					text +='<div class="event_list">';       
					text +='	<div class="event_thumb">';
					text +='	   <a href="#"><img src="..'+jsonResult_notice[i].img_url+'" alt="이미지"></a>';
					text +='	</div>';
					text +='	<div class="event_detail">';
					text +='		<a href="#" class="event_name">'+jsonResult_notice[i].event_title+'</a>';
					text +='		<span class="event_date">'+jsonResult_notice[i].start_date+' ~ '+jsonResult_notice[i].end_date+'</span>';
					text +='	</div>';
					text +='	<div class="event_cont">';
					text +='		<div class="event_detail">';
					text +='		<img src="../images/back.png" alt="되돌아가기">';
					text +='		<a href="#" class="event_name">'+jsonResult_notice[i].event_title+'</a>';
					text +='	</div>';
					text +='		<div class="event_thumb">';

					// if (jsonResult_notice[i].link_url == "")
					// {
					// 	text +='	   <a href="#"><img src="..'+jsonResult_notice[i].detail_img_url+'" alt="이미지"></a>';
					// }else{
					// 	text +='	   <a href="'+jsonResult_notice[i].link_url+'"><img src="..'+jsonResult_notice[i].detail_img_url+'" alt="이미지"></a>';
					// }

					// text +='	</div>';
					// //text +='	  <p></p>'; 
					// text +='	  <button onclick="joinEvent('+jsonResult_notice[i].event_no+');">참여하기</button>';   
					
					/* 20200316 수정시작 */
					if (jsonResult_notice[i].eventLink == "N")
                    {
                        text +='	   <img src="'+jsonResult_notice[i].detail_img_url+'" alt="이미지">';
                        text +='	</div>';
                        //text +='	  <p></p>'; 
//                        text +='	  <button onclick="joinEvent('+jsonResult_notice[i].event_no+');">참여하기</button>';                          
                    }else{
                        text +='	   <img src="'+jsonResult_notice[i].detail_img_url+'" alt="이미지">';
                        text +='	</div>';
                        //text +='	  <p></p>'; 
//                        text +='	  <button onclick="window.open(\''+jsonResult_notice[i].link_url+'\');">자세히 보기</button>';  
						if (jsonResult_notice[i].event_alive_fg == "Y")
						{/* 20200229 하기 1줄 수정 보러가기 */
							text +='	  <button onclick="location.href=\'../'+jsonResult_notice[i].link_url+'\';">보러가기</button>'; 
						}else{
							text +='	  <button class="end">종료된 이벤트입니다.</button>';  
						}
			  
                    }
					/* 20200316 수정끝 */

					text +='	</div>';
					text +='	<div class="event_cont_blk"></div>';
					text +='</div>';

				}
			}
			
		$("#list_3").empty();
		$("#list_3").append(text);

		//이벤트 디테일 펼치기
		eventDetail();
	
	})

}