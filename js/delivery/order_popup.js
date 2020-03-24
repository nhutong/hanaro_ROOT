$(function () {

    //  var Result = getParameterByName('Test'); // 결과 : 111

    // 주문 정보 가져오기
    getOrderInfo();

    // 주문 정보 업데이트
    $('#manageOrderSave').on('click', function(){
        updateOrderInfo();        
    });

    // 출력
    $('#manageOrderPrint').on('click', function(){
        print();
    });
    
       
});
    
function order_popup(rs_no){
    window.open('order_popup.html?rs_no='+rs_no + '&company_no='+$('#company').val(),
                '주문관리','width=640,height=640,location=no,status=no,scrollbars=yes,left=300,top=300')  
}


function getOrderInfo(){
    $.get("/back/07_delivery/orderInfo.jsp"+location.search,		
          function(resultJSON){						
            console.log(resultJSON);

            setOrderInfo(resultJSON['list'][0]);
            setOrderItemList(resultJSON['item_list']);
            setDeliveryManagerOptions(resultJSON['delivery_manager_list'], resultJSON['list'][0].delivery_manager );
			setRsInfo(resultJSON['rs_no_list'][0]);
            
          }
    );
}

function setOrderInfo(orderInfo){
    if(!orderInfo) { 
        alert('주문 정보가 없습니다.');
    }
    var cash_check = false;
    if(orderInfo['cash_receipt_flag'] && orderInfo['cash_receipt_flag'] == 'Y' ) cash_check = true;
    $('#cash_receipt_flag').prop('checked',  cash_check);
    $('#cash_receipt_no').text(orderInfo.cash_receipt_no);
    $('#comment').val(orderInfo.comment);
    $('#orderManager').val(orderInfo.customer_request);
    $('#name').text(orderInfo.name);
    $('#rs_std_date').text(orderInfo.rs_std_date);
    $('#order_price').text(orderInfo.order_price);
    $('#rs_address').text(orderInfo.rs_address1 + ' ' +orderInfo.rs_address2);    
    $('#orderDelStatus').val(orderInfo.rs_status_cd);
    $('#tel').text(orderInfo.tel);
    $('#rs_no').text(orderInfo.rs_no);
    $('#ref_member_no').text(orderInfo.ref_member_no);
    $('#payment_type').text(orderInfo.payment_type);
    $('#customer_request').val(orderInfo.customer_request);
}

function setRsInfo(roundInfo){
    if(!roundInfo) { 
        alert('주문 정보가 없습니다.');
    }
    $('#delivery_round').text(roundInfo.rownum);
}


function updateOrderInfo(){

    var formData = {				
        rs_status_cd : $('#orderDelStatus').val(),
        delivery_manager : $('#delivery_manager').val().trim(),     
        customer_request : $('#customer_request').val().trim(),
        comment : $('#comment').val().trim(),
        cash_receipt_flag : ($('#cash_receipt_flag').prop('checked') ? 'Y' : 'N'),
        rs_no : $('#rs_no').text().trim()
	};

	if(!confirm('주문 정보를 수정하시겠습니까?')) return;
	
	$.post(
		"/back/07_delivery/orderInfoUpdate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert(resultJSON.error[0]);
			}
			
			if(resultJSON['update'] > 0){
				alert('저장되었습니다.');
				getOrderInfo();
			}
		}
	)

}

function setOrderItemList(itemList){

// item_amount: 1000
// item_no: 1
// item_pd_code: "1111"
// item_pd_name: "11111"
// item_price: 1000
// item_qty: 1
// lst_date: "Nov 21, 2019 2:14:48 AM"
// lst_no: 6
// reg_date: "Nov 21, 2019 2:14:48 AM"
// reg_no: 6
// rs_no: 10
    console.log(itemList);
    
    var orderItemTemplateFn = _.template(
        '<tr id="item<%- item_no %>"><td> <%- idx %> </td>' +
        '<td><%- item_pd_code %></td>' +
        '<td><%- item_pd_name %></td>'+ 
        '<td><input class="item_qty" data-item-no="<%- item_no %>" id="item_qty<%- item_no %>" type="number" value="<%- item_qty %>"/></td>' +        
        '<td><input type="number" id="item_price<%- item_no %>" value="<%- item_price %>" readonly >원</td>'+ //가격
        '<td><input type="number" id="item_amount<%- item_no %>" value="<%- item_amount %>" readonly >원</td>'+ //금액
        '<td> <button class="itemUpdateBtn" onclick="updateOrderItem(<%- item_no %>)"> 수정</button>' + 
        '      <button class="itemDelBtn" data-item-no="<%- item_no %>" onclick="deleteOrderItem(<%- item_no %>)">삭제</button> </td></tr>'
        );

    var $tbody = $('#orderItemList').empty();
    $(itemList).each( function(idx, item) {        
        item['idx'] = (idx+1);                
        $tbody.append(orderItemTemplateFn(item));
    });

    $('.item_qty').on('change', function(){
        var item_no = $(this).data('itemNo');
        var price = Number($('#item_price'+item_no).val().trim());
        $('#item_amount'+item_no).val((this.value * price));
    })


    var addItemTr = 
    '<tr id="newItem"><td></td><td><input type="text" id="item_pd_code_new"></td>' + //상품코드
    '<td><input type="text" id="item_pd_name_new"></td>'+  //품목
    '<td><input type="number" id="item_qty_new" value="0"></td>'+ //개수
    '<td><input type="number" id="item_price_new" value="0">원</td>'+ //금액
    '<td><input type="number" id="item_amount_new" value="0">원</td>'+ //금액
    '<td> <button id="orderItemAddBtn" onclick="addOrderItem()">상품추가</button> </td></tr>';

    $tbody.append(addItemTr);

    $('#item_pd_name_new').on('change', function (){
        setNewProductCode(this.value);
    })

    $('#item_qty_new').on('change', function (){
        setNewItemAmount();
    })

    $('#item_price_new').on('change', function (){
        setNewItemAmount();
    })

}

function setNewItemAmount(){
    var item_amount = parseInt($('#item_qty_new').val()) *  parseInt($('#item_price_new').val());
    $('#item_amount_new').val(item_amount);
}

function setNewProductCode(productName){

}


function addOrderItem(){

    var formData = {				
        item_pd_code : $('#item_pd_code_new').val().trim(),
        item_pd_name : $('#item_pd_name_new').val().trim(),     
        item_qty : $('#item_qty_new').val().trim(),
        item_price : $('#item_price_new').val().trim(),
        item_amount : $('#item_amount_new').val().trim(),        
        rs_no : $('#rs_no').text().trim(),
		
	};

	if(!confirm('주문 상품을 추가하시겠습니까?')) return;
	
	$.post(
		"/back/07_delivery/orderItemCreate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert(resultJSON.error[0]);
			}
			
			if(resultJSON['insert'] > 0){
				alert('저장되었습니다.');
                getOrderInfo();
			}
		}
	)

}

function updateOrderItem(item_no){

    var formData = {
        item_no : item_no,				             
        item_qty : $('#item_qty'+item_no).val().trim(),        
        item_amount : $('#item_amount'+item_no).val().trim()        
	};

	if(!confirm('주문 상품 정보를 수정하시겠습니까?')) return;
	
	$.post(
		"/back/07_delivery/orderItemUpdate.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert(resultJSON.error[0]);
			}
			
			if(resultJSON['update'] > 0){
				alert('저장되었습니다.');
				getOrderInfo();
			}
		}
	)

}

function deleteOrderItem(item_no){

     var formData = {				
        item_no : item_no,        
	};

	if(!confirm('해당 주문 상품을 삭제하시겠습니까?')) return;
	
	$.post(
		"/back/07_delivery/orderItemDelete.jsp",
		formData,
		function(resultJSON){			
			console.log(resultJSON);
			if(resultJSON['error']){
				alert(resultJSON.error[0]);
			}
			
			if(resultJSON['delete'] > 0){
				alert('삭제되었습니다.');
                getOrderInfo();
			}
		}
	)

}


function setDeliveryManagerOptions(managerList, selectedManager){
        console.log(managerList);
                
        var $delveryManager = $('#delivery_manager');
        $delveryManager.empty();
        $(managerList).each( function(idx, item) {
            var option = '<option value="'+ item.vm_no +'"> '+ item.vm_name +'</option>';
            $delveryManager.append(option);
        });

        $delveryManager.val(selectedManager);
        
    }




function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}
