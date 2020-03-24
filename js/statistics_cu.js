$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	getHeader();
	getLeft();
	$(".nav_manage").addClass("active");

	getLeftMenu('manage');
	$("#myplanb_menu_statistics_cu").addClass("active");

	$("#statYear").on("change",function(){
		if ($("#statYear").val() == "" )
		{
		}else{
			logList($("#statYear").val());
		}
	});

	logList(2020);

});

function history_back(){
	window.history.back();
}

// 로그를 리스팅한다.
function logList(rcvStdYear) {

    $.ajax({
        url:'/back/99_manage/statistics_cu.jsp?random=' + (Math.random()*99999),
		data : {stdYear: rcvStdYear},
        method : 'GET' 
    }).done(function(result){

		var text = "";

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
			$("#tab1_table").empty();
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			$("#suddenContent").empty();

            data['CompanyList'].forEach(function(item, index){                        
                
				text += '<tr>';
				text += '	<td>'+Number(index+1)+'</td>';
				text += '	<td>'+decodeURIComponent(item['VM_CP_NAME'])+'</td>';
				text += '	<td>'+decodeURIComponent(item['tot_cnt'])+'</td>';
				text += '	<td>'+decodeURIComponent(item['tot_cont_cnt'])+'</td>';
				text += '	<td>'+decodeURIComponent(item['tot_web_cnt'])+'</td>';
				text += '	<td>'+decodeURIComponent(item['tot_app_cnt'])+'</td>';
				text += '</tr>';

            });
			$("#tab1_table").empty();
			$("#tab1_table").append(text);

        }
    });
}