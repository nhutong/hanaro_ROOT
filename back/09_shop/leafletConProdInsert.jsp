<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date,jxl.*"%>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%

	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String excel_path = (request.getParameter("excel_path")==null)? "0":request.getParameter("excel_path");
	excel_path = excel_path.trim();

	try{

		// 신규입력한 전단상품의 전단번호를 temp 테이블에서 select 한다.
		sql = " select jd_no as exist_jd_no from vm_shop_jundan where ref_company_no =  '" + userCompanyNo + "'; " ;

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
			
		rs.last();
		int listCount0 = rs.getRow();
		if(listCount0 == 0){
			out.clear();
			out.print("NoN0");
			return;
		};
		rs.beforeFirst();	
		Integer exist_jd_no = 0;
		while(rs.next()){
			exist_jd_no = rs.getInt("exist_jd_no");     // 신규 전단번호
		}

		//===============================================================================================================
		
		// 엑셀 업로드
		Workbook workbook = Workbook.getWorkbook(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path));

		Sheet sheet = workbook.getSheet(0);
		int row = sheet.getRows();
		int col = 0;
		Cell cell;

		for(int i = 1; i < row; i++) {

			// 순서
		    col = 0;
		    cell = sheet.getCell(col,i);
		    String string0 = cell.getContents().trim();

			if ( string0.equals("") ){
				//순서가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("order_number_no_exist");
				return;
			}else{
				if ( isNumeric(string0) == true ){
				}else{
					//순서가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("order_number_not_number");
					return;
				}
			}

			// 상품코드 ( encode )
		    col = 1;
		    cell = sheet.getCell(col,i);
		    String string1 = cell.getContents().trim();
			if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist");
				return;
			}else{
				string1 = strEncode(string1);
			}

			// 상품명 ( encode )
			col = 2;
		    cell = sheet.getCell(col,i);
		    String string2 = cell.getContents().trim();
			if ( string2.equals("") ){
				//상품명을 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_name_no_exist");
				return;
			}else{
				string2 = strEncode(string2);
			}

			// 판매가
			col = 3;
		    cell = sheet.getCell(col,i);
		    String string3 = cell.getContents().trim();
			if ( string3.equals("") ){
				//판매가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("price_no_exist");
				return;
			}else{
				if ( isNumeric(string3) == true ){
				}else{
					//판매가가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("price_not_number");
					return;
				}
			}

			// 기타정보
			col = 4;
		    cell = sheet.getCell(col,i);
		    String string4 = cell.getContents().trim();
			string4 = strEncode(string4);

			//========================================================================================
			//입력정보 끝================================================================================
			//========================================================================================

			// 신규입력한 전단상품의 상품번호(내부용)를 select 한다.
			sql = " select pd_no from vm_product "
			    + " where pd_code = '"+string1+"'; ";

			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			
			rs.last();
//			int listCount = rs.getRow();
//			if(listCount == 0){
//				out.clear();
//				out.print("NoNPdNo");
//				return;
//			};
			rs.beforeFirst();
			String pd_no = "";		
			while(rs.next()){
				pd_no = rs.getString("pd_no");     // 신규 상품번호(내부용)	
			}
			if (pd_no.equals("")){
				pd_no = "";
			}else{
			}
				
			// 신규입력한 전단상품에 매핑할 이미지번호를 select 한다.
			String img_no = "";
			if (pd_no.equals("")){
				img_no = "";	
			}else{
				sql = " SELECT img_no from vm_product_image WHERE ref_pd_no = "+pd_no+" ORDER BY reg_date DESC LIMIT 0,1 ; ";
				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
		
				rs.last();
	//			int listCount2 = rs.getRow();
	//			if(listCount2 == 0){
	//				out.clear();
	//				out.print("NoNImgNo");
	//				return;
	//			};
				rs.beforeFirst();		
		
				while(rs.next()){
					img_no = rs.getString("img_no");     // 신규 전단상품번호	
				}
				if (img_no.equals("")){
					img_no = "";
				}else{
				}
			}

			
	
			//순서가 없으면 어떤 작업도 하지 않는다.
			if(string0 == ""){
			}else{
				
				// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
				sql = "insert into vm_shop_jundan_prod_content (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, etc) "
					+" values("+exist_jd_no+", '"+string0+"', '"+pd_no+"', '"+img_no+"', '"+string2+"', '"+string3+"', '"+string4+"'); ";

				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

			}

		 }
		 
		 workbook.close();
		
		out.clear();
//		out.print("success");
		out.print(exist_jd_no);

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};


%>