$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111
	getHeader();
	$(".nav_product").addClass("active");
	
	getLeft();
	getLeftMenu('product');
	$("#nh_product_storeimgmaster").addClass("active");

	imgList();
});

//삭제 눌렀을 때 이유 입력창
function delReason(rcvImgNo) {
    var delDesc = prompt("삭제하시겠습니까", "사유 입력");
	if (delDesc == "사유 입력" || delDesc == "" || delDesc == null)
	{

	}else
	{
		imgSave(rcvImgNo, delDesc);
	}
}

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
                text +='    <td>'+item['pd_code']+'</td>';
                text +='    <td>'+item['pd_name']+'</td>';
                text +='    <td>'+item['group_tag']+'</td>';
                text +='    <td><img src="/upload/'+item['img_path']+'" alt="이미지"></td>';
                text +='    <td>'+item['img_path']+'</td>';
                text +='    <td>'+item['vm_cp_name']+'</td>';
                text +='    <td>'+item['vm_name']+'</td>';
                text +='    <td>'+item['reg_date']+'</td>';
                text +='    <td>'+item['img_status']+'</td>';
                text +='    <td>';
                // text +='      <button class="prod_img_del" onclick="delReason(\''+item['img_no']+'\');">삭제</button>';
				if (getCookie("userRoleCd") == "ROLE1")
				{
					text +='      <button class="prod_img_del" onclick="delReason(\''+item['img_no']+'\');">삭제</button>';
					text +='      <button class="prod_img_del" onclick="imgSave(\''+item['img_no']+'\');">저장</button>';					
					text +='      <button class="prod_img_appr" onclick="imgAppr(\''+item['img_no']+'\');">승인</button>';
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

function imgSave(rcvImgNo2, rcvDelDesc){
	$.ajax({
		url:'/back/08_product/storeImgSave.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo2, del_desc: rcvDelDesc },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("삭제 완료되었습니다.");
			location.href="/product/store_imgmaster.html";

		}
	});
}