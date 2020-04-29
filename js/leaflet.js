// 판매장 템플릿
var tpl_tr_tab1_table = _.template('<tr id="member<%- jd_no %>" data-no="<%- jd_no %>">' +
    '<td><%- jd_no %></td>' +
	'<td><%- period %></td>' + 
	'<td><%- banner_cnt %></td>' +
	'<td><%- prod_content_cnt %></td>' +
	'<td><%- shorten_url %></td>' +
	'<td><button onclick="manage_srturl_create(<%- jd_no %>)">생성</button></td>' +
	'<td><button onclick="manage_jd_delete(<%- jd_no %>)">삭제</button></td>'
	);

$(function () {

    // 전역변수 파라미터	
    //menu_no = getParameterByName('menu_no');   // 메뉴번호
	//vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호
	//jd_no = getParameterByName('jd_no');   // 전단번호

	//if (vm_cp_no == "")
	//{
	//	//로그인한 판매장의 판매장번호를 로그인한 쿠키정보에서 가져온다.
	//	vm_cp_no = getCookie("userCompanyNo");
	//}

	/* 공통부분 시작======================================================================== */

	getHeader();
	$(".nav_leaflet").addClass("active");

	// 좌상단 유저정보 바인딩
	getLeft();

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");
	CuserCompanyName = getCookie("userCompanyName");

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

	/* 최초 로딩를 고려하여, 현재 로그인한 유저의 판매장번호로 긴급공지정보를 바인딩한다. */
	setTimeout(function(){ getLeftNav( $("#sort_select").val() ); }, 500);

	/* 전단의 상품순서를 리스팅한다 */
	setTimeout(function(){ getPdOrder(); }, 1000);

	/* 페이지 로딩시, 최초 상품컨텐츠선택을 초기화한다. */
	//setCookie1("jd_prod_con_no","", 1);	

	/* 공통부분 종료======================================================================== */	
	
	/*판매장 변경 */
	$("#sort_select").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			setCookie1("onSelectCompanyNo",$("#sort_select").val()); //sort_select와 onSelectCompanyNo는 항상 일치!!
			getLeftNav($("#sort_select").val());
			//localStorage.setItem("vm_cp_no",$("#sort_select").val()); //20200423-김대윤-관리자 페이지 에서는 localStorage를 사용하지 않음
			
			//화면별 iframe reload!
			if( $("#nh_main").length > 0 ){ 
				document.getElementById("nh_main").src    = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
			}else if( $("#nh_leaflet").length > 0 ){
				document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+$("#sort_select").val();
			}else{
				document.getElementById("nh_main").src    = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
			}
			setTimeout(function(){ getPdOrder(); }, 1000);
		}
	});
	/* 공통부분 종료======================================================================== */

	
	$(".leaflet_new").click(function(){

		//var jd_no = getCookie("jd_no");
		var jd_no = $("#modify_jd_no").text();
		if ( jd_no == null || chrLen(jd_no) == 0)
		{
			alert("유효한 전단이 없습니다. 새로운 전단제작하기 버튼을 눌러 전단을 제작해주세요.");
			return false;
		}

        $(".leaflet_edit_wrap").children("div").removeClass("active");
        $("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a>img, .price, .price2, .product,.item_list_banner_wrap").css("background-color","#fff");
        $("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
        $(".new_item_wrap").show();
                
	});
                            
	$(".cls_btn").click(function(){
		$(".new_item_wrap").hide();
	})
                            
	$('#order_deactive').on('click', function(){                  
		$('.deact_empty').children("input").attr('disabled', $(this).is(':checked'));       
	});
	
	$(".leaflet_banner_hover").click(function(){

		var noImg = "../images/no_img.png";

		if($(".ui-state-default img").attr('src') == noImg ){
		   alert("이미지가 없을 때는 숨기기가 작동하지 않습니다.");
		}else{  
		   $(".ui-state-default").children("span").addClass("active");
		 } 
		
	});
});

function history_back(){
	history.back();
}


// 좌측 메뉴리스트를 가져온다
function getLeftNav(rcv_vm_cp_no) {
    $.ajax({
        url:'/back/03_leaflet/leafletUserMenu.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: rcv_vm_cp_no},
        method : 'GET' 
    }).done(function(result){
		//console.log("leafletUserMenu=========================================");
		console.log("result:"+result);
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            //console.log(result);
			$('#myplanb_menu').empty();
			$('.leaflet_edit_wrap').hide();
        }else{
			$('.leaflet_edit_wrap').show();
            //console.log("============= leafletUserMenu callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			$('#myplanb_menu').empty();
			data['myplanb_menu'].forEach(function(item, index){      
				//console.log("bbbbb");
				$('#myplanb_menu').append('<li id="menu_'+decodeURIComponent(item['menu_no'])+'" onclick="leafletLink('+decodeURIComponent(item['menu_no'])+','+rcv_vm_cp_no+',\''+decodeURIComponent(item['menu_type_cd'])+'\');">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'('+decodeURIComponent(item['menu_no'])+')</li>');
				// 해당메뉴에 매핑된 최초전단을 설정한다.
				if ( index == 0 ){
					document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+decodeURIComponent(item['menu_no']); //iframe바인딩					
					$("#modify_menu_no").text( decodeURIComponent(item['menu_no']) ); //화면에 전단번호 노출!!
					$("#modify_menu_type_cd").text( decodeURIComponent(item['menu_type_cd']) ); //화면에 전단번호 노출!!
				}

				// 첫번째 메뉴를 활성화 한다.
				$("#myplanb_menu li:first-child").addClass("active");
			});

		}
	});	
}

// 행사/전단의 좌측 메뉴 클릭시, iframe src 호출용 함수이다.
function leafletLink(rcv_menu_no, rcv_vm_cp_no, rcv_menu_type_cd){
	
	$("#myplanb_menu li").removeClass("active");
	$("#menu_"+rcv_menu_no).addClass("active");

	$("#modify_menu_no").text(rcv_menu_no);	
	$("#modify_menu_type_cd").text(rcv_menu_type_cd);		
	$("#modify_jd_prod_con_no").text("");		

	/* 해당 메뉴의 전단의 새상품추가의 순서를 다시 셋팅한다. */
	getPdOrder();

	document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no+"&menu_type_cd="+rcv_menu_type_cd;
}

// // 좌측 메뉴리스트를 가져온다
// function getLeftNav_bak(rcv_vm_cp_no) {

// 	/* 최초 메뉴 로딩시, 전단번호와 메뉴번호를 초기화한다. */
// 	setCookie1("jd_no","null",1);
// 	setCookie1("menu_no","null",1);
// 	setCookie1("menu_type_cd","null",1);

// 	/* 해당 메뉴에 전단이 셋팅되어 있지 않으면, 전단삭제 버튼을 숨긴다. */
// 	if (getCookie("jd_no") == "null")
// 	{
// 		$(".leaflet_mng_prod").hide();
// 		$(".leaflet_new").hide();
// 		$(".leaflet_del").hide();
// 	}else{
// 		$(".leaflet_mng_prod").show();
// 		$(".leaflet_new").show();
// 		if ( getCookie("jd_prod_con_no") == "" )
// 		{
// 			$(".leaflet_del").hide();
// 		}else{
// 			$(".leaflet_del").show();
// 		}
// 	}

// 	/* 최초로딩시 새로운 전단제작하기 버튼을 숨기고, 메뉴셋팅시 보여준다. */
// 	$(".new_leaflet_wrap").hide();

//     $.ajax({
//         url:'/back/03_leaflet/leafletUserMenu.jsp?random=' + (Math.random()*99999), 
//         data : {userCompanyNo: rcv_vm_cp_no},
//         method : 'GET' 
//     }).done(function(result){
//         //console.log("noticeList=========================================");
//         if(result == ('NoN') || result == 'list error' || result == 'empty'){
//             //console.log(result);
// 			$('#myplanb_menu').empty();
//         }else{
//             // 찾아봐도 없는 요소 임! $("#noticeList").html("");
//             //console.log("============= notice callback ========================");
//             //console.log(result);
//             var data = JSON.parse(result);

// 			$('#myplanb_menu').empty();

// 			/* 최초로 메뉴를 생성할때 또는 전단을 제작하고 돌아왔을때, 파라미터로 메뉴번호를 받는다. */
// 			if (menu_no == "")
// 			{
// 				data['myplanb_menu'].forEach(function(item, index){                        
					
// 					// 해당메뉴에 매핑된 최초전단을 설정한다.
// 					if ( index == 0 )
// 					{
// 						$('#myplanb_menu').append('<li id="menu_'+decodeURIComponent(item['menu_no'])+'" onclick="leafletLink('+decodeURIComponent(item['jd_no'])+', '+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+', '+rcv_vm_cp_no+', \''+decodeURIComponent(item['menu_type_cd'])+'\');">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
						
// 						//판매장번호와 메뉴번호를 앱화면과 파라미터로 호출한다.
// 						document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+"&jd_no="+decodeURIComponent(item['jd_no']);
						
// 						setCookie1("jd_no",decodeURIComponent(item['jd_no']),1);
// 						setCookie1("menu_no",decodeURIComponent(item['menu_no']),1);
// 						setCookie1("menu_type_cd",decodeURIComponent(item['menu_type_cd']),1);

// 						//화면에 전단번호 노출!!
// 						$("#modify_jd_no").text( decodeURIComponent(item['jd_no']) );

// 						/* 최초메뉴가 있을 경우, 메뉴에 구성될 새로운 전단 제작하기 버튼을 활성화한다. */
// 						$(".new_leaflet_wrap").show();

// 						/* 해당 메뉴에 전단이 셋팅되어 있지 않으면 */
// 						if (getCookie("jd_no") == "null")
// 						{
// 							// 전단삭제 버튼을 숨긴다.
// 							$(".leaflet_del_prod").hide();
// 							// 전단관리 버튼을 숨긴다.
// 							$(".leaflet_mng_prod").hide();							
// 							// 새상품추가 버튼을 숨긴다.
// 							$(".leaflet_new").hide();
// 							// 상품삭제 버튼을 숨긴다.
// 							$(".leaflet_del").hide();

// 						/* 해당 메뉴에 전단이 셋팅되어 있다면 */
// 						}else{
// 							// 전단삭제 버튼을 보여준다.
// 							$(".leaflet_del_prod").show();
// 							// 전단관리 버튼을 보여준다.
// 							$(".leaflet_mng_prod").show();							
// 							// 새상품추가 버튼을 보여준다.
// 							$(".leaflet_new").show();
// 							// 선택된 전단이 없다면
// 							if ( getCookie("jd_prod_con_no") == "" )
// 							{
// 								// 상품삭제 버튼을 숨긴다.
// 								$(".leaflet_del").hide();
// 							}else{
// 								// 상품삭제 버튼을 보여준다.
// 								$(".leaflet_del").show();
// 							}
// 						}

// 					// 최초가 아닌 두번째전단부터는 다음과 같이 메뉴를 구성한다.
// 					}else{
// 						$('#myplanb_menu').append('<li id="menu_'+decodeURIComponent(item['menu_no'])+'" onclick="leafletLink('+decodeURIComponent(item['jd_no'])+', '+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+', '+rcv_vm_cp_no+', \''+decodeURIComponent(item['menu_type_cd'])+'\');" >'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
// 					}

// 					// 첫번째 메뉴를 활성화 한다.
// 					$("#myplanb_menu li:first-child").addClass("active");
// 				});

// 			/* 상단메뉴 또는 좌측메뉴를 눌러 진입할때 */
// 			}else{

// 				data['myplanb_menu'].forEach(function(item, index){                        
					
// 					// 해당메뉴에 매핑된 최초전단을 설정한다.
// 					if ( item['menu_no'] == menu_no )
// 					{
// 						$('#myplanb_menu').append('<li id="menu_'+decodeURIComponent(item['menu_no'])+'" onclick="leafletLink('+decodeURIComponent(item['jd_no'])+', '+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+', '+rcv_vm_cp_no+', \''+decodeURIComponent(item['menu_type_cd'])+'\');">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
						
// 						//판매장번호와 메뉴번호를 앱화면과 파라미터로 호출한다.
// 						document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+"&jd_no="+decodeURIComponent(item['jd_no']);
						
// 						setCookie1("jd_no",decodeURIComponent(item['jd_no']),1);
// 						setCookie1("menu_no",decodeURIComponent(item['menu_no']),1);
// 						setCookie1("menu_type_cd",decodeURIComponent(item['menu_type_cd']),1);

// 						//화면에 전단번호 노출!!
// 						//$("#modify_jd_no").text( decodeURIComponent(item['jd_no']) );

// 						/* 최초메뉴가 있을 경우, 메뉴에 구성될 새로운 전단 제작하기 버튼을 활성화한다. */
// 						$(".new_leaflet_wrap").show();
// 						$("#menu_"+menu_no).addClass("active");

// 						/* 최초메뉴가 있을 경우, 메뉴에 구성될 새로운 전단 제작하기 버튼을 활성화한다. */
// 						$(".new_leaflet_wrap").show();

// 						/* 해당 메뉴에 전단이 셋팅되어 있지 않으면 */
// 						if (getCookie("jd_no") == "null")
// 						{
// 							// 전단삭제 버튼을 숨긴다.
// 							$(".leaflet_del_prod").hide();
// 							// 전단관리 버튼을 숨긴다.
// 							$(".leaflet_mng_prod").hide();							
// 							// 새상품추가 버튼을 숨긴다.
// 							$(".leaflet_new").hide();
// 							// 상품삭제 버튼을 숨긴다.
// 							$(".leaflet_del").hide();

// 						/* 해당 메뉴에 전단이 셋팅되어 있다면 */
// 						}else{
// 							// 전단삭제 버튼을 보여준다.
// 							$(".leaflet_del_prod").show();
// 							// 전단관리 버튼을 보여준다.
// 							$(".leaflet_mng_prod").show();							
// 							// 새상품추가 버튼을 보여준다.
// 							$(".leaflet_new").show();
// 							// 선택된 전단이 없다면
// 							if ( getCookie("jd_prod_con_no") == "" )
// 							{
// 								// 상품삭제 버튼을 숨긴다.
// 								$(".leaflet_del").hide();
// 							}else{
// 								// 상품삭제 버튼을 보여준다.
// 								$(".leaflet_del").show();
// 							}
// 						}

// 					// 다른 메뉴는 다음과 같이 메뉴를 구성한다.
// 					}else{
// 						$('#myplanb_menu').append('<li id="menu_'+decodeURIComponent(item['menu_no'])+'" onclick="leafletLink('+decodeURIComponent(item['jd_no'])+', '+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+', '+rcv_vm_cp_no+', \''+decodeURIComponent(item['menu_type_cd'])+'\');" >'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
// 					}

// 				});	
// 			}
//         }
//     });
// }

// // 행사/전단의 좌측 메뉴 클릭시, iframe src 호출용 함수이다.
// function leafletLink_bak(rcv_jd_no, rcv_menu_no, rcv_vm_cp_no, rcv_menu_type_cd){
	
// 	$("#myplanb_menu li").removeClass("active");
// 	$("#menu_"+rcv_menu_no).addClass("active");

// 	setCookie1("jd_no",rcv_jd_no);
// 	setCookie1("menu_no",rcv_menu_no);
// 	setCookie1("menu_type_cd",rcv_menu_type_cd);

// 	/* 페이지 로딩시, 최초 상품컨텐츠선택을 초기화한다. */
// 	setCookie1("jd_prod_con_no","", 1);	

// 	/* 해당 메뉴의 전단의 새상품추가의 순서를 다시 셋팅한다. */
// 	getPdOrder();

// 	/* 해당 메뉴에 전단이 셋팅되어 있지 않으면, 전단삭제 버튼을 숨긴다. */
// 	if (getCookie("jd_no") == "null")
// 	{
// 		$(".leaflet_del_prod").hide();
// 		$(".leaflet_mng_prod").hide();
// 		$(".leaflet_new").hide();
// 		$(".leaflet_del").hide();
// 	}else{
// 		$(".leaflet_del_prod").show();
// 		$(".leaflet_mng_prod").show();		
// 		$(".leaflet_new").show();
// 		if ( getCookie("jd_prod_con_no") == "" )
// 		{
// 			$(".leaflet_del").hide();
// 		}else{
// 			$(".leaflet_del").show();
// 		}
// 	}

// 	document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no+"&jd_no="+rcv_jd_no;
// }

// 상품삭제 버튼 클릭시, 함수실행된다.
function delete_btn(){ 
	var rcv_jd_prod_con_no = $("#modify_jd_prod_con_no").text();
	if ( rcv_jd_prod_con_no != "" && confirm("정말 삭제하시겠습니까(전단상품번호:"+rcv_jd_prod_con_no+")??") == true){
		$.ajax({
			url:'/back/03_leaflet/leafletJdProdConNoDelete.jsp?random=' + (Math.random()*99999),
			data : {jd_prod_con_no: rcv_jd_prod_con_no },
			method : 'GET' 
		}).done(function(result){

			//console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				//console.log(result);
			}else{
				//console.log("============= notice callback ========================");
				//console.log(result);
				alert("삭제 완료되었습니다.");
				$('#nh_leaflet').get(0).contentDocument.location.reload();
				setTimeout(function(){ cssRetach(); }, 1500);
			}
		});

	}else{   //취소
		return;
	}
}

//20200424-김대윤-사용않함!
// 전단삭제 버튼 클릭시, 함수실행된다.
// function delete_jdbtn(){ 
// 	if (confirm("현재 전단을 삭제하시겠습니까??") == true){
// 		$.ajax({
// 			url:'/back/03_leaflet/leafletJdDelete.jsp?random=' + (Math.random()*99999),
// 			data : {jd_no: getCookie("jd_no")},
// 			method : 'GET' 
// 		}).done(function(result){
// 			//console.log("noticeList=========================================");
// 			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
// 				//console.log(result);
// 			}else{
// 				//console.log("============= notice callback ========================");
// 				//console.log(result);
// 				alert("삭제 완료되었습니다.");
// //				$('#nh_leaflet').get(0).contentDocument.location.reload();
// //				setTimeout(function(){ cssRetach(); }, 2000);
// 				location.href="/leaflet/leaflet.html?menu_no="+getCookie("menu_no");
// 			}
// 		});
// 	}else{   //취소
// 		return;
// 	}
// }

function manage_jdbtn(){

	var userCompanyNo = $("#sort_select").val();
	var menuNo = $("#modify_menu_no").text();
	//var userCompanyNo = getCookie("onSelectCompanyNo");
	//var menuNo = getCookie("menu_no");
	$.ajax({
		url:'/back/03_leaflet/leafletJdList.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, menuNo: menuNo},
		method : 'GET' 
	}).done(function(result){
		//console.log("leafletJdList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			//console.log(result);
		}else{
			//console.log("============= leafletJdList callback ========================");
			//console.log(result);
			var data = JSON.parse(result);
			$('#layer_popup_leaflet_list').empty();
			var text = '';
			data['leaflet_list'].forEach(function(item, index){ 
				text += '    <tr>           ';
				text += '        <td>' + decodeURIComponent(item['jd_no'])            + '</td> ';					
				text += '        <td>' + decodeURIComponent(item['period'])           + '</td> ';	
				text += '        <td>' + decodeURIComponent(item['banner_cnt'])       + '</td> ';	
				text += '        <td>' + decodeURIComponent(item['prod_content_cnt']) + '</td> ';	
				text += '        <td>' + decodeURIComponent(item['shorten_url'])      + '</td> ';	
				text += '        <td><button onclick="manage_srturl_create('+ decodeURIComponent(item['jd_no']) +')">생성</button></td>  ';
				text += '        <td><button onclick="manage_jd_delete('+ decodeURIComponent(item['jd_no']) +')">삭제</button></td>  ';
				text += '    </tr>          ';
			});
			//console.log(text);
			$("#layer_popup_leaflet_list").append(text);
			$("#layer_popup_leaflet_wrap").show();			
		}
	});	
}

function manage_pagination_jdbtn(){
	var userRoleCd = getCookie('userRoleCd');
	var userCompanyNo = $("#sort_select").val();
	var menuNo = $("#modify_menu_no").text();
	//var userCompanyNo = getCookie("onSelectCompanyNo");
	//var menuNo = getCookie("menu_no");	
	$('#pagination').pagination({
		dataSource: '/back/03_leaflet/leafletJdListPagination.jsp?userRoleCd='+userRoleCd+'&userCompanyNo='+userCompanyNo+'&menuNo='+menuNo,
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			console.log(list);
			var $tbody = $('#layer_popup_leaflet_list').empty();
			_.forEach(list,
				function(item) {
					$tbody.append(tpl_tr_tab1_table(item));
				}
			);
			$("#layer_popup_leaflet_wrap").show();	
		},
		formatAjaxError: function(jqXHR) {
			alert(jqXHR.responseJSON.error);
			//window.history.back();
			deleteAllCookies();
			login();
		}
	});
}

function manage_srturl_create(rcv_jd_no){
	if (confirm("단축URL을 생성하시겠습니까?") == true){
		$.ajax({
			url:'/back/03_leaflet/LeafletUpdateShortURL.jsp?random=' + (Math.random()*99999), 
			data : {jd_no: rcv_jd_no},
			method : 'GET' 
		}).done(function(result){
			//console.log("LeafletUpdateShortURL=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){
				//console.log(result);
				alert("단축URL 생성실패(전단번호 없음)");
			}else if(result == 'Dup'){
				alert("이미 단축URL이 생성되어 있습니다");
			}else if(result == 'exception error'){
				alert("단축URL 생성실패(exception error)");
			}else{ //success
				//console.log("============= LeafletUpdateShortURL callback ========================");
				console.log(result);
				manage_jdbtn();
			}
		});
	}else{   //취소
		return;
	}
}

function manage_jd_delete(rcv_jd_no){
	if (confirm("전단을 삭제하시겠습니까??") == true){
		$.ajax({
			url:'/back/03_leaflet/leafletJdDelete.jsp?random=' + (Math.random()*99999),
			data : {jd_no: rcv_jd_no},
			method : 'GET' 
		}).done(function(result){
			//console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				//console.log(result);
			}else{
				//console.log("============= notice callback ========================");
				//console.log(result);
				// alert("삭제 완료되었습니다.");
				manage_jdbtn();
			}
		});
	}else{   //취소
		return;
	}	
}

function manage_close_jdbtn(){
	$("#layer_popup_leaflet_wrap").hide();
}

/*common2에도 있어서 주석처리함 200106 김나영*/

//// 우상단 판매장을 리스팅한다.
//function getManagerList() {
//
//    $.ajax({
//        url:'/back/03_leaflet/leafletManagerList.jsp?random=' + (Math.random()*99999),
//		data : {userCompanyNo: vm_cp_no},
//        method : 'GET' 
//    }).done(function(result){
//
//        console.log("noticeList=========================================");
//        if(result == ('NoN') || result == 'list error' || result == 'empty'){
//            console.log(result);
//        }else{
//            $("#noticeList").html("");
//            console.log("============= notice callback ========================");
//            console.log(result);
//            var data = JSON.parse(result);
//
//            data['CompanyList'].forEach(function(item, index){                        
//                $("#sort_select").append('<option value="'+decodeURIComponent(item['VM_CP_NO']).replace(/\+/g,' ')+'">'+decodeURIComponent(item['VM_CP_NAME']).replace(/\+/g,' ')+'</option>');
//            });
//        }
//    });
//}

//동일 이벤트 함수 중복으로 인한 주석처리 - 20200429-김대윤
/*판매장 변경시, iframe reload 한다.*/
// $("#sort_select").on("change",function(){
// 	if ($("#sort_select").val() == "" )
// 	{
// 	}else{
// 		document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+vm_cp_no;
// 	}
// });


/*전단 기간 확인버튼 클릭시, 전단 기간을 업데이트 한다.*/
$("#category_update_btn").on("click",function(){
	var from_date_origin = encodeURIComponent($("#from_date_origin").val());
	var to_date_origin = encodeURIComponent($("#to_date_origin").val());
	var jd_no = encodeURIComponent($("#date_jd_no").val());
	var rcv_menu_type_cd = $("#modify_menu_type_cd").text();

	if ( from_date_origin == null || chrLen(from_date_origin) == 0)
	{
		alert("전단 시작일을 입력하시기 바랍니다.");
		return false;
	}

	if ( to_date_origin == null || chrLen(to_date_origin) == 0)
	{
		alert("전단 종료일을 입력하시기 바랍니다.");
		return false;
	}

	/* 20200316 특가형전단의 경우, 동일날짜 입력 시작 */
	if (rcv_menu_type_cd == "MENU4" || rcv_menu_type_cd == "MENU5" || rcv_menu_type_cd == "MENU6")
	{
		if (from_date_origin != to_date_origin)
		{
			alert("특가형전단의 경우, 시작일과 종료일을 동일한 날짜로 입력하시기 바랍니다.");
			return false;
		}
	}
	/* 20200316 특가형전단의 경우, 동일날짜 입력 끝 */

	$.ajax({
        url:'/back/03_leaflet/leafletDateCategoryUpdate.jsp?random=' + (Math.random()*99999),
		data : {from_date_origin: from_date_origin, to_date_origin: to_date_origin, jd_no: jd_no},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/* 배너 이미지파일 업로더 */
$("#banner_add_btn").on("click",function(){

	var jd_no = $("#modify_jd_no").text();
	var rcv_vm_cp_no = $("#sort_select").val();
	var rcv_menu_no = $("#modify_menu_no").text();

	var inputFile = document.getElementById('uploadFile');
	new bannerUpload(inputFile, function(result){
		$("#new_banner_path").val(result);			
		//var jd_no = getCookie("jd_no");
		if ( result == null || chrLen(result) == 0)
		{
			alert("배너 이미지를 업로드하시기 바랍니다.");
			return false;
		}else{
			bannerInsert(result, jd_no);	
			$(".leaflet_banner").removeClass("active");
			//window.location.reload();
			document.getElementById("nh_leaflet").src = "../app/m_leaflet/m_leaflet.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no;
		}					
	});
});

/* 배너 이미지파일 업로더 */
function bannerInsert(rcvResult, rcv_jd_no){
	$.ajax({
		url:'/back/03_leaflet/leafletBannerInsert.jsp?random=' + (Math.random()*99999),
		data : {jd_no: rcv_jd_no, img_path: rcvResult},
		method : 'GET' 
	}).done(function(result){

		//console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			//console.log(result);
		}else{
			$("#noticeList").html("");
			//console.log("============= notice callback ========================");
			//console.log(result);
		}
	});
	alert("배너 업로드 완료하였습니다.");
}

/*배너리스트 확인버튼 클릭시, 배너리스트정렬순서를 업데이트 한다.*/
$("#banner_edit_btn").on("click",function(){
	//var jd_no = encodeURIComponent($("#banner_jd_no").val());
	//var jd_no = encodeURIComponent(getCookie("jd_no"));
	var jd_no = $("#modify_jd_no").text();
	var bannerOrderStr = getCookie("bannerOrderStr");

	if ( bannerOrderStr == null || chrLen(bannerOrderStr) == 0)
	{
		alert("배너 정렬을 진행하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletBannerListUpdate.jsp?random=' + (Math.random()*99999),
		data : {jd_no: jd_no, bannerOrderStr: bannerOrderStr},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
			$(".leaflet_banner").removeClass("active");
			$(".item_list_banner_wrap").removeClass("active");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*썸네일 이미지 업로더*/
var thumUpload = document.getElementById('thum_add_btn');
thumUpload.addEventListener('click', function(evt){
	var inputFile = document.getElementById('uploadFile_thum');
	new Upload(inputFile, function(result){
		$("#new_thum_path").val(result);
//		$("#airtel_thumnail_path_img").attr("src", "/upload/"+result);

		thumnailInsert(result);
//		alert("이미지 추가하기를 완료하였습니다.");
	});
});

/*썸네일 이미지 추가하기 클릭시, 이미지경로를 받아, 이미지를 insert 한후, 전단상품컨텐츠에 이미지번호를 update 한다.*/
function thumnailInsert(imgPath){
	var pd_no_thum = encodeURIComponent($("#pd_no_thum").val());
	var pd_code_thum = encodeURIComponent($("#pd_code_thum").val());

	$.ajax({
        url:'/back/03_leaflet/leafletPdThumnailInsert.jsp?random=' + (Math.random()*99999),
		data : {imgPath: imgPath, pdNo: pd_no_thum, pdCode: pd_code_thum, userNo: getCookie("userNo")},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            //console.log("============= notice callback ========================");
            //console.log(result);
			
			thumnailUpdate(result);

//			$('#nh_leaflet').get(0).contentDocument.location.reload();

        }
    });
}

/*썸네일 이미지 클릭시, 이미지번호를 받아, 업데이트 한다.*/
function thumnailUpdate(imgNo){
	var jd_prod_con_no_prod_thum = encodeURIComponent($("#jd_prod_con_no_prod_thum").val());

	if ( imgNo == null || chrLen(imgNo) == 0)
	{
		alert("썸네일을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletPdThumnailUpdate.jsp?random=' + (Math.random()*99999),
		data : {imgNo: imgNo, jd_prod_con_no: jd_prod_con_no_prod_thum},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("이미지 수정이 완료되었습니다.");
            $("#searchText").val("");
            $("#searchResultGroup").empty();
			$(".leaflet_image").removeClass("active");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
					
//			setTimeout(function(){ ThumCSS(); }, 1500);
			setTimeout(function(){ cssRetach(); }, 1500);

        }
    });
}

// 상품오더 순서를 가져온다.
function getPdOrder() {
	//rcvJdNo = getCookie("jd_no");
	var rcvJdNo = $("#modify_jd_no").text();
    $.ajax({
        url:'/back/03_leaflet/leafletPdOrder.jsp?random=' + (Math.random()*99999), 
        data : {jd_no: rcvJdNo},
        method : 'GET'
    }).done(function(result){

        //console.log("PdOrderList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= PdOrderList callback ========================");
            //console.log(result);
            var data = JSON.parse(result);

			$('#pd_order').empty();

            data['PdOrderList'].forEach(function(item, index){                        
				
				var pd_tot = Number(decodeURIComponent(item['pdorder_tot']));

				for (h=1;h<=pd_tot;h++ )
				{
					if ( h == 1 )
					{
						$('#pd_order').append('<option value='+h+' selected>'+h+'</option>');	
					
					}else{
						$('#pd_order').append('<option value='+h+'>'+h+'</option>');
					}
				}
				
			});
        }
    });
}

function ThumCSS(){
	$("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
			   $(".new_item_wrap").hide();
			   $(document).find(".leaflet_edit_wrap>div").removeClass("active");
			   $(document).find(".leaflet_image").toggleClass("active");
			});
}
//검색결과를 가져온다.(엔터시)

$("#searchText").on("keyup",function(){
	if( event.keyCode==13 ){
		var searchText = $("#searchText").val();

		if ( searchText == null || chrLen(searchText) == 0)
		{
			alert("검색어를 입력하시기 바랍니다.");
			return false;
		}

		$.ajax({
			url:'/back/03_leaflet/leafletSearchList.jsp?random=' + (Math.random()*99999), 
			data : {searchText: searchText},
			method : 'GET' 
		}).done(function(result){

			//console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'list error' || result == 'empty'){
				//console.log(result);
				$("#searchResultGroup").empty();
			}else{
				//console.log("============= notice callback ========================");
				//console.log(result);
				var data = JSON.parse(result);
				$("#searchResultGroup").empty();
				$("#searchResultGroup").css({overflow:'scroll', height:'400px', textAlign:'left'});
				var i = 1;
				data['imgList'].forEach(function(item, index){
					if ( i % 4 == 0 ){
						$("#searchResultGroup").append('<li onclick="thumnailUpdate('+item['img_no']+')"><img src="/upload/'+item['img_path']+'"></li><br>');
					}else{
						$("#searchResultGroup").append('<li onclick="thumnailUpdate('+item['img_no']+')"><img src="/upload/'+item['img_path']+'"></li>');
					}					
					i++;
				});
				
			}
		});
	}
});

// 검색결과를 가져온다.(버튼 클릭시)
$("#thum_search_btn").on("click",function(){

	var searchText = $("#searchText").val();

	if ( searchText == null || chrLen(searchText) == 0)
	{
		alert("검색어를 입력하시기 바랍니다.");
		return false;
	}

    $.ajax({
        url:'/back/03_leaflet/leafletSearchList.jsp?random=' + (Math.random()*99999), 
        data : {searchText: searchText},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            //console.log(result);
			$("#searchResultGroup").empty();
        }else{
            //console.log("============= notice callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			$("#searchResultGroup").empty();
			$("#searchResultGroup").css({overflow:'scroll', height:'400px', textAlign:'left'});
            data['imgList'].forEach(function(item, index){                        
				$("#searchResultGroup").append('<li onclick="thumnailUpdate('+item['img_no']+')"><img src="/upload/'+item['img_path']+'"></li>');
			});
			
        }
    });
});

/*할인상세를 등록한다.*/
$("#sale_btn").on("click",function(){
	var jd_prod_con_no_discount = encodeURIComponent($("#jd_prod_con_no_discount").val());
	var card_discount = $("#card_discount").val();
	var card_discount_from_date = $("#card_discount_from_date").val();
	var card_discount_end_date = $("#card_discount_end_date").val();
	var card_info = $("#card_info").val();
	var card_restrict = $("#card_restrict").val();
	var coupon_discount = $("#coupon_discount").val();
	var dadaiksun = $("#dadaiksun").val();
	var dadaiksun_info = $("#dadaiksun_info").val();

	if ( card_discount == null || chrLen(card_discount) == 0)
	{
//		if ( chrLen(card_discount_from_date) > 0)
//		{
//			alert("카드 할인 시작일을 삭제하시기 바랍니다.");
//			return false;
//		}
//
//		if ( chrLen(card_discount_end_date) > 0)
//		{
//			alert("카드 할인 종료일을 삭제하시기 바랍니다.");
//			return false;
//		}
//
//		if ( chrLen(card_info) > 0)
//		{
//			alert("카드 정보를 삭제하시기 바랍니다.");
//			return false;
//		}
//
//		if ( chrLen(card_restrict) > 0)
//		{
//			alert("카드한정 정보를 삭제하시기 바랍니다.");
//			return false;
//		}
	}else{
		if ( card_discount_from_date == null || chrLen(card_discount_from_date) == 0)
		{
			alert("카드 할인 시작일을 입력하시기 바랍니다.");
			return false;
		}

		if ( card_discount_end_date == null || chrLen(card_discount_end_date) == 0)
		{
			alert("카드 할인 종료일을 입력하시기 바랍니다.");
			return false;
		}

		var cardDisFromNum = Number(replaceAll(card_discount_from_date,"-",""));
		var cardDisEndNum =  Number(replaceAll(card_discount_end_date,"-",""));

		if (cardDisFromNum - cardDisEndNum > 0)
		{
			alert("카드 할인 종료일은 카드 할인 시작일 이후 날짜여야만 합니다.");
			return false;
		}

		if ( card_info == null || chrLen(card_info) == 0)
		{
			alert("카드 정보를 입력하시기 바랍니다.");
			return false;
		}

//		if ( card_restrict == null || chrLen(card_restrict) == 0)
//		{
//			alert("카드한정 정보를 입력하시기 바랍니다.");
//			return false;
//		}
	}

	$.ajax({
        url:'/back/03_leaflet/leafletProductSaleUpdate.jsp?random=' + (Math.random()*99999),
		data : {jd_prod_con_no: jd_prod_con_no_discount, card_discount: card_discount, card_discount_from_date: card_discount_from_date, card_discount_end_date: card_discount_end_date, card_info: card_info, card_restrict: card_restrict, coupon_discount: coupon_discount, dadaiksun: dadaiksun, dadaiksun_info: dadaiksun_info},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("등록이 완료되었습니다.");
            $("#card_discount,#card_discount_from_date,#card_discount_end_date,#card_info,#card_restrict,#coupon_discount,#dadaiksun,#dadaiksun_info").val("");
			$(document).find(".leaflet_discount").removeClass("active");  
			$('#nh_leaflet').get(0).contentDocument.location.reload();
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품명 확인버튼 클릭시, 상품명을 업데이트 한다.*/
$("#pd_name_btn").on("click",function(){
	var jd_prod_con_no_prod_name = encodeURIComponent($("#jd_prod_con_no_prod_name").val());
	var pd_name = $("#pd_name").val();

	if ( pd_name == null || chrLen(pd_name) == 0)
	{
		alert("상품명을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletPdNameUpdate.jsp?random=' + (Math.random()*99999),
		data : {pd_name: pd_name, jd_prod_con_no: jd_prod_con_no_prod_name},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
            $("#pd_name").val("");
            $(".leaflet_goods_name").removeClass("active");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품가격 확인버튼 클릭시, 상품가격을 업데이트 한다.*/
$("#price_btn").on("click",function(){
	var jd_prod_con_no_price = encodeURIComponent($("#jd_prod_con_no_price").val());
	var price = encodeURIComponent($("#price").val());

	if ( price == null || chrLen(price) == 0)
	{
		alert("상품가격을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletPriceUpdate.jsp?random=' + (Math.random()*99999),
		data : {jd_prod_con_no: jd_prod_con_no_price, price: price},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("수정이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();
            $("#price").val("");
            $(".leaflet_goods_price").removeClass("active");
			setTimeout(function(){ cssRetach(); }, 1500);
        }
    });
});

/*상품을 개별등록한다.*/
$("#pd_create_btn").on("click",function(){
	var user_no = getCookie("userNo");
	//var jd_no = getCookie("jd_no");
	var jd_no = $("#modify_jd_no").text();
	var blank_chk = document.getElementsByName("blank_chk")[0].checked;
	var pd_order = $("#pd_order").val();
	var pd_code = $("#pd_code").val();
	var pd_name = $("#pd_name_new").val();
	var pd_price = $("#pd_price").val();
	var card_discount = $("#card_discount1").val();
	var card_startDate = $("#card_startDate").val();
	var card_endDate = $("#card_endDate").val();
	var card_info = $("#card_info1").val();
	var card_restrict = $("#card_restrict1").val();
	var coupon_discount = $("#coupon_discount1").val();
	var dadaiksun = $("#dadaiksun1").val();
	var dadaiksun_info = $("#dadaiksun_info1").val();
	var etc_info = $("#etc_info").val();
	
	if(blank_chk == true){ //빈칸만들기 체크
		var blank_fg = "Y";
	}else{
		var blank_fg = "N"; // 빈칸만들기 비체크

		if ( pd_code == null || chrLen(pd_code) == 0)
		{
			alert("상품코드를 입력하시기 바랍니다.");
			return false;
		}

		if ( pd_name == null || chrLen(pd_name) == 0)
		{
			alert("상품명을 입력하시기 바랍니다.");
			return false;
		}

		if ( pd_price == null || chrLen(pd_price) == 0)
		{
			alert("상품가격을 입력하시기 바랍니다.");
			return false;
		}
	}

	$.ajax({
        url:'/back/03_leaflet/leafletProductInsert.jsp?random=' + (Math.random()*99999),
		data : {blank_fg: blank_fg, user_no: user_no, jd_no: jd_no, pd_order: pd_order, pd_code: pd_code, pd_name: pd_name, pd_price: pd_price, card_discount: card_discount, card_startDate: card_startDate, card_endDate: card_endDate, card_info: card_info, card_restrict: card_restrict, coupon_discount: coupon_discount, dadaiksun: dadaiksun, dadaiksun_info: dadaiksun_info, etc_info: etc_info},
        method : 'GET' 
    }).done(function(result){

        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            //console.log(result);
        }else{
//            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            alert("등록이 완료되었습니다.");
			$('#nh_leaflet').get(0).contentDocument.location.reload();

			$("input:checkbox[name='blank_chk']").prop("checked", false);
            blank_chk == false;
            var blank_fg = "N";
            $("#pd_code").val("");
            $("#pd_name_new").val("");
            $("#pd_price").val("");
            $("#card_discount1").val("");
            $("#card_startDate").val("");
            $("#card_endDate").val("");
            $("#card_info1").val("");
            $("#card_restrict1").val("");
            $("#coupon_discount1").val("");
            $("#dadaiksun1").val("");
            $("#dadaiksun_info1").val("");
            $("#etc_info").val("");
            $("#pd_code").attr("disabled",false);
            $("#pd_name_new").attr("disabled",false);
            $("#pd_price").attr("disabled",false);
            $("#card_discount1").attr("disabled",false);
            $("#card_startDate").attr("disabled",false);
            $("#card_endDate").attr("disabled",false);
            $("#card_info1").attr("disabled",false);
            $("#card_restrict1").attr("disabled",false);
            $("#coupon_discount1").attr("disabled",false);
            $("#dadaiksun1").attr("disabled",false);
            $("#dadaiksun_info1").attr("disabled",false);
            $("#etc_info").attr("disabled",false);           
            
            $(".new_item_wrap").css("display","none");
            
			setTimeout(function(){ cssRetach(); }, 1500);
			
        }
    });
});

$("#nh_leaflet").load(function(){

	setTimeout(function(){ cssRetach(); }, 2000);
           
})


function cssRetach(){
	//$("#nh_leaflet").contents().find("body").append("<link href='../css/leaflet_iframe.css'><style>.bx-wrapper{cursor:pointer; max-width:100% !important; min-width:100% !important; width:100% !important; box-shadow : none;}.bx-wrapper:hover{background-color:#527eff; } .bx-wrapper.active{background-color:#527eff !important} .date_item_wrap{cursor:pointer} .item_list_inner_wrap .figure {width: calc(33.333% - 6px) !important;margin: 15px 0 0 5px !important;}#share_btn{display:none;}</style>");
	$("#nh_leaflet").contents().find("body").append("<link href='../css/leaflet_iframe.css'><style>.bx-wrapper{cursor:pointer; max-width:100% !important; min-width:100% !important; width:100% !important; box-shadow : none;}.bx-wrapper:hover{background-color:#527eff; } .bx-wrapper.active{background-color:#527eff !important} .date_item_list_wrap{cursor:pointer} .item_list_inner_wrap .figure {width: calc(33.333% - 6px) !important;margin: 15px 0 0 5px !important;}#share_btn{display:none;}</style>");
       
	$("#nh_leaflet").contents().find(".date_item_list_wrap").click(function(){
		$(".new_item_wrap").hide();
		$(document).find(".leaflet_edit_wrap>div").removeClass("active");
		$("#nh_leaflet").contents().find(".thumb_wrap>a>img, .price,  .product,.item_list_banner_wrap").css("background-color","#fff");
		$("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
		$(this).css("border","2px solid #4ba8ff");
		$(document).find(".leaflet_date").toggleClass("active");
	});	   

	// 기존 슬라이딩 방식의 날짜 표시 DIV 사용 않함!!
	// $("#nh_leaflet").contents().find(".date_item_wrap").click(function(){
	// 	$(".new_item_wrap").hide();
	// 	$(document).find(".leaflet_edit_wrap>div").removeClass("active");
	// 	$("#nh_leaflet").contents().find(".thumb_wrap>a>img, .price,  .product,.item_list_banner_wrap").css("background-color","#fff");
	// 	$("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
	// 	$(this).css("border","2px solid #4ba8ff");
	// 	$(document).find(".leaflet_date").toggleClass("active");
	// });	   	   

	$("#nh_leaflet").contents().find(".bx-wrapper").click(function(){
		//$("#nh_leaflet").contents().find(".thumb_wrap>a>img, .price, .product,.item_list_banner_wrap,.date_item_wrap").css("background-color","#fff");
		$("#nh_leaflet").contents().find(".thumb_wrap>a>img, .price, .product,.item_list_banner_wrap,.date_item_list_wrap").css("background-color","#fff");
		$("#nh_leaflet").contents().find(".discount_info, .thumb_wrap>a>img").css("border","0");
		$(this).addClass("active");
		$("#sortable").empty();
		$(document).find(".leaflet_edit_wrap>div").removeClass("active");
		$(document).find(".leaflet_banner").toggleClass("active");
	});
           
	$("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
		$(".new_item_wrap").hide();
		$(document).find(".leaflet_edit_wrap>div").removeClass("active");
		$(document).find(".leaflet_image").toggleClass("active");
	});
		
	$("#nh_leaflet").contents().find(".product").click(function(){
		$(".new_item_wrap").hide();
		$(document).find(".leaflet_edit_wrap>div").removeClass("active");
		$(document).find(".leaflet_goods_name").toggleClass("active");
	});

	$("#nh_leaflet").contents().find(".price").click(function(){
		$(".new_item_wrap").hide();
		$(document).find(".leaflet_edit_wrap>div").removeClass("active");
		$(document).find(".leaflet_goods_price").toggleClass("active");
	});
		
	$("#nh_leaflet").contents().find(".discount_info").click(function(){
		$(".new_item_wrap").hide();
		$(document).find(".leaflet_edit_wrap>div").removeClass("active");
		$(document).find(".leaflet_discount").toggleClass("active");              
	});
		
	$(".cls_btn").click(function(){
		$("#nh_leaflet").contents().find(".item_list_banner_wrap").removeClass("active");
		$(this).parent("div").removeClass("active");
	});
}

function new_leaflet_create(){
	var rcv_vm_cp_no = $("#sort_select").val();
	var rcv_menu_no = $("#modify_menu_no").text();
	var rcv_menu_type_cd = $("#modify_menu_type_cd").text();
	window.location.href = "../leaflet/leaflet_create.html?vm_cp_no="+rcv_vm_cp_no+"&menu_no="+rcv_menu_no+"&menu_type_cd="+rcv_menu_type_cd;
}