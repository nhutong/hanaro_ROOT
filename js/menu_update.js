$(function () {

	/* 공통부분 시작======================================================================== */
	getHeader();
	$(".nav_home").addClass("active");

	getLeft();
	getLeftMenu('home');
	$("#nh_home_menu_edit").addClass("active");

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

	/* 숨김여부 반영하기 버튼 - 숨기기여부를 반영한다. */
    $("#applyBtn").on("click",function(){
		
		if ( CuserCompanyNo == null || chrLen(CuserCompanyNo) == 0)
		{
			alert("로그인후 수정하시기 바랍니다.");
			return false;
		}

		var values = document.getElementsByName("hide_fg");
		for (var i=0; i<values.length; i++)
		{
			if (values[i].checked)
			{
				//alert(values[i].value);

				$.ajax({
					url:'/back/04_home/menuMngUpdate.jsp?random=' + (Math.random()*99999),
					data : {hide_fg: "Y", menu_no: values[i].value},
					method : 'GET' 
				}).done(function(result){

					console.log("noticeList=========================================");
					if(result == ('NoN') || result == 'exception error' || result == 'empty'){
						console.log(result);
					}else{
						console.log("============= notice callback ========================");
						console.log(result);
						//alert("수정이 완료되었습니다.");
						//window.location.reload();
					}
				});

			}else{
				
				$.ajax({
					url:'/back/04_home/menuMngUpdate.jsp?random=' + (Math.random()*99999),
					data : {hide_fg: "N", menu_no: values[i].value},
					method : 'GET' 
				}).done(function(result){

					console.log("noticeList=========================================");
					if(result == ('NoN') || result == 'exception error' || result == 'empty'){
						console.log(result);
					}else{
						console.log("============= notice callback ========================");
						console.log(result);
						//alert("수정이 완료되었습니다.");
						//window.location.reload();
					}
				});

			}
		}

		var values = document.getElementsByName("event_fg");
		if (values[0].checked){
			$.ajax({
				url:'/back/04_home/menuMngDefaultUpdate.jsp?random=' + (Math.random()*99999),
				data : {event_fg: "Y", vm_cp_no: getCookie("onSelectCompanyNo")},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					//alert("수정이 완료되었습니다.");
					//window.location.reload();
				}
			});
		}else{			
			$.ajax({
				url:'/back/04_home/menuMngDefaultUpdate.jsp?random=' + (Math.random()*99999),
				data : {event_fg: "N", vm_cp_no: getCookie("onSelectCompanyNo")},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					//alert("수정이 완료되었습니다.");
					//window.location.reload();
				}
			});
		}

		var values1 = document.getElementsByName("coupon_fg");
		if (values1[0].checked){
			$.ajax({
				url:'/back/04_home/menuMngDefaultUpdate.jsp?random=' + (Math.random()*99999),
				data : {coupon_fg: "Y", vm_cp_no: getCookie("onSelectCompanyNo")},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					//alert("수정이 완료되었습니다.");
					//window.location.reload();
				}
			});
		}else{			
			$.ajax({
				url:'/back/04_home/menuMngDefaultUpdate.jsp?random=' + (Math.random()*99999),
				data : {coupon_fg: "N", vm_cp_no: getCookie("onSelectCompanyNo")},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					//alert("수정이 완료되었습니다.");
					//window.location.reload();
				}
			});
		}
/* 장보기 메뉴 숨김했으므로 해당 체크로직 주석처리
		var values2 = document.getElementsByName("jang_fg");
		if (values2[0].checked){
			$.ajax({
				url:'/back/04_home/menuMngDefaultUpdate.jsp?random=' + (Math.random()*99999),
				data : {jang_fg: "Y", vm_cp_no: getCookie("onSelectCompanyNo")},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					//alert("수정이 완료되었습니다.");
					//window.location.reload();
				}
			});
		}else{			
			$.ajax({
				url:'/back/04_home/menuMngDefaultUpdate.jsp?random=' + (Math.random()*99999),
				data : {jang_fg: "N", vm_cp_no: getCookie("onSelectCompanyNo")},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					//alert("수정이 완료되었습니다.");
					//window.location.reload();
				}
			});
		}
	*/	
		alert("수정이 완료되었습니다.");
		window.location.reload();
	});
});

// 메뉴리스트를 바인딩한다.
function getMenuList(rcvCompanyNo) {

    $.ajax({
        url:'../back/04_home/menuCreateSelect.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

		var text = "";

		$("#sortable").empty();

        text += '<li class="ui-state-default ui-state-disabled">';
		text += '	<div class="menu_update_top">홈</div>';
        text += '    <div class="menu_update_bot">-</div>';
        text += '</li>';
				   
        console.log("menuList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			if (rcvCompanyNo == 0)
			{
			}else{

				//text += '<li class="ui-state-default ui-state-disabled">';
				//text += '	<div class="menu_update_top">이벤트</div>';
				//text += '    <div class="menu_update_bot">-</div>';
				//text += '</li>';

				//text += '<li class="ui-state-default ui-state-disabled">';
				//text += '	<div class="menu_update_top">쿠폰</div>';
				//text += '    <div class="menu_update_bot">-</div>';
				//text += '</li>';

				//text += '<li class="ui-state-default ui-state-disabled">';
				//text += '	<div class="menu_update_top">장보기</div>';
				//text += '    <div class="menu_update_bot">-</div>';
				//text += '</li>';

				//$("#sortable").append(text);

				getMenuListDefault(rcvCompanyNo);
			}
		
        }else{

            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
			var jsonResult_menu = data.CompanyList

			for(var i in jsonResult_menu){


				   if ( jsonResult_menu[i].hide_fg == "Y" )
				   {
					    text +='<li class="ui-state-default" id="'+jsonResult_menu[i].menu_no+'">';
					    text +='   <div class="menu_update_top">'+jsonResult_menu[i].menu_name+'<br><span> (숨김)</span></div>';
					    text +='   <div class="menu_update_bot">'; 
						text +='     <input type="checkbox" name="hide_fg" value="'+jsonResult_menu[i].menu_no+'" checked>';
				   }else{
						text +='<li class="ui-state-default" id="'+jsonResult_menu[i].menu_no+'">';
						text +='   <div class="menu_update_top">'+jsonResult_menu[i].menu_name+'</div>';
						text +='   <div class="menu_update_bot">'; 
						text +='     <input type="checkbox" name="hide_fg" value="'+jsonResult_menu[i].menu_no+'">';
				   }      
                   text +='   </div>';
                   text +='</li>';
			}

			//text += '<li class="ui-state-default ui-state-disabled">';
			//text += '	<div class="menu_update_top">이벤트</div>';
			//text += '    <div class="menu_update_bot">-</div>';
			//text += '</li>';

			//text += '<li class="ui-state-default ui-state-disabled">';
			//text += '	<div class="menu_update_top">쿠폰</div>';
			//text += '    <div class="menu_update_bot">-</div>';
			//text += '</li>';

			//text += '<li class="ui-state-default ui-state-disabled">';
			//text += '	<div class="menu_update_top">장보기</div>';
			//text += '    <div class="menu_update_bot">-</div>';
			//text += '</li>';


			$("#sortable").append(text);
//			sortableMenu();
			getMenuListDefault(rcvCompanyNo);
			
        }
    });
}


function sortableMenu(){
	$("#sortable").sortable({
		  items: "li:not(.ui-state-disabled)",
		  update: function () {
				  var strItems = "";
				  $("#sortable").children().each(function (q) {
						var divv = $(this);
						strItems += divv.attr("id") + ',';
				  });
				  localStorage.setItem("Array_2",strItems.substr(0,strItems.length-1));
				  //DB 저장순서.

				  var con_test = confirm("메뉴 순서 재정렬을 적용하시겠습니까?");
				  if(con_test == true){

					$.ajax({
						url:'/back/04_home/menuOrderUpdate.jsp?random=' + (Math.random()*99999), 
						data : {orderArray: localStorage.getItem("Array_2")},
						method : 'GET' 
					}).done(function(result){

						console.log("CompanyName=========================================");
						if(result == ('NoN') || result == 'list error' || result == 'empty'){
							console.log(result);
						}else{
							console.log("============= notice callback ========================");
							console.log(result);
							alert("메뉴 순서를 재정렬 하였습니다.");
							location.reload();
						}
					});

				  }
				  else if(con_test == false){
					
				  }


				}
	   });
}

/* 이벤트, 쿠폰, 장보기 숨기기여부를 바인딩한다. */
function getMenuListDefault(rcvCompanyNo) {

    $.ajax({
        url:'../back/04_home/menuCreateSelectDefault.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

		var text = "";
				   
        console.log("menuList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			if (rcvCompanyNo == 0)
			{
			}else{
//				text += '<li class="ui-state-default ui-state-disabled">';
				text += '<li class="ui-state-default">';
				text += '	<div class="menu_update_top">쿠폰</div>';
				text += '    <div class="menu_update_bot">';
				text +='		<input type="checkbox" name="coupon_fg" value="N">';
				text += '	 </div>';
				text += '</li>';

				text += '<li class="ui-state-default">';
				text += '	<div class="menu_update_top">이벤트</div>';
				text += '    <div class="menu_update_bot">';
				text +='		<input type="checkbox" name="event_fg" value="N">';
				text += '	 </div>';
				text += '</li>';

				// text += '<li class="ui-state-default">';
				// text += '	<div class="menu_update_top">장보기</div>';
				// text += '    <div class="menu_update_bot">';
				// text +='		<input type="checkbox" name="jang_fg" value="N">';
				// text += '	 </div>';
				// text += '</li>';



				$("#sortable").append(text);
			}
		
        }else{

            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
			var jsonResult_menu = data.CompanyList

			for(var i in jsonResult_menu){
					
					text += '<li class="ui-state-default">';
					text += '	<div class="menu_update_top">쿠폰</div>';
					text += '    <div class="menu_update_bot">';

					if ( jsonResult_menu[i].coupon_fg == "Y" )
				   {
						text +='     <input type="checkbox" name="coupon_fg" value="Y" checked>';
				   }else{
						text +='     <input type="checkbox" name="coupon_fg" value="N">';
				   }
					
					text += '    </div>';
					text += '</li>';

				   text += '<li class="ui-state-default">';
					text += '	<div class="menu_update_top">이벤트</div>';
					text += '    <div class="menu_update_bot">';

					if ( jsonResult_menu[i].event_fg == "Y" )
				   {
						text +='     <input type="checkbox" name="event_fg" value="Y" checked>';
				   }else{
						text +='     <input type="checkbox" name="event_fg" value="N">';
				   }
					
					text += '    </div>';
					text += '</li>';



				// 	text += '<li class="ui-state-default">';
				// 	text += '	<div class="menu_update_top">장보기</div>';
				// 	text += '    <div class="menu_update_bot">';

				// 	if ( jsonResult_menu[i].jang_fg == "Y" )
				//    {
				// 		text +='     <input type="checkbox" name="jang_fg" value="Y" checked>';
				//    }else{
				// 		text +='     <input type="checkbox" name="jang_fg" value="N">';
				//    }
					
				// 	text += '    </div>';
				// 	text += '</li>';
			}

			$("#sortable").append(text);
			
        }
		sortableMenu();
//		setTimeout(function(){ sortableMenu(); }, 2000);
    });
}