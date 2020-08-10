<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFCell"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFRow"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFSheet"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFWorkbook"%>
<%@ page import="org.apache.poi.poifs.filesystem.POIFSFileSystem"%>
<%@ page import="org.apache.poi.ss.usermodel.Cell"%>
<%@ page import="org.apache.poi.ss.usermodel.DateUtil"%>
<%@ page import="org.apache.poi.ss.usermodel.Row"%>

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
        // HSSFWorkbook workBook  =  new HSSFWorkbook(new FileInputStream(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path)));
        HSSFWorkbook workBook  =  new HSSFWorkbook(new FileInputStream(new File(request.getRealPath("/upload/")+excel_path)));

		HSSFSheet sheet = workBook.getSheetAt(0);
        HSSFRow row;
        HSSFCell cell;
        int rows = sheet.getPhysicalNumberOfRows();
        int col = 0;

		for(int i = 1; i < rows; i++) {
            row = sheet.getRow(i);
			// 순서
		    col = 0;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }

			String string0 = "";

			if(cell.getCellType().toString() == "STRING"){
				string0 = cell.getStringCellValue().trim().replaceAll(",","").replaceAll("'","");
			}
			else if (cell.getCellType().toString() == "NUMBERIC"){
				string0 = cell.toString().trim().replaceAll(",","").replaceAll("'","");
				string0 = String.valueOf(Math.round(Double.parseDouble(string0)));
			}
			else if (cell.getCellType().toString() == "BLANK"){
				string0 ="";
				out.clear();
				out.print("order_number_no_exist");
				return;
			}

			if (isNumeric(string0) != true){
				out.clear();
				out.print("order_number_not_number");
				return;
			}
				    
			/*
			//String string0 = cell.getStringCellValue().trim();
			String string0 = cell.toString().trim().replaceAll("'","").replaceAll(",","");

			if ( string0.equals("") ){
				//순서가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("order_number_no_exist");
				return;
			}else{
				string0 = strEncode(string0);
				if ( isNumeric(string0) == true ){
					string0 = String.valueOf(Math.round(Double.parseDouble(string0)));
					System.out.println(string0);
				}else{
					//순서가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("order_number_not_number");
					return;
				}
			}
			*/

			// 상품코드 ( encode )
		    col = 1;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String string1 =""

			if (cell.getCellType().toString() == "STRING"){
				string1 = cell.getStringCellValue().trim().replaceAll(",","").replaceAll("'","");
			}
			else if (cell.getCellType().toString() =="NUMBERIC"){
				string1 = cell.toString().trim().replaceAll(",","").replaceAll("'","");
				string1 = String.valueOf(Math.round(Double.parseDouble(string1)));
			}
			else if (cell.getCellType().toString() =="BLANK"){
				string1 ="";
				out.clear();
				out.print("pd_code_no_exist");
				return;
			}

			if (isNumeric(string1) != true){
				out.clear();
				out.print("pd_code_not_number");
				return;
			}
			/*
		    //String string1 = cell.getStringCellValue().trim();
			String string1 = cell.toString().trim().replaceAll("'","").replaceAll(",","");
			if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist");
				return;
			}else{
				string1 = strEncode(string1);
				if (isNumeric(string1) == true )
				{
					string1 = String.valueOf(Math.round(Double.parseDouble(string1)));
					System.out.println(string1);
				}
				else {
					out.clear();
					out.print("pd_code_not_number");
					return;
				}
			}
			*/
			// 상품명 ( encode )
			col = 2;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string2 = cell.getStringCellValue().trim();
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
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String string2 ="";

			if (cell.getCellType().toString() == "STRING"){
				string2 = cell.getStringCellValue().trim().replaceAll(",","").replaceAll("'","");
			}
			else if (cell.getCellType().toString() =="NUMBERIC"){
				string2 = cell.toString().trim().replaceAll(",","").replaceAll("'","");
				string2 = String.valueOf(Math.round(Double.parseDouble(string2)));
			}
			else if (cell.getCellType().toString() =="BLANK"){
				string2 ="";
				out.clear();
				out.print("price_no_exist");
				return;
			}

			if (isNumeric(string2) != true){
				out.clear();
				out.print("price_not_number");
				return;
			}

			/*
		    //String string3 = cell.getStringCellValue().trim();
			String string3 = cell.toString().trim().replaceAll("'","").replaceAll(",","");
			if ( string3.equals("") ){
				//판매가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("price_no_exist");
				return;
			}else{
				string3 = strEncode(string3);
				if ( isNumeric(string3) == true ){
     				string3 = String.valueOf(Math.round(Double.parseDouble(string3)));
					System.out.println(string3);
				}else{
					//판매가가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("price_not_number");
					return;
				}
			}
			*/
			// 기타정보
			col = 4;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string4 = cell.getStringCellValue().trim();
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
		 
		 // workbook.close();
		
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