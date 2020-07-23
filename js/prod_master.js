var order_arr = [];
var orderByText = "";
var pageNo = "";
var searchTextbox = "";
var orderByParam = "";

$(function () {

	pageNo = getParameterByName('pageNo');
	if (pageNo == ""){
	    pageNo = 1;
	}

	searchTextbox = getParameterByName('searchText');
	if (searchTextbox == ""){
		searchTextbox = "";
	}else{
	   $("#searchTextbox").val(searchTextbox);
	}

	orderByParam = getParameterByName('orderByParam');
	if (orderByParam == ""){ 
		order_arr = [
			["2","asc",1], //pd_code
			["3","asc",2], //pd_name
			["4","asc",3], //group_tag
			["5","asc",4], //img_cnt
			["6","asc",5]  //group_img_cnt
		];	
		orderByParam = JSON.stringify(order_arr);

		orderByText = "";
		for( var i = 0; i < order_arr.length; i++){
			orderByText = orderByText + order_arr[i][0] + " ";
			orderByText = orderByText + order_arr[i][1];
			if( i != (order_arr.length - 1) ) orderByText += ", ";
			//console.log(orderByText);
		}
	}else{ 
		order_arr = JSON.parse(orderByParam);
		//console.log(orderByParam);			
		//console.log(order_arr);					
		orderByText = "";
		for( var i = 0; i < order_arr.length; i++){
			orderByText = orderByText + order_arr[i][0] + " ";
			orderByText = orderByText + order_arr[i][1];
			if( i != (order_arr.length - 1) ) orderByText += ", ";			
		}
	}

	// var newarr = [];
	// int i = 0;
	// var newarr[i] = [];

	//console.log(orderByParam);	
	//console.log(order_arr);
	//console.log(orderByText);		

	getHeader();
	$(".nav_product").addClass("active");
	
	getLeft();
	getLeftMenu('product');
	$("#nh_product_prodmaster").addClass("active");

	prodList(pageNo, searchTextbox, orderByText);
	prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);

	var input = document.getElementById("searchTextbox");
	input.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			searchTextbox = $("#searchTextbox").val();
			prodList(pageNo, searchTextbox, orderByText);
			prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);			
			//location.href="prod_master.html?pageNo="+pageNo+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+orderByParam;
		}
	});

	/*검색필터*/
	$(".search_keyword_wrap").hide();

	$("#prodModalSave").click(function(){

		var prodModalCode = $("#prodModalCode").val();
		var prodModalName = $("#prodModalName").val();
		var prodModalKeyword = $("#prodModalKeyword").val();

		if ( prodModalCode == null || chrLen(prodModalCode) == 0)
		{
			alert("상품코드(SKU)를 입력하시기 바랍니다.");
			return false;
		}

		if ( prodModalName == null || chrLen(prodModalName) == 0)
		{
			alert("상품명을 입력하시기 바랍니다.");
			return false;
		}

//		if ( prodModalKeyword == null || chrLen(prodModalKeyword) == 0)
//		{
//			alert("키워드를 입력하시기 바랍니다.");
//			return false;
//		}
		
		if (localStorage.getItem("save_type") == "insert")
		{
			$.ajax({
				url:'/back/08_product/productInsert.jsp?random=' + (Math.random()*99999),
				data : { pd_name: prodModalName, pd_code: prodModalCode, group_tag: prodModalKeyword},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else if(result == 'exist'){
					console.log(result);
					alert("이미 동일한 코드로 등록된 상품이 있습니다. 추가가 취소됩니다.");
					$("#prodModalCode").val("");
					$("#prodModalName").val("");
					$("#prodModalKeyword").val("");
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					alert("등록이 완료되었습니다.");
					$("#prodModalCode").val("");
					$("#prodModalName").val("");
					$("#prodModalKeyword").val("");
					//location.href="prod_master.html?pageNo="+pageNo+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+orderByParam;
					prodList(pageNo, searchTextbox, orderByText);
					prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);			
				}
			});
		}else{
			$.ajax({
				url:'/back/08_product/productUpdate.jsp?random=' + (Math.random()*99999),
				data : { pd_name: prodModalName, pd_code: prodModalCode, group_tag: prodModalKeyword},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					alert("수정이 완료되었습니다.");
					$("#prodModalCode").val("");
					$("#prodModalName").val("");
					$("#prodModalKeyword").val("");
					//location.href="prod_master.html?pageNo="+pageNo+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+orderByParam;
					prodList(pageNo, searchTextbox, orderByText);
					prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);			
				}
			});
		}

	});

	$("#prodTableDel").click(function(){

		var chk_obj = document.getElementsByName("box_chk");
		var chk_leng = chk_obj.length;

		for(i=0;i<chk_leng;i++){
			if(chk_obj[i].checked==true){
				deleteProd(chk_obj[i].value);
			}
		}
	});

	// 우산단 이미지선택 삭제
	$("#prodSelectDel").click(function(){

		var chk_obj = document.getElementsByName("image_per_prod");
		var chk_leng = chk_obj.length;

		for(i=0;i<chk_leng;i++){
			if(chk_obj[i].checked==true){
				deleteImgPool(chk_obj[i].value);
			}
		}
	});

	// 우산단 이미지선택 다운로드
	$("#prodSelectDown").click(function(){

		var chk_obj = document.getElementsByName("image_per_prod");
		var chk_leng = chk_obj.length;

		for(i=0;i<chk_leng;i++){
			if(chk_obj[i].checked==true){
				downloadImgPool(chk_obj[i].value);
			}
		}
	});

	$("#checkboxAll").click(function(){
		var chk_obj = document.getElementsByName("box_chk");
		var chk_leng = chk_obj.length;
		var chkAgreeAll = $('input:checkbox[id="checkboxAll"]').is(":checked");

		if (chkAgreeAll == true){
			for(var j=0; j < chk_leng; j++) {
				chk_obj[j].checked=true;
			}
		}else{
			for(var j=0; j < chk_leng; j++) {
				chk_obj[j].checked=false;
			}
		}
	});

	$("#droped_zone").hide();
	localStorage.setItem("selectedPdCode","");

	if (getCookie("userRoleCd") == "ROLE2" ){
		$("#prodTableDel").hide();
		$("#prodTableAdd").hide();
		$("#prod_upload_wrap").hide();
		$("#prodSelectDel").hide();
	}

	$("#pd_code_asc").click(function(){
		arraySort( "2", "asc");
	});
	$("#pd_code_desc").click(function(){
		arraySort( "2", "desc");
	});	
	$("#pd_name_asc").click(function(){
		arraySort( "3", "asc");
	});
	$("#pd_name_desc").click(function(){
		arraySort( "3", "desc");
	});
	$("#group_tag_asc").click(function(){
		arraySort( "4", "asc");		
	});
	$("#group_tag_desc").click(function(){
		arraySort( "4", "desc");
	});
	$("#img_cnt_asc").click(function(){
		arraySort( "5", "asc");
	});
	$("#img_cnt_desc").click(function(){
		arraySort( "5", "desc");
	});
	$("#group_img_cnt_asc").click(function(){
		arraySort( "6", "asc");
	});
	$("#group_img_cnt_desc").click(function(){
		arraySort( "6", "desc");
	});	

	$('#excel_down_stat').on('click', function(){ 
		productListForExcel();
	});		

	
});

function arraySort(rcvName, rcvSortMathod){
	var newArray = [];
	var j = 0;
	var i = 0;
	//console.log(order_arr);
	//console.log(rcvName);
	//console.log(rcvSortMathod);
	for( i = 0; i < order_arr.length; i++){
		//console.log("i:"+i+",j:"+j);
		if( order_arr[i][0] == rcvName){			
			newArray[0] = [];			
			newArray[0][0] = order_arr[i][0];
			newArray[0][1] = rcvSortMathod;
			newArray[0][2] = 1;
			j--;			
			//console.log("0:"+newArray);
		}else{		
			newArray[j+1] = [];				
			newArray[j+1][0] = order_arr[i][0];
			newArray[j+1][1] = order_arr[i][1];
			newArray[j+1][2] = i + 1;
			//console.log(j+1+":"+newArray);
		}
		j++;
	}
	order_arr = newArray;
	orderByParam = JSON.stringify(newArray);

	orderByText = "";
	for( i = 0; i < newArray.length; i++){
		orderByText = orderByText + newArray[i][0] + " ";
		orderByText = orderByText + newArray[i][1];
		if( i != (newArray.length - 1) ) orderByText += ", ";
	}

	pageNo = 1;

	prodList(pageNo, searchTextbox, orderByText);
	prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);	
}

function productListForExcel(){
	// var keyword1 = onSelectCompanyNo;
	// var keyword2 = $('#excel_start_date').val();	
	// var keyword3 = $('#excel_end_date').val();

	//데이터 조회 후 엑셀 함수 호출
	$.get('/back/08_product/productListExcelExport.jsp?pageNumber=1&pageSize=99999999',
	function(result){
		console.log(result);
		if (result == "exception error"){
			alert("exception error"+result);
		}else if ( result.list.length > 0 ){
			var headList = ['상품번호', '상품명', '상품코드', '그룹코드',	'이미지수', '그룹이미지수'];
			ExcelExportStart("엑셀다운로드_상품마스터", headList, result.list);
		}else{
			alert("조회된 내역이 없어 엑셀Exoprt를 취소합니다.");
		}
	});
}

/*엑셀파일 업로더*/
var enterUpload = document.getElementById('jundan_excel_btn');
enterUpload.addEventListener('click', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
//		$("#airtel_thumnail_path_img").attr("src", "/upload/"+result);
		alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
	});
});

/*이미지그룹 업로더 드래그앤드랍*/
var enterUpload2 = document.getElementById('imgMulti_btn');
enterUpload2.addEventListener('click', function(evt){
	var selectedPdCode = localStorage.getItem("selectedPdCode");
	//console.log("selectedPdCode:"+selectedPdCode);
	uploadFile(selectedPdCode);
	location.reload();
	//editModal(selectedPdCode, '백설찰밀가루', '');
});


function deleteProd(rcvPdCode){
	$.ajax({
		url:'/back/08_product/productDelete.jsp?random=' + (Math.random()*99999),
		data : { pd_code: rcvPdCode },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("삭제 완료되었습니다.");
			$("#prodModalCode").val("");
			$("#prodModalName").val("");
			$("#prodModalKeyword").val("");
			//location.href="prod_master.html?pageNo="+pageNo+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+orderByParam;
			prodList(pageNo, searchTextbox, orderByText);
			prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);			
		}
	});
}

// 우상단 선택삭제 버튼으로 선택된 이미지를 삭제한다.
function deleteImgPool(rcvImgNo){
	$.ajax({
		url:'/back/08_product/imgPoolDelete.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
//			alert("삭제 완료되었습니다.");
			location.reload();
		}
	});
}

// 우상단 선택다운로드 버튼으로 선택된 이미지를 다운로드한다.
function downloadImgPool(rcvImgNo){
	//$.ajax({
		//url:'/back/08_product/imgDownload.jsp?random=' + (Math.random()*99999),
		//data : { img_no: rcvImgNo },
		//method : 'GET' 
	//}).done(function(result){
		//console.log("noticeList=========================================");
		//if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			//console.log(result);
		//}else{
			//console.log("============= notice callback ========================");
			//console.log(result);
		//}
	//});
	//document.getElementById("main_frame").src = '/back/08_product/imgDownload.jsp?random=' + (Math.random()*99999) + '&img_no=' + rcvImgNo;

	var aIframe = document.createElement("iframe");
	aIframe.src = '/back/08_product/imgDownload.jsp?random=' + (Math.random()*99999) + '&img_no=' + rcvImgNo;
	document.getElementsByTagName("body")[0].appendChild(aIframe);
}

function addModal(){
	$("#prodModalCode").val("");
	$("#prodModalName").val("");
	$("#prodModalKeyword").val("");
    $(".prod_modal_edit_wrap").toggleClass("active");
	localStorage.setItem("save_type","insert");

	document.getElementById('prodModalCode').readOnly = false;
}

function viewBigImage(path) {
	const imgPath = '/upload/' + path;
	document.getElementById("input_img_Data").innerHTML = '<img src="' + imgPath + '" />';
}

function editModal(rcvPdCode, rcvPdName, rcvGroupTag){

	if (localStorage.getItem("selectedPdCode") == rcvPdCode)
	{
		$("#droped_zone").toggle();
	}else{
		$("#droped_zone").hide();
		$("#droped_zone").toggle();
	}
	localStorage.setItem("selectedPdCode",rcvPdCode);

	if (getCookie("userRoleCd") == "ROLE1" )
	{
		$(".prod_modal_edit_wrap").addClass("active");
		localStorage.setItem("save_type","update");

		$("#prodModalCode").val(rcvPdCode);
		$("#prodModalName").val(rcvPdName);
		$("#prodModalKeyword").val(rcvGroupTag);

		document.getElementById('prodModalCode').readOnly = true;

	}else{
		$("#droped_zone").hide();
	}

//    $(".prod_modal_edit_wrap").addClass("active");
//	localStorage.setItem("save_type","update");
//
//	$("#prodModalCode").val(rcvPdCode);
//	$("#prodModalName").val(rcvPdName);
//	$("#prodModalKeyword").val(rcvGroupTag);
//
//	document.getElementById('prodModalCode').readOnly = true;

	//우측 div 에 이미지 썸네일을 바인딩한다. 이중호 20191128
	$.ajax({
        url:'/back/08_product/productImage.jsp?random=' + (Math.random()*99999), 
        data : {
			groupTag: rcvGroupTag,
			pdCode: rcvPdCode
			},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#prod_img_wrap").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        
				
				text += ' <div data-toggle="modal" data-target="#prodMaster" class="prod_img" onclick="javascript:viewBigImage(\''+item['img_path']+'\')">';
				text += '   <img src="/upload/'+decodeURIComponent(item['img_path'])+'" alt="이미지">';
				text += '   <input type="checkbox" name="image_per_prod" value="'+decodeURIComponent(item['img_no'])+'">';
				text += ' </div>';

			});
			$("#prod_img_wrap").empty();
			$("#prod_img_wrap").append(text);
        }
    });

}

// 상품리스트를 가져온다
function prodList(rcvPageNo, rcvSearchText, rcvOrderByText) {
	$.ajax({
        url:'/back/08_product/productList.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText, orderByText: rcvOrderByText},
        method : 'GET' 
    }).done(function(result){
        //console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pdList").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			var text = "";
            data['CompanyList'].forEach(function(item, index){                        				
				text +='<tr>';
				text +='	<td><input type="checkbox" name="box_chk" value="'+decodeURIComponent(item['pd_code'])+'"></td>';
				text +='    <td><span class="prod_code" onclick="editModal(\''+decodeURIComponent(item['pd_code'])+'\', \''+item['pd_name']+'\', \''+decodeURIComponent(item['group_tag'])+'\');">'+decodeURIComponent(item['pd_code'])+'</span></td>';
				text +='    <td>'+item['pd_name']+'</td>';
                text +='    <td>'+decodeURIComponent(item['group_tag'])+'</td>';
				text +='    <td>'+decodeURIComponent(item['pd_code_cnt'])+'</td>';
                text +='    <td>'+decodeURIComponent(item['group_tag_cnt'])+'</td>';				
				text +='</tr>';
				//if(index == 1) console.log(item['sql']);
			});
			$("#pdList").append(text);
        }
    });

}


// 상품리스트 페이징를 가져온다
function prodList_paging(rcvPageNo, rcvSearchText, rcvOrderByText, rcvOrderByParam) {

	$.ajax({
        url:'/back/08_product/productList_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText, orderByText: rcvOrderByText},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 6;
			var next_no = parseInt(rcvPageNo) + 6;

			var text = "";

            if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -4){
			}else if(total_paging_cnt < 5 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo=1&searchText=">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo='+pre_no+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+encodeURIComponent(rcvOrderByParam)+'">«</a></li>';
				
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					text += '<li class="page-item active"><a class="page-link" href="prod_master.html?pageNo='+k+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+encodeURIComponent(rcvOrderByParam)+'">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo='+k+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+encodeURIComponent(rcvOrderByParam)+'">'+k+'</a></li>';
				}
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt){
			}else{
				text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo='+next_no+"&searchText="+encodeURIComponent($("#searchTextbox").val())+"&orderByParam="+encodeURIComponent(rcvOrderByParam)+'">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
$("#jundan_excel_new").on("click",function(){

	if (getCookie("userRoleCd") == "ROLE2")	{
		var userCompanyNo = getCookie("userCompanyNo");
	}else{
		var userCompanyNo = getCookie("onSelectCompanyNo");
	}
	
	var excel_path = $("#excel_path").val();

	var d = new Date();
	var nowDate = d.getFullYear()+leadingZeros((Number(d.getMonth())+1),2)+d.getDate();

	if ( excel_path == null || chrLen(excel_path) == 0)	{
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}
	const extension = excel_path.split(".")[1];
	const baseUrl = (extension == "xls") ? "prodInsertCheckXls.jsp" : (extension == "xlsx") ? "prodInsertCheckXlsx.jsp" : "null";
	$.ajax({
        url:'/back/08_product/'+baseUrl+'?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path, reg_no: getCookie("userNo"), update_fg: "N"},
        method : 'GET' 
    }).done(function(result){
		var resultSplit = result.trim().split(',');
		//console.log(resultSplit);		
        if(resultSplit[0] == ('NoN') || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
			alert("파일 업로드 오류!(중복체크)"+resultSplit);
        }else if( resultSplit[0] == 'pd_code_no_exist' ){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행" + resultSplit[1] + "이 존재합니다.");
		}else if(resultSplit[0] == ('success')){			
			var con_test = confirm(resultSplit[1] + "건의 상품코드를 입력 하시겠습니까?(신규 "+resultSplit[2]+"건,중복 "+resultSplit[3]+"건)");
			if(con_test == true){
				excelInsertAndUpdate();
			}
		}else{
            alert("등록오류");
			//location.href="/product/prod_master.html";
			prodList(pageNo, searchTextbox, orderByText);
			prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);			
        }
    });
});

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
function excelInsertAndUpdate(){  

	if (getCookie("userRoleCd") == "ROLE2")
	{
		var userCompanyNo = getCookie("userCompanyNo");
	}else{
		var userCompanyNo = getCookie("onSelectCompanyNo");
	}
	
	var excel_path = $("#excel_path").val();

	var d = new Date();
	var nowDate = d.getFullYear()+leadingZeros((Number(d.getMonth())+1),2)+d.getDate();

	if ( excel_path == null || chrLen(excel_path) == 0){
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}
	const extension = excel_path.split(".")[1];
	const baseUrl = (extension == "xls") ? "prodInsertXls.jsp" : (extension == "xlsx") ? "prodInsertXlsx.jsp" : "null";
	$.ajax({
        url:'/back/08_product/'+baseUrl+'?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path, reg_no: getCookie("userNo") },
        method : 'GET' 
    }).done(function(result){
		//console.log("bb");
		var resultSplit = result.trim().split(',');
		//console.log(resultSplit);
        if( resultSplit[0] == ('NoN') || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
            //console.log(result);
			alert("파일 업로드 오류!"+resultSplit);
        }else if( resultSplit[0] == 'pd_code_no_exist' ){
			alert("상품코드가 입력되지 않은 행" + resultSplit[1] + "이 존재합니다.");
        }else if( resultSplit[0] == 'pd_name_no_exist' ){
			alert("상품명이 입력되지 않은 행" + resultSplit[1] + "이 존재합니다.");
		}else{
            //console.log("============= notice callback ========================");
            //console.log(resultSplit);
            alert("등록이 완료되었습니다(총 "+resultSplit[1]+"건, 성공 "+resultSplit[2]+"건, 실패 "+resultSplit[3]+"건)");
			//location.href="/product/prod_master.html";
			prodList(pageNo, searchTextbox, orderByText);
			prodList_paging(pageNo, searchTextbox, orderByText, orderByParam);			
        }
    });
}

/*검색 필터 2020-02-02 김나영*/
function searchFunc() {
     $(".search_keyword_wrap").show();
	 var blankSearch = $("#prodModalKeyword").val();

	 if(blankSearch == ""){
		$(".search_keyword_wrap").hide();
	 }else{
		$(".search_keyword_wrap").show();
		keywordList(blankSearch);
	 }
}

// 키워드 리스트를 가져온다
function keywordList(rcvKeyword) {

	$.ajax({
        url:'/back/08_product/keywordList.jsp?random=' + (Math.random()*99999), 
        data : {keyword: rcvKeyword},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#keywordList").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        
				
				text +='    <li style="cursor: pointer" onclick="$(\'#prodModalKeyword\').val(\''+decodeURIComponent(item['group_tag'])+'\');$(\'.search_keyword_wrap\').hide();">'+decodeURIComponent(item['group_tag'])+'</li>'; 


			});
			$("#keywordList").empty();
			$("#keywordList").append(text);

        }
    });

}