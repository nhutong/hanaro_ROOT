$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111
	getHeader();
	$(".nav_product").addClass("active");
	
	getLeft();
	getLeftMenu('product');
	$("#nh_product_storeimgmaster").addClass("active");

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
	
	/*input box 일자 기본값 셋팅  2020.09.03 심규문 fromdate 14일 default 셋팅*/	
	var todate = new Date();
	var fromdate = new Date();	
	//input todate 설정
	var toYear = todate.getFullYear();
	var toMonth = leadingZeros(todate.getMonth() + 1 , 2);
	var toDate = leadingZeros(todate.getDate(), 2);
	//input fromdate 설정
	fromdate.setDate(fromdate.getDate() - 14);
	var fromYear = fromdate.getFullYear();
	var fromMonth = leadingZeros(fromdate.getMonth() + 1 , 2);
	var fromDate = leadingZeros(fromdate.getDate());

	$("#imgmaster_start_date").val(fromYear+'-'+fromMonth+'-'+fromDate);
	$("#imgmaster_end_date").val(toYear+'-'+toMonth+'-'+toDate);	

	$("#sort_select").on("change",function(){
		if ($("#sort_select").val())
		{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});

	$("#btnSearch").on("click",function(){
		settingInfo();
	});
	storeMenuPageNavi(1, targetCompanyNo);
});

function searchEnter(e) {
	if (e.keyCode == 13) {
		settingInfo();
	}
}
function settingInfo() {
	const s_date = $("#imgmaster_start_date").val();
	const e_date = $("#imgmaster_end_date").val();
	const category = $("#searchCategory").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	const params = {
		s_date: s_date,
		e_date: e_date,
		category: category,
		keyword: keyword,
		flag: flag
	}
	localStorage.setItem("imgMasterList", JSON.stringify(params));
	storeMenuPageNavi(1, getCookie("onSelectCompanyNo"));
}
// 상품리스트를 가져온다

function imgList(nowPage) {
	if (!nowPage) nowPage = 1;
	const s_date = $("#imgmaster_start_date").val();
	const e_date = $("#imgmaster_end_date").val();
	const category = $("#searchCategory").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	$.ajax({
        url:'/back/08_product/storeImgList.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: getCookie("onSelectCompanyNo"), n_page: nowPage, s_date: s_date, e_date: e_date, category: category, keyword: keyword, status: flag },
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			text +='<tr>';
            text +='    <td colspan=10>승인대기 건이 없습니다.</td>';
			text +='</tr>';
        }else{
            $("#storeImgCon").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        

				text +='<tr>';
				//text +='    <td>'+item['pd_code']+'</td>';
				text +='	<td><input type="text" style="max-width:150px; text-align:center" value="'+item['pd_code']+'" id="pdCode_'+item['img_no']+'"></td>';
                text +='    <td class="might-overflow">'+item['pd_name']+'</td>';
				//text +='    <td>'+item['group_tag']+'</td>';
				text +='	<td><input type="text" style="max-width:100px; text-align:center" value="'+item['group_tag']+'" id="groupTag_'+item['img_no']+'" class="groupTagClass" onkeyup="searchFunc(this);" onblur="focusOut();">';							
                text +='    <td data-toggle="modal" data-target="#imgmasterModal" onclick="javascript:viewBigImage(\''+item['img_path']+'\')"><img src="/upload/'+item['img_path']+'" alt="이미지"></td>';
                text +='    <td class="might-overflow">'+item['img_path']+'</td>';
                text +='    <td>'+item['vm_cp_name']+'</td>';
                text +='    <td>'+item['vm_name']+'</td>';
                text +='    <td>'+item['reg_date']+'</td>';
                text +='    <td class="might-overflow">'+item['img_status']+'</td>';
                text +='    <td>';
                // text +='      <button class="prod_img_del" onclick="delReason(\''+item['img_no']+'\');">삭제</button>';
				if (getCookie("userRoleCd") == "ROLE1"){
					//console.log("aaaa"+item['std_fg']);
					if ( item['std_fg'] == null ){
						// 200709 김수경 status 조작버튼을 아이콘으로 간소화
						// text +='      <button class="prod_img_del" onclick="delReason(\''+item['img_no']+'\');">삭제</button>';
						// text +='      <button class="prod_img_save" onclick="imgSave(\''+item['img_no']+'\');">저장</button>';					
						// text +='      <button class="prod_img_appr" onclick="imgAppr(\''+item['img_no']+'\');">승인</button>';	
						text +='      <i class="fa fa-trash" style="padding:0px 5px 0px 5px; font-size:20px; color:red; cursor:pointer;" onclick="delReason(\''+item['img_no']+'\');"></i>';
						text +='      <i class="fa fa-save" style="padding:0px 5px 0px 5px; font-size:20px; color:#555; cursor:pointer;" onclick="imgSave(\''+item['img_no']+'\');"></i>';					
						text +='      <i class="fa fa-check-circle" style="padding:0px 5px 0px 5px; font-size:20px; color:#55b190; cursor:pointer;" onclick="imgAppr(\''+item['img_no']+'\');"></i>';	
					}
				}else{

				}

                text +='    </td>';
                text +='</tr>';
			});
        }
		$("#storeImgCon").empty();
		$("#storeImgCon").append(text);
    });

}

// 이미지 크게보기
function viewBigImage(path) {
	const imgPath = '/upload/' + path;
	document.getElementById("input_img_Data").innerHTML = '<img src="' + imgPath + '" />';
}

function imgAppr(rcvImgNo){
	$.ajax({
		url:'/back/08_product/storeImgAppr.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("승인 완료되었습니다.");
			location.href="/product/store_imgmaster.html";
		}
	});
}

function imgSave(rcvImgNo){

	var rcvPdCode = $("#pdCode_"+rcvImgNo).val();
	var rcvGroupTag = $("#groupTag_"+rcvImgNo).val();	
	$.ajax({
		url:'/back/08_product/storeImgSave.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo, pd_code: rcvPdCode, group_tag: rcvGroupTag },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("저장 완료되었습니다.");
			location.href="/product/store_imgmaster.html";

		}
	});
}

//삭제 눌렀을 때 이유 입력창
function delReason(rcvImgNo) {
    var delDesc = prompt("삭제하시겠습니까", "사유 입력");
	if (delDesc == "사유 입력" || delDesc == "" || delDesc == null){
	}else{
		$.ajax({
			url:'/back/08_product/storeImgDelete.jsp?random=' + (Math.random()*99999),
			data : { img_no: rcvImgNo, del_desc: delDesc },
			method : 'GET' 
		}).done(function(result){
			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("삭제되었습니다.");
				location.href="/product/store_imgmaster.html";
			}
		});
	}
}


function focusOut(){
	$("div.search_keyword_wrap").remove();
}


/*검색 필터 2020-02-02 김나영*/
function searchFunc(obj) {
	$("div.search_keyword_wrap").remove();
	$(obj).parents("td").append('<div class="search_keyword_wrap"><ul id="keywordList"></ul></div>')
	
     $(".search_keyword_wrap").show();
//	 var blankSearch = $("#prodModalKeyword").val();
	 var blankSearch = $(obj).val();

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

function storeMenuPageNavi(rcvPageNo, targetCompanyNo) {
	const s_date = $("#imgmaster_start_date").val();
	const e_date = $("#imgmaster_end_date").val();
	const category = $(".search_select").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	$.ajax({
        url:'/back/08_product/storePageNavi.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,vm_cp_no: targetCompanyNo, s_date: s_date, e_date: e_date, category: category, keyword: keyword, status: flag},
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
				text += '<li class="page-item"><a class="page-link" onclick="storeMenuPageNavi(1, '+targetCompanyNo+')" href="javascript:void(0);">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" onclick="storeMenuPageNavi('+pre_no+', '+targetCompanyNo+')" href="javascript:void(0);">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				const className = (parseInt(rcvPageNo) == k) ? "page-item active" : "page-item";
				const binstr = "";
				text += '<li class="'+className+'"><a class="page-link" onclick="storeMenuPageNavi('+k+', '+targetCompanyNo+')" href="javascript:void(0);">'+k+'</a></li>';
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
				text += '<li class="page-item"><a class="page-link" onclick="storeMenuPageNavi('+next_no+', '+targetCompanyNo+')" href="javascript:void(0);">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
		}
    });
	imgList(rcvPageNo);
}