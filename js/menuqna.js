$(function () {

	var pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
		pageNo = 1;
	}

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_detail").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	getLeftMenu('managemenu');
	$("#nh_manage_qna").addClass("active");

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
	
	//menunotice_paging(1, targetCompanyNo); 2020.09.08 심규문 페이징네이션 처리 함수가 두개라 주석처리

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
			//noticeCont(getCookie("onSelectCompanyNo"));
			noticeCont(getCookie("onSelectCompanyNo"), pageNo);
			noticeCont_paging(getCookie("onSelectCompanyNo"), pageNo);
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	/* 공통부분 종료======================================================================== */

	//noticeCont(targetCompanyNo);
	noticeCont(getCookie("onSelectCompanyNo"), pageNo);
	noticeCont_paging(getCookie("onSelectCompanyNo"), pageNo);

});

// 공지사항 리스트를 불러온다.
function noticeCont(rcvonSelectCompanyNo, nowPage){
		if (!nowPage) nowPage = 1;
		var text = '';

		$.ajax({
			url:'/back/04_home/manageQna.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: rcvonSelectCompanyNo , n_page: nowPage},
			method : 'GET' 
		}).done(function(result){
			if(result == "NoN"){
					text +='      <tr>';
					text +='			 <td colspan="3">등록된 1:1문의가 없습니다.</td>';
					text +='       </tr>';
			}else{
				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.CompanyList
				
				for(var i in jsonResult_notice){
					
					text +='      <tr>';
					text +='			 <td class="menu_qna_title">';
					text +='			 <a href="#" onclick="menu_post_popup('+jsonResult_notice[i].nt_no+');">'+jsonResult_notice[i].nt_title+'</a></td>';
					text +='			 <td>'+jsonResult_notice[i].reg_date+'</td>';
					text +='			 <td>'+jsonResult_notice[i].ref_nt_no+'</td>';
					text +='       </tr>';
				}
			}
				$("#manageNoticeTable").empty();
				$("#manageNoticeTable").append(text);		

	})

}

function noticeCont_paging(rcvonSelectCompanyNo, rcvPageNo) {
	$.ajax({
        url:'/back/04_home/manageQna_paging.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: rcvonSelectCompanyNo, pageNo: rcvPageNo},
        method : 'GET' 
    }).done(function(result){

        console.log("coupon_history_paging=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            console.log("============= coupon_history_paging callback ========================");
            console.log(result);
			var data = JSON.parse(result);
                                                                                                                                                                                                                                                                                                                                                                                    
			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 10;
			var next_no = parseInt(rcvPageNo) + 10;
			var text = "";

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -9)
			{
			}else if(total_paging_cnt < 9 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+',1), noticeCont_paging('+rcvonSelectCompanyNo+',1);">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+pre_no+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+pre_no+');">«</a></li>';  
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					text += '<li class="page-item active"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+k+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+k+');">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+k+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+k+');">'+k+'</a></li>';
				}
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+next_no+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+next_no+');">»</a></li>';  		
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}

//function menu_post_popup(){
//	var popupX = (window.screen.width/2) - (400/2);
//   window.open('menuqna_pop.html','1:1문의 읽기','width=440,height=600,location=no,status=no,scrollbars=yes,left='+ popupX +',top=200')  
//}

   function menu_post_popup(rcvNtNo){
	var popupX = (window.screen.width/2) - (400/2);
   window.open('menuqna_pop.html?nt_no='+rcvNtNo+'','1:1문의','width=800,height=800,location=no,status=no,scrollbars=yes,left='+ popupX +',top=250')  
}



// 공지 페이징를 가져온다
/*  2020.09.08 심규문  페이징네이션 처리 함수가 두개라 주석처리
function menunotice_paging(rcvPageNo, targetCompanyNo) {
	$.ajax({
        url:'/back/04_home/qna_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,vm_cp_no: targetCompanyNo},
        method : 'GET' 
    }).done(function(result){

        console.log("prodlist_paging=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            console.log("============= prodlist_paging callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 6;
			var next_no = parseInt(rcvPageNo) + 6;

			var text = "";

           if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -5)
			{
			}else if(total_paging_cnt < 5 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" onclick="menunotice_paging(1, '+targetCompanyNo+')" href="javascript:void(0);">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" onclick="menunotice_paging('+pre_no+', '+targetCompanyNo+')" href="javascript:void(0);">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				const className = (parseInt(rcvPageNo) == k) ? "page-item active" : "page-item";
				const binstr = "";
				text += '<li class="'+className+'"><a class="page-link" onclick="menunotice_paging('+k+', '+targetCompanyNo+')" href="javascript:void(0);">'+k+'</a></li>';
				// if (parseInt(rcvPageNo) == k)
				// {
				// 	text += '<li class="page-item active"><a class="page-link" href="home.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				// }else{
				// 	text += '<li class="page-item"><a class="page-link" href="home.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				// }
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				text += '<li class="page-item"><a class="page-link" onclick="menunotice_paging('+next_no+', '+targetCompanyNo+')" href="javascript:void(0);">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
		}
    });
	noticeCont(targetCompanyNo, rcvPageNo);
}
*/