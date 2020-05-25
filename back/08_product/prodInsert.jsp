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
	String reg_no = (request.getParameter("reg_no")==null)? "0":request.getParameter("reg_no");
	String update_fg = (request.getParameter("update_fg")==null)? "N":request.getParameter("update_fg");

	try{

		//===============================================================================================================
		
		// 엑셀 업로드
		//Workbook workbook = Workbook.getWorkbook(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path));
        Workbook workbook = Workbook.getWorkbook(new File(request.getRealPath("/upload/")+excel_path)); 		

		Sheet sheet = workbook.getSheet(0);
		int row = sheet.getRows();
		int col = 0;
		Cell cell;

		String dataTypeCd = "";

		for(int i = 1; i < row; i++) {

			// 상품코드 ( encode )
		    col = 0;
		    cell = sheet.getCell(col,i);
		    String string1 = cell.getContents().trim();
			if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist," + Integer.toString(i) );
				return;
			}
			
			sql = " SELECT a.pd_no from vm_product AS a where a.pd_code = '"+string1+"'; ";
	
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
					
			rs.last();
			int listCount_exist = rs.getRow();

			if(listCount_exist == 0){
				dataTypeCd = "INSERT";
			}else{
				if ( update_fg.equals("N") ){
					//중복된 상품코드 존재 시 중단시킴!
					out.clear();
					out.print("exist," + Integer.toString(i) );
					return;	
				}else {
					dataTypeCd = "UPDATE";
				}
			}

			rs.beforeFirst();


			// 상품명 ( encode )
			col = 1;
		    cell = sheet.getCell(col,i);
		    String string2 = cell.getContents().trim();
			if ( string2.equals("") ){
				//상품명을 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_name_no_exist," + Integer.toString(i) );
				return;
			}

			// 그룹코드
			col = 2;
		    cell = sheet.getCell(col,i);
		    String string3 = cell.getContents().trim();
	
			if ( dataTypeCd.equals("INSERT") ){

				// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
				sql = "insert into vm_product (pd_code, pd_name, group_tag, reg_no, reg_date) "
					+" values('"+string1+"', '"+string2+"', '"+string3+"', '"+reg_no+"', now()); ";

				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

			}else{

				// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
				sql = "update vm_product "
				    +" set pd_name = '"+string2+"', "
					+" group_tag = '"+string3+"', "
					+" lst_no = '"+reg_no+"', "
					+" lst_date = now() "
					+" where pd_code = '"+string1+"' ";

				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();
			}

		}
		 
		workbook.close();
		
		out.clear();
		out.print("success");

	}catch(Exception e){
		out.clear();
		//out.print("exception error," + e.getMessage() + "," + e );	
		out.print("exception error," + Integer.toString(i) + "행,"	+ e );
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};


%>