$(function () {

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_home").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	getLeftMenu('home');
	$("#nh_home_menu_create").addClass("active");

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
			getMenuList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
			document.getElementById("nh_main").src = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
		}
	});
	/* 공통부분 종료======================================================================== */

	/* 최초 로딩를 고려하여, 현재 로그인한 유저의 판매장번호로 긴급공지정보를 바인딩한다. */
	getMenuList(targetCompanyNo);

	/* 긴급공지 수정버튼 - 모달창에서 긴급공지를 수정하기 위한 수정버튼 클릭시 텍스트를 업데이트 한다.*/
//    $("#updateBtn").on("click",function(){
//		
//		var Text1 = $("#Text1").val();
//		var sn_no = sessionStorage.getItem("suddenNoticeNo");
//
//		if ( CuserCompanyNo == null || chrLen(CuserCompanyNo) == 0)
//		{
//			alert("로그인후 수정하시기 바랍니다.");
//			return false;
//		}
//
//		$.ajax({
//			url:'/back/04_home/suddenNoticeUpdate.jsp?random=' + (Math.random()*99999),
//			data : {sn_no: sn_no, Text1: Text1},
//			method : 'GET' 
//		}).done(function(result){
//
//			console.log("noticeList=========================================");
//			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
//				console.log(result);
//			}else{
//				console.log("============= notice callback ========================");
//				console.log(result);
//				alert("수정이 완료되었습니다.");
//				window.location.reload();
//			}
//		});
//	});

//	$("button.nh_list_add, .nh_store_table #black").click(function(){
//            $(".nh_store_table2, .nh_store_table #black").toggleClass("active");
//			$("#addMenuBtn").click(function(){
//					addMenu();
//			 });
//     });

	 
});

function addMenu(){
	var rcvMenuName = $("#menu_name").val();
		var nh_list_type = $("#nh_list_type").val();

		if ( rcvMenuName == null || chrLen(rcvMenuName) == 0)
		{
			alert("메뉴명을 입력해주시기 바랍니다.");
			return false;
		}else if( chrLen(rcvMenuName) > 5 ) 
		{
			alert("메뉴명은 5자 이하로 입력해주시기 바랍니다.");
			return false;
		}


		$.ajax({
			url:'/back/04_home/menuCreateInsert.jsp?random=' + (Math.random()*99999),
			data : {menu_name: rcvMenuName, menu_type_cd: nh_list_type, rcvCompanyNo: getCookie("onSelectCompanyNo")},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("등록 완료되었습니다.");
				window.location.reload();
			}
		});
}



// 메뉴리스트를 바인딩한다.
function getMenuList(rcvCompanyNo) {

    $.ajax({
        url:'../back/04_home/menuCreateSelect.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

		var text = "";

		$("#nhStoreTable").empty();

        text +='                 <div>';
        text +='                     <button class="nh_list_add">';
        text +='                          <span class="add_btn"></span>';
        text +='                     </button>';
        text +='                 </div>';	
				   
        console.log("menuList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			if (rcvCompanyNo == 0)
			{
			}else{
				$("#nhStoreTable").append(text);
			}
		
			$("button.nh_list_add").click(function(){
						$(".nh_store_table2, #black").addClass("active");
						$("#addMenuBtn").click(function(){
								addMenu();
						 });
				 });
				 
			$(".nh_store_table > span").click(function(){
						$(".nh_store_table3, #black").addClass("active");
						$("#editMenuBtn").click(function(){
								editMenuList(rcvMenuNo);
						 });
				 });

			$("#black").click(function(){
					$(".nh_store_table2,.nh_store_table3, #black").removeClass("active");
				
			})

        }else{

            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
			var jsonResult_menu = data.CompanyList

			for(var i in jsonResult_menu){

                   text +='                 <div id="nhListBtn'+jsonResult_menu[i].menu_no+'"><span id="nhListName'+jsonResult_menu[i].menu_no+'" onclick="editMenuModal('+jsonResult_menu[i].menu_no+',\''+jsonResult_menu[i].menu_type_cd+'\');">'+jsonResult_menu[i].menu_name+'</span>';
                   text +='                     <button class="nh_list_remove"  id="nhListDelBtn'+jsonResult_menu[i].menu_no+'"';
				   text +=' 						onclick="delMenuList('+jsonResult_menu[i].menu_no+');">';
                   text +='                     <span class="cancel_btn"></span>';
                   text +='                     </button>';
                   text +='                 </div>';
				}

			$("#nhStoreTable").append(text);
			

			$("button.nh_list_add").click(function(){
						$(".nh_store_table2, #black").addClass("active");
						$("#addMenuBtn").click(function(){
								addMenu();
						 });
				 });	
			
			$("#black").click(function(){
					$(".nh_store_table2,.nh_store_table3, #black").removeClass("active");
				
			})			

        }
    });
}

//메뉴 수정 모달

function editMenuModal(rcvMenuNo,rcvMenuType){

		$(".nh_store_table3, #black").addClass("active");
		var menuName = $("#nhListName"+rcvMenuNo).text();
		$("#menu_name_edit").val(menuName);
		
		if( rcvMenuType == 'MENU1'){
			$("#nh_list_type_edit option[value='MENU1']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU2']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU3']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU4']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU5']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU6']").attr('hidden','hidden');
		}else if( rcvMenuType == 'MENU2'){
			$("#nh_list_type_edit option[value='MENU1']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU2']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU3']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU4']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU5']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU6']").attr('hidden','hidden');
		}else if( rcvMenuType == 'MENU3'){
			$("#nh_list_type_edit option[value='MENU1']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU2']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU3']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU4']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU5']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU6']").attr('hidden','hidden');
		}else if( rcvMenuType == 'MENU4'){
			$("#nh_list_type_edit option[value='MENU4']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU5']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU6']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU1']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU2']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU3']").attr('hidden','hidden');		
		}else if( rcvMenuType == 'MENU5'){
			$("#nh_list_type_edit option[value='MENU4']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU5']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU6']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU1']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU2']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU3']").attr('hidden','hidden');		
		}else if( rcvMenuType == 'MENU6'){
			$("#nh_list_type_edit option[value='MENU4']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU5']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU6']").removeAttr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU1']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU2']").attr('hidden','hidden');
			$("#nh_list_type_edit option[value='MENU3']").attr('hidden','hidden');		
		}else{
		
		}

		$("#nh_list_type_edit option").removeAttr('selected','selected');
		$("#nh_list_type_edit option[value="+rcvMenuType+"]").attr('selected','selected');
		$("#editMenuBtn").click(function(){
				editMenuList(rcvMenuNo, $("#menu_name_edit").val(), $("#nh_list_type_edit").val());
		});
				

}

//메뉴 수정
function editMenuList(rcvMenuNo, rcvMenuName, rcvMenuType) {

	if ( rcvMenuName == null || chrLen(rcvMenuName) == 0)
	{
		alert("메뉴명을 입력해주시기 바랍니다.");
		return false;
	}else if( chrLen(rcvMenuName) > 5 ) 
	{
		alert("메뉴명은 5자 이하로 입력해주시기 바랍니다.");
		return false;
	}

	$.ajax({
		url:'/back/04_home/menuCreateUpdate.jsp?random=' + (Math.random()*99999),
		data : {menu_no: rcvMenuNo, menu_name: rcvMenuName, menu_type_cd: rcvMenuType, rcvCompanyNo: getCookie("onSelectCompanyNo")},
		method : 'GET' 
	}).done(function(result){

		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("수정 완료되었습니다.");
			window.location.reload();
		}
	});
}

//메뉴삭제 클릭시 삭제
function delMenuList(rcvMenuNo) {

	

				var alertResult = confirm("정말로 삭제하시겠습니까? \n(메뉴삭제시, 행사/전단에서 생성하여 연결된 일자별 전단그룹은\n더이상 사용하실수 없습니다.)");
				if(alertResult){

					$.ajax({
						url:'../back/04_home/menuCreateDelete.jsp?random=' + (Math.random()*99999),
						data : {menu_no: rcvMenuNo},
						method : 'GET' 
					}).done(function(result){

						if(result == ('NoN') || result == 'exception error' || result == 'empty'){
							console.log(result);
						}else{
							console.log("============= notice callback ========================");
							console.log(result);
							alert("삭제 완료되었습니다.");
							window.location.reload();
						}
							
					});

				}else{
					alert("삭제가 취소되었습니다.");
				}
               
          
}