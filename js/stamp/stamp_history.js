$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_event").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	getLeftMenu('event');
	$("#nh_event_stamp_history").addClass("active");

//	stampModal();
//	$(".stamp_history_modal").hide();

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	var targetCompanyNo = "";
	if (onSelectCompanyNo != "")
	{
		if (onSelectCompanyNo != CuserCompanyNo)
		{
			targetCompanyNo = onSelectCompanyNo;
		}else{
			targetCompanyNo = CuserCompanyNo;
		}
	}else{
		targetCompanyNo = CuserCompanyNo;
	}

	/* 최초 로그인한 유저번호로 바인딩한다. */
	getManagerList(CuserCompanyNo, targetCompanyNo);

	/*판매장 변경시, 
	1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
	2. 저장된 쿠키정보를 이용하여 긴급공지내용을 바인딩한다. 
	3. iframe 내부 모바일웹의 판매장셋팅을 위해, 로컬스토리지에 판매장번호를 셋팅한다.
	4. 선택한 판매장번로를 이용하여 iframe reload 한다.*/
	$("#sort_select").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			noticeCont(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	/* 공통부분 종료======================================================================== */

	/*판매장 변경시, */
	$("#btnUserSearch").on("click",function(){
		noticeCont(onSelectCompanyNo);
	});

	noticeCont(targetCompanyNo);
	$(".stamp_history_modal").hide();
	
});

// 공지사항 리스트를 불러온다.
function noticeCont(rcvonSelectCompanyNo){

		var keyword = encodeURIComponent($("#keyword").val());
		var text = '';

		$.ajax({
			url:'/back/05_event/stamp_history.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: rcvonSelectCompanyNo, rcvKeyword: keyword },
			method : 'GET' 
		}).done(function(result){
			if(result == "NoN"){

					text +='      <tr>';
					text +='			 <td colspan="3">등록된 사항이 없습니다.</td>';
					text +='       </tr>';

				$("#tab1_table").empty();
				$("#tab1_table").append(text);

			}else{
				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.CompanyList

				for(var i in jsonResult_notice){
					
						text +='      <tr class="showing_tr">';
						text +='			 <td>'+jsonResult_notice[i].VM_CP_NAME+'</td>';
						text +='			 <td>'+jsonResult_notice[i].tel+'</td>';
						text +='			 <td>스탬프번호: '+jsonResult_notice[i].stamp_no+', 기간: '+jsonResult_notice[i].start_date+'~'+jsonResult_notice[i].end_date+'</td>';
						text +='			 <td onclick="stampModal('+jsonResult_notice[i].vm_cp_no+', \''+jsonResult_notice[i].tel+'\');">'+jsonResult_notice[i].ms_cnt+'/10</td>';
						text +='       </tr>';
				}
				
			
				$("#tab1_table").empty();
				$("#tab1_table").append(text);

				$("#tab1_table tr td:last-child").click(function(){
					$(".stamp_history_modal").show();
				});
				$(".modal_blk").click(function(){
					$(".stamp_history_modal").hide();
				})
				
			}	

	})

}

//스탬프 히스토리 모달 - 나중에 onclick으로 바꾸기.
function stampModal(rcv_vm_cp_no, rcv_tel){

		var text = '';

		$.ajax({
			url:'/back/05_event/stamp_history_tel.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: rcv_vm_cp_no, tel: rcv_tel },
			method : 'GET' 
		}).done(function(result){
			if(result == "NoN"){
					text +='      <tr>';
					text +='			 <td colspan="3">등록된 사항이 없습니다.</td>';
					text +='       </tr>';
			}else{
				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.CompanyList

				for(var j in jsonResult_notice){

				    text +=' <tr>';
					text +='	<td>'+jsonResult_notice[j].staff_name+'</td>';
					text +='	<td>'+jsonResult_notice[j].std_date+'</td>';
					text +='	<td>';
					text +='		<button id="stampHistoryDel01" class="stamp_history_del" onclick="delete_btn('+jsonResult_notice[j].ms_no+', '+rcv_vm_cp_no+', \''+rcv_tel+'\');">삭제</button>';
					text +='	</td>';
					text +='</tr>';

				}

				$("#stamp_history").empty();
				$("#stamp_history").append(text);
				
			}	

	})

}

// 상품삭제 버튼 클릭시, 함수실행된다.
function delete_btn(rcv_ms_no, rcv_vm_cp_no, rcv_tel){ 
	if (confirm("정말 삭제하시겠습니까??") == true){
		$.ajax({
			url:'/back/05_event/stampTelDelete.jsp?random=' + (Math.random()*99999),
			data : {rcv_ms_no: rcv_ms_no},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제 완료되었습니다.");
				stampModal(rcv_vm_cp_no, rcv_tel);
			}
		});

	}else{   //취소
		return;
	}
}