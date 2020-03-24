$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	getHeader();
		getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_statistics_pe").addClass("active");

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

	setTimeout(function(){
		$("select[name='statStore'] option[value='0']").remove();
	}, 1000);

	/*판매장 변경시, 
	1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
	2. 저장된 쿠키정보를 이용하여 긴급공지내용을 바인딩한다. 
	3. iframe 내부 모바일웹의 판매장셋팅을 위해, 로컬스토리지에 판매장번호를 셋팅한다.
	4. 선택한 판매장번로를 이용하여 iframe reload 한다.*/
	$("#sort_select, #statYear, #statMonth").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			logList($("#sort_select").val(), $("#statYear").val(), $("#statMonth").val());
		}
	});

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

    $("#statYear").val(yyyy);
	$("#statMonth").val(mm);

	// logList(targetCompanyNo, $("#statYear").val(), $("#statMonth").val());
	logList(targetCompanyNo, yyyy, mm);

});

function history_back(){
	window.history.back();
}

// 로그를 리스팅한다.
function logList(rcvVmCpNo, rcvStdYear, rcvMonth) {

    $.ajax({
        url:'/back/99_manage/statistics_pe.jsp?random=' + (Math.random()*99999),
		data : {vm_cp_no: rcvVmCpNo, stdYear: rcvStdYear, stdMonth: rcvMonth},
        method : 'GET' 
    }).done(function(result){

		var text = "";

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			$("#tab1_table").empty();

			var curDbDate = "";
			var tdCnt = 0;

            data['CompanyList'].forEach(function(item, index){                        

				// 같은 날짜일때,
				if ( curDbDate != "" && curDbDate == item['db_date'])
				{
					if (item['stdDay'] != null)
					{
						if (item['stdDay'] == item['db_date'])
						{
							text +=' <td>'+item['menu_name']+':<br> '+item['tot_cont_cnt']+'</td>';
							tdCnt = tdCnt + 1;
						}else{
//							text += '</tr>';
//							text +=' <td>'+item['menu_name']+': '+item['tot_cont_cnt']+'</td>';
						}
					}else{
						text +='<td>-</td>';
					}

				// 최초시작이거나, 다른 날짜로 넘어갈때
				}else{ 
					
					if (tdCnt == 0)
					{
					}else{
						tdCnt = 7 - tdCnt;
						for (var n=0; n < tdCnt; n++)
						{
							text +='<td>-</td>';
						}
						tdCnt = 0;
					}
					text += '</tr>';
					
					text += '<tr>';
					text += '	<td>'+item['db_date']+'</td>';
					text += '	<td>'+item['tot_cnt']+'</td>';
					text += '	<td>'+item['tot_cont_cnt']+'</td>';

					//해당 메뉴에 접속데이터가 있을때
					if (item['stdDay'] != null)
					{
						// 해당 날짜에 접속데이터가 있을때
						if (item['stdDay'] == item['db_date'])
						{
							text +=' <td>'+item['menu_name']+':<br> '+item['tot_cont_cnt']+'</td>';
						}else{
							text +=' <td>'+item['menu_name']+':<br> 0 </td>';
						}
					}else{
						text +='<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>';
					}
				}
				curDbDate = item['db_date'];

            });

			if (tdCnt == 0)
			{
			}else{
				tdCnt = 7 - tdCnt;
				for (var n=0; n < tdCnt; n++)
				{
					text +='<td>-</td>';
				}
				tdCnt = 0;
			}
			text += '</tr>';

			$("#tab1_table").empty();
			$("#tab1_table").append(text);

        }
    });
}