// cordova device ready
document.addEventListener("deviceready", onDeviceReady, false);	

function onDeviceReady() { 
	// 2020-02-20 수정
	if (localStorage.getItem("agree_location") == "Y"){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}else{
		getMapContent();
	}
}

// onSuccess Callback
var onSuccess = function(position) {

    console.log('Latitude: '          + position.coords.latitude          + '\n' +
				'Longitude: '         + position.coords.longitude         + '\n' +
				'Altitude: '          + position.coords.altitude          + '\n' +
				'Accuracy: '          + position.coords.accuracy          + '\n' +
				'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
				'Heading: '           + position.coords.heading           + '\n' +
				'Speed: '             + position.coords.speed             + '\n' +
				'Timestamp: '         + position.timestamp                + '\n');

	// 전역변수에 위도 경도 값을 저장한다.
	cur_lat = position.coords.latitude;
    cur_lon = position.coords.longitude;

	getMapContent(cur_lon, cur_lat);

};

// onError Callback receives a PositionError object
function onError(error) {
    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
	getMapContent();
}

$(function(){
//	getMapContent();
})


//지도 불러오기
function getMapContent(rcvLon, rcvLat){

	if (rcvLon == "")
	{
		var longtitude = "";
		var latitude = "";
	}else{
		var longtitude = rcvLon;
		var latitude = rcvLat;
	}

	var text = '';

	$.ajax({
        url:'https://www.nhhanaromart.com/back/04_home/offline.jsp?random=' + (Math.random()*99999),
		data : {longtitude: longtitude, latitude: latitude},
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
            text +='     <a href="#" class="offline_tel">Tel. '+ jsonResult_comp[i].VM_TEL +'</a>';
			text +='	</div>';
            text +='     <span class="offline_btn"><img src="../images/down.png" ';
			text +='	alt="내리기"></span>';
            text +='   <div class="offline_cont">';
			/*2020-02-18 주석처리 한 부분 - 나영*/
			
			/*2020-02-29 이중호 시작*/
			if(jsonResult_comp[i].VM_OFF_NOTE != '연중무휴'){
				text +='   <div class="offline_time"> - 영업시간 : '+ jsonResult_comp[i].VM_START_TIME.substr(0,2)+":"+jsonResult_comp[i].VM_START_TIME.substr(2,2) +' ~ '+ jsonResult_comp[i].VM_END_TIME.substr(0,2)+":"+jsonResult_comp[i].VM_END_TIME.substr(2,2) +'';
			}else{
				text +='   <div class="offline_time"> - 영업시간 : ';

			}
			/*2020-02-29 이중호 끝*/

			if(jsonResult_comp[i].VM_OFF_NOTE == ''){
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

			// 최근이용매장번호 컬럼을 업데이트 한다.
			$.post("https://www.nhhanaromart.com/back/02_app/myCompanyUpdate.jsp",
			{
				memberNo : localStorage.getItem("memberNo"),
				company_no : localStorage.getItem("vm_cp_no")
			},
			function(result){
						
				if(result.trim() === 'exception error' || result.trim() === 'NoN'){
					alert("오류가 발생했습니다. 다시 시도해주세요.\n 지속적으로 발생시 관리자에게 문의하세요.");
				}else{
					console.log("최근판매장번호업데이트완료");
				}
			});

			
			location.href = "../home/main.html";
	}else{
		alert("취소하셨습니다.");
	}
	

}

		
        
