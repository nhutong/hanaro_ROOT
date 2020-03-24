$(function(){
            
	stampModal();
	stampVal();
})

function stampModal(){

	//background 클릭하면 모달 닫힘
	$(".stamp_modal_layer_blk").click(function(){
		$(".stamp_modal_layer").css("display","none");
	})
	
	//확인버튼 클릭하면 모달 닫힘
	$("#stampValButton").click(function(){
		$(".stamp_modal_layer").css("display","none");
	})
}
		
//확인 눌렀을 때 Validation 확인 
function stampVal(rcvStampCode){
					
	//전체 스탬프 갯수 세는 거
	var stampTotal = $(".stamp_inner_wrap ul li").length;
	$(".stamp_total").text(stampTotal);

	//li 클릭하기 전 스탬프 갯수 세는 거
	var stampedTotal = $(".stamp_inner_wrap ul li.stamped").length;
	$(".stamped_total").text(stampedTotal);
				   
	$(".stamp_inner_wrap ul li").click(function(){
		$(this).addClass("clicked");
		//모달레이어
		$(".stamp_modal_layer").css("display","block");
		$("#stampModalInner").css("display","block");
	})
	//스탬프확인버튼
	$("#stampValButton").click(function(){
		var stampInput = $("#stampInput").val();

		if( stampInput == null ){
			alert("스탬프 코드를 입력해주세요.");
			$(".stamp_inner_wrap ul li").removeClass("clicked");
			return false;
		}else if( stampInput == "000000" ){
			//li 클릭하면 색깔 바뀌게하는 거
			$(".stamp_inner_wrap ul li.clicked").children("img").attr("src","../images/stamped.png");
			$(".stamp_inner_wrap ul li.clicked").addClass("stamped");
			//li 클릭하면 스탬프 갯수 세는 거
			var stampedTotal = $(".stamp_inner_wrap ul li.stamped").length;
			$(".stamped_total").text(stampedTotal);
		}else{
			alert("정확하지 않은 스탬프코드입니다. 다시 한 번 확인해주세요.");
			$(".stamp_inner_wrap ul li").removeClass("clicked");
			return false;
		}
	})

}