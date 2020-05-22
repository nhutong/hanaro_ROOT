 $(function(){

	getMapContent();
})


//지도 불러오기
function getMapContent(){

	var text = '';

	$.ajax({
        url:'/back/04_home/offline.jsp?random=' + (Math.random()*99999), 
        method : 'GET' 
    }).done(function(result){
		
		var jsonResult = JSON.parse(result);
//		console.log(jsonResult);
//console.log(jsonResult.CompanyList);
		var jsonResult_comp = jsonResult.CompanyList
		
		for(var i in jsonResult_comp){
			
			text +=' <li class="offline_inner_wrap">';
			text +='	<div class="locationClick" style="width:250px;" onclick="convertToStore('+jsonResult_comp[i].VM_CP_NO+', \''+jsonResult_comp[i].VM_CP_NAME+'\');">';
			text +='      <span class="offline_title">하나로마트 '+ jsonResult_comp[i].VM_CP_NAME +'</span>';
			text +='      <span class="offline_address">주소 : '+ jsonResult_comp[i].VM_ADDRESS +'</span>';  //2020.05.22 심규문 매장주소 추가
            text +='     <a href="#" class="offline_tel">Tel. '+ jsonResult_comp[i].VM_TEL +'</a>';
			text +='	</div>';
            text +='     <span class="offline_btn"><img src="../images/down.png" ';
			text +='	alt="내리기"></span>';
            text +='   <div class="offline_cont">';
			/*2020-02-18 주석처리 한 부분 - 나영*/
			text +='   <div class="offline_time"> - 영업시간 : '+ jsonResult_comp[i].VM_START_TIME +' ~ '+ jsonResult_comp[i].VM_END_TIME +'';
			if(jsonResult_comp[i].VM_OFF_NOTE == 'null'){
				text +='</div>';
			}else{
				text +='	('+ jsonResult_comp[i].VM_OFF_NOTE +')</div>';
			}
			/*2020-02-18 주석처리 한 부분 - 나영*/
            text +='       <div id="map'+i+'" style="width : 320px; height : 200px;"></div>';
            text +='   </div>';
            text +='  </li>';

		}
		
		$("#companyGroup").empty();
		$("#companyGroup").append(text);

		$(".offline_btn").click(function(){
			 $(this).siblings(".offline_cont").toggleClass("active");
			 $(this).children("img").toggleClass("rotate")
		})

		
		setTimeout(function(){ 
		i=0;
		for(var i in jsonResult_comp){

		var mapContainer = document.getElementById('map'+i), 
				mapOption = { 
					center: new daum.maps.LatLng( jsonResult_comp[i].lat , jsonResult_comp[i].lng ), 
					level: 4 
				};

			var map = new daum.maps.Map(mapContainer, mapOption);

				var markerPosition  = new daum.maps.LatLng(jsonResult_comp[i].lat, jsonResult_comp[i].lng); 

				var marker = new daum.maps.Marker({
					position: markerPosition
				});

				marker.setMap(map);

		}

		 }, 2000);


	});
}


//선택한 매장페이지로 이동하기
function convertToStore(rcvCPNO, cp_name){

	var result = confirm("기존 매장에서 사용하던 스탬프와 쿠폰은 변경매장에서 보이지 않으며, 기존매장으로 재변경시 이용가능합니다. 변경하시겠습니까?");
	if(result){
			alert("하나로마트 "+cp_name+"을 선택하셨습니다. 이용매장은 마이페이지에서 변경 가능합니다.");
			localStorage.setItem("vm_cp_no",rcvCPNO);
			location.href = "../home/main.html";
	}else{
		alert("취소하셨습니다.");
	}
	

}

		
        
