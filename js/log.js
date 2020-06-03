$(function () {

  var searchTextbox = getParameterByName('searchText');
	if (searchTextbox == "undefined")
	{
		searchTextbox = "";
	}

	if (searchTextbox == "" )
	{
	}else{
	   $("#searchTextbox").val(searchTextbox);
	}

	var pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
	    pageNo = 1;
	}

	getHeader();
		getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_log_list").addClass("active");

	logList(pageNo, '');
	logList_paging(pageNo, '');

});


// 로그를 리스팅한다.
function logList(rcvPageNo, rcvSearchText) {
    $.ajax({
        url:'/back/99_manage/logList.jsp?random=' + (Math.random()*99999),
		data : {pageNo: rcvPageNo ,searchText: rcvSearchText},
        method : 'GET' 
    }).done(function(result){
		var text = "";
        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			$("#suddenContent").empty();
            data['CompanyList'].forEach(function(item, index){                        
				text += '<tr>';
				text += '	<td>'+decodeURIComponent(item['LST_UPDATE_DATE'])+'</td>';
				text += '	<td>'+decodeURIComponent(item['session_id_name'])+'</td>';
				text += '	<td>'+decodeURIComponent(item['name'])+'</td>';				
				text += '	<td>'+decodeURIComponent(item['PAGE_NAME'])+'</td>';
				text += '</tr>';
            });
			$("#tab1_table").append(text);
        }
    });
}


// 로그 페이징를 가져온다
function logList_paging(rcvPageNo, rcvSearchText) {
	$.ajax({
        url:'/back/99_manage/log_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText},
        method : 'GET' 
    }).done(function(result){
        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 6;
			var next_no = parseInt(rcvPageNo) + 6;
			var text = "";

           if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -4)
			{
			}else if(total_paging_cnt < 5 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" href="log.html?pageNo=1&searchText=">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" href="log.html?pageNo='+pre_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					text += '<li class="page-item active"><a class="page-link" href="log.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" href="log.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				}
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				text += '<li class="page-item"><a class="page-link" href="log.html?pageNo='+next_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}
