$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111
	getHeader();
	$(".nav_product").addClass("active");
	
	getLeft();
	getLeftMenu('product');
	$("#nh_product_storeimgmaster").addClass("active");

	imgList();
});


// 상품리스트를 가져온다
function imgList() {

	$.ajax({
        url:'/back/08_product/storeImgList.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: getCookie("userCompanyNo")},
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
				text +='	<td><input type="text" value="'+item['pd_code']+'" id="pdCode_'+item['img_no']+'"></td>';
                text +='    <td>'+item['pd_name']+'</td>';
				//text +='    <td>'+item['group_tag']+'</td>';
				text +='	<td><input type="text" value="'+item['group_tag']+'" id="groupTag_'+item['img_no']+'" class="groupTagClass" onkeyup="searchFunc(this);" onblur="focusOut();">';							
                text +='    <td><img src="/upload/'+item['img_path']+'" alt="이미지"></td>';
                text +='    <td>'+item['img_path']+'</td>';
                text +='    <td>'+item['vm_cp_name']+'</td>';
                text +='    <td>'+item['vm_name']+'</td>';
                text +='    <td>'+item['reg_date']+'</td>';
                text +='    <td>'+item['img_status']+'</td>';
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
		$("#storeImgCon").append(text);
    });

}

function imgAppr(rcvImgNo){
	$.ajax({
		url:'/back/08_product/imgAppr.jsp?random=' + (Math.random()*99999),
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