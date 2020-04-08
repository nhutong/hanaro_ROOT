$(function () {
	

    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: '년'
    });
    $("#orderDate").datepicker();
    var date = new Date();
    $("#orderDate").val(date.getFullYear() + "-" + leadingZeros((date.getMonth()+1),2)+"-"+ leadingZeros(date.getDate(),2));

    $('#btnOrderSearch').on('click', function(){ getOrderList() });
    $('#orderDate').on('change', function(){ getOrderList() });
    
    getOrderList();
    getCompanyList();  
    
    getLeft();
    getNav();
       
});

// 주문 리스트 템플릿
var tpl_tr_tab1_table = _.template(
    '<tr id="order<%- rs_no %>" data-no="<%- rs_no %>">' +
    '<td><%- tel %></td>' +
	'<td><%- name %></td>'+ 
    '<td class="order_num" onclick="order_popup(<%- rs_no %>);"><%- rs_no %></td>' +
    '<td><%- rs_address1 %> <%- rs_address2 %></td>' +
    '<td><%- delivery_manager_name %></td>' +
    '<td class="order_time"><%- delivery_time %></td>' +
    '<td><%- order_status %></td>'
	);

    
function order_popup(rs_no){
    window.open('order_popup.html?rs_no='+rs_no + '&company_no='+getCookie("userCompanyNo"),
                '주문관리','width=375,height=640,location=no,status=no,scrollbars=yes,left=300,top=300')  
}


function getCompanyList(){
	$.get("../../back/00_include/getCompanyList.jsp",		
		function(resultJSON){						
			console.log(resultJSON);
			companyList = resultJSON['list'];
			if(companyList.lengh) return;
            setCompanyOptions(companyList);
		}
	);
}

function setCompanyOptions(companyList){
	var options = '';
	$(companyList).each( function (idx, company) {
		if(company.VM_CP_NO == 0 ) return;
		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
	});
    $('#company').append(options);
    getOrderList();    
}

function getOrderList(){
    var search = $('#orderSearch').val();
    var company_no = getCookie("userCompanyNo");
    var order_date = $('#orderDate').val();    
    var dataUrl = '../../back/07_delivery/orderList.jsp?company_no=' + company_no + '&order_date=' + order_date + '&search='+search;     

    $('#pagination').pagination({
        dataSource: dataUrl, //'/back/07_delivery/orderList.jsp',
        locator: 'list',
        totalNumberLocator: function(data) {
            
            console.log(data);
            // 배송현황 카운트 셋업
            $(data.status_total).each(function(idx, item){
                if(item.status_code == '104'){ // 104	배송완료
                  $('#orderDeliveryCount').text(item.order_count);
                }else if(item.status_code == '108'){ // 108	교환완료
                  $('#orderChangeCount').text(item.order_count);
                }else if(item.status_code == '111'){ // 111	반품완료 
                  $('#orderReturnCount').text(item.order_count);                    
                }
            });

            // 전체 카운트 리턴
            return data.total;
        },
        pageSize: 8,
        className: 'paginationjs-theme-green paginationjs-big',
        callback: function(list, pagination, data) {            
            if(search && !list.length) {
				alert('일치하는 정보가 없습니다');
                return;                
            }

            var $tbody = $('#orderList').empty();
            _.forEach(list,
                function(item) {
                    $tbody.append(tpl_tr_tab1_table(item));
                }
            );
        },
        formatAjaxError: function(jqXHR) {
            alert(jqXHR.responseJSON.error);
            window.history.back();
        }
    });
}    

// 시간 콤마 찍기
function timeComma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{2})+(?!\d))/g, '$1:')

}