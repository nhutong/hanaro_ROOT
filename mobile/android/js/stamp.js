$(function(){

	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호

	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.
	if (vm_cp_no == "")
	{
		// 웹에서 로그인을 통한 접근이 아닐경우
		if (localStorage.getItem("vm_cp_no") == "")
		{
			// 일단 양재점으로 셋팅한다.
			vm_cp_no = 1;
		// 웹이나 앱에서 로그인을 통한 정상적인 접근일 경우,
		}else{
			vm_cp_no = localStorage.getItem("vm_cp_no");
		}
	}
			
	stampList(vm_cp_no);
    
 })


 function stampList(rcv_vm_cp_no){

	var text = "";

	$.ajax({
		url:'https://www.nhhanaromart.com/back/02_app/mStampMine.jsp?random=' + (Math.random()*99999), 
		data : {userCompanyNo: rcv_vm_cp_no, memberNo : localStorage.getItem("memberNo")},
		method : 'GET' 
	}).done(function(result){

			if (result == "NoN")
			{
				console.log("스탬프가 존재하지않습니다.");
				
				text +='<div class="list_no_item">등록된 스탬프가 없습니다.</div>'

				$(".inner_cont").empty();
				$(".inner_cont").append(text);

			}else{

				text +='<ul>';
				text +='    <li id="st_0" onclick="stampModal(\'st_0\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_1" onclick="stampModal(\'st_1\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_2" onclick="stampModal(\'st_2\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_3" onclick="stampModal(\'st_3\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_4" onclick="stampModal(\'st_4\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='</ul>';
                text +=' <ul>';
                text +='    <li id="st_5" onclick="stampModal(\'st_5\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_6" onclick="stampModal(\'st_6\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_7" onclick="stampModal(\'st_7\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_8" onclick="stampModal(\'st_8\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='    <li id="st_9" onclick="stampModal(\'st_9\');" value="0"><img src="../images/stamp.png" alt="스탬프"></li>';
                text +='</ul>';

				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.BannerList;
			
				$("#stamp_inner_wrap").empty();
				$("#stamp_inner_wrap").append(text);

				for(var i in jsonResult_notice){

					if (jsonResult_notice[i].ms_no == null)
					{
					}else{
						$("#st_"+i).addClass("stamped");
						$("#st_"+i).attr("value",jsonResult_notice[i].ms_no);
					}

//					$("#st_"+i).addClass("stamped");
					localStorage.setItem("myStampNo",jsonResult_notice[i].stamp_no);
					$("#startDate").empty();
					$("#startDate").append(""+jsonResult_notice[i].start_date+"");
					$("#endDate").empty();
					$("#endDate").append(""+jsonResult_notice[i].end_date+"");
					
						

				}
				$(".stamp_inner_wrap ul li.stamped").children("img").attr("src","../images/stamped.png");
				
				var stampedTotal = $(".stamp_inner_wrap ul li.stamped").length;
				$("#stampedTotal").empty();
				$("#stampedTotal").append(stampedTotal);
			}
	
	})
 }

// 각 스탬프별 모달 레이어를 뛰우면서, 도장찍힘 여부로 제어한다.
function stampModal(rcvId){
		
		if($("#"+rcvId).hasClass("stamped") == true){
//			alert("이미 도장이 찍혀있습니다.");
			// 모달레이어를 뛰운다.
			$(".stamp_modal_layer").css("display","block");
			$("#stampModalInner").css("display","block");

			//background 클릭하면 모달 닫힘
			$(".stamp_modal_layer_blk").click(function(){
				$(".stamp_modal_layer").css("display","none");
			})
			//확인버튼 클릭하면 모달 닫힘
			$("#stampValButton").click(function(){
				$(".stamp_modal_layer").css("display","none");
			})	
			/* 스탬프찍힌 것을 누른다. */
			localStorage.setItem("stamped",$("#"+rcvId).attr("value"));
		}else{
			// 모달레이어를 뛰운다.
			$(".stamp_modal_layer").css("display","block");
			$("#stampModalInner").css("display","block");

			//background 클릭하면 모달 닫힘
			$(".stamp_modal_layer_blk").click(function(){
				$(".stamp_modal_layer").css("display","none");
			})
			//확인버튼 클릭하면 모달 닫힘
			$("#stampValButton").click(function(){
				$(".stamp_modal_layer").css("display","none");
			})
			/* 스탬프 안찍힌 것을 누른다. */
			localStorage.setItem("stamped","N");
		}

}

//확인 눌렀을 때 Validation 확인 
$("#stampValButton").click(function(){

	var stampInput = $("#stampInput").val();
	if( stampInput == null ){
		alert("스탬프 코드를 입력해주세요.");
		$("#stampInput").val("");
		return false;
	}
	
	$.ajax({
		url:'https://www.nhhanaromart.com/back/02_app/mStampInsert.jsp?random=' + (Math.random()*99999), 
		data : {
			stampNo: localStorage.getItem("myStampNo"), 
			memberNo: localStorage.getItem("memberNo"), 
			pw: stampInput, 
			rcvCompanyNo: localStorage.getItem("vm_cp_no"),
			stamped : localStorage.getItem("stamped")
			},
		method : 'GET' 
	}).done(function(result){
			
		console.log("noticeList=========================================");
		if(result == 'NoN'){
			alert("확인번호를 다시 입력해주시기 바랍니다.");
			$("#stampInput").val("");
			return false;
		}else if(result == 'exception error'){
			console.log(result);
			$("#stampInput").val("");
			return false;
		}else if(result == 'complete'){
			console.log(result);
//			alert("축하드립니다! 스탬프를 모두 완성하셔서 감사쿠폰을 지급해드렸습니다. 쿠폰을 바로 확인하시겠습니까?");

			var con_test = confirm("축하드립니다! 스탬프를 모두 완성하셔서 감사쿠폰을 지급해드렸습니다. 쿠폰을 바로 확인하시겠습니까?");
			if(con_test == true){
			  my_coupon();
			}
			else if(con_test == false){
			  return false;
			}

//			return false;
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("스탬프를 적립(취소)하였습니다.");
			$("#stampInput").val("");
			stampList(localStorage.getItem("vm_cp_no"));
		}
	});


//	}else if( stampInput == "000000" ){
//		//li 클릭하면 색깔 바뀌게하는 거
//		$(".stamp_inner_wrap ul li.clicked").children("img").attr("src","../images/stamped.png");
//		$(".stamp_inner_wrap ul li.clicked").addClass("stamped");
//		//li 클릭하면 스탬프 갯수 세는 거
//		var stampedTotal = $(".stamp_inner_wrap ul li.stamped").length;
//		$(".stamped_total").text(stampedTotal);
//	}else{
//		alert("정확하지 않은 스탬프코드입니다. 다시 한 번 확인해주세요.");
//		$(".stamp_inner_wrap ul li").removeClass("clicked");
//		return false;
//	}
})
