 $(function(){
	
   myDelList();

})


//내 주문내역 확인
function myDelList(){

		var text = '';

		$.ajax({
			url:'https://www.nhhanaromart.com/back/04_home/my_del.jsp?random=' + (Math.random()*99999), 
			data : {memberNo: localStorage.getItem("memberNo") , vm_cp_no: localStorage.getItem("vm_cp_no") },
			method : 'GET' 
		}).done(function(result){
			
			console.log("noticeList=========================================");
			if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
				console.log(result);

				text +='<div class="list_no_item">배송중이 상품이 없습니다.</div>'

				$("#myDelList").empty();
				$("#myDelList").append(text);

			}else{

            console.log("============= notice callback ========================");

			var jsonResult = JSON.parse(result);
     		console.log(jsonResult);

			var jsonResult_notice = jsonResult.CompanyList
			var init_cnt = 0;

			for(var i in jsonResult_notice){

				if (Number(init_cnt+1) == 1)
				{

					text +='<li class="del_cont inner_del_btn_wrap">';
					text +='   <div class="del_title">['+jsonResult_notice[i].CODE_NAME+']';
					text +='	'+jsonResult_notice[i].rs_std_date+'</div>';
					text +='   <div class="del_item_price">';
					text +='    <div class="del_item">'+jsonResult_notice[i].item_pd_name+'외  '+(Number(jsonResult_notice[i].rs_item_cnt)-1)+'개</div>';
					text +='   <div class="del_price">'+comma(jsonResult_notice[i].order_price)+'원</div>';
					text +='   </div>';
					text +='   <div class="del_address">'+jsonResult_notice[i].order_name+''; 
					text +=' | '+jsonResult_notice[i].rs_address1+' '+jsonResult_notice[i].rs_address2+'</div>';
					text +='   <div class="inner_del_btn">';
					text +='	<img src="../images/down.png" alt=""></div>';
					text +='        <div class="inner_del_cont">';
					text +='            <table>';
					text +='                <tbody>';
				}

					//li 내부 아이템                    
					text +=' <tr>';
                    text +='     <th rowspan="2" class="del_item_img">';
					if(jsonResult_notice[i].img_path == null){
						text +='	 <img src="https://www.nhhanaromart.com/images/no_thumb.png" alt="'+jsonResult_notice[i].item_pd_name+'"></th>';
					}else{
						text +='	 <img src="https://www.nhhanaromart.com/upload/'+jsonResult_notice[i].img_path+'" alt="'+jsonResult_notice[i].item_pd_name+'"></th>';
					}

					text +='     <th colspan="2">'+jsonResult_notice[i].item_pd_name+'</th>';
                    text +='</tr>';
                    text +='<tr>';
                    text +='     <td>'+jsonResult_notice[i].item_qty+'개</td>';
                    text +='     <td>'+comma(jsonResult_notice[i].item_amount)+'원</td>';
                    text +='</tr>';					

				if (Number(init_cnt+1) == Number(jsonResult_notice[i].rs_item_cnt))
				{
					text +='           </tbody>';
					text +='     </table>';
					text +='    </div>';
					text +=' </li>';

					init_cnt = 0;
				}else{
					init_cnt = Number(init_cnt) + 1;
				}
			}
			
			$("#myDelList").empty();
			$("#myDelList").append(text);

		}
			
		$(".inner_del_btn_wrap").click(function(){
                  $(this).children(".inner_del_cont").toggleClass("active");
                  $(this).children(".inner_del_btn").children("img").toggleClass("rotate")
			});
	})


}
