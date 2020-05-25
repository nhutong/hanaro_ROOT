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
        // Workbook workbook = Workbook.getWorkbook(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path));
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

            if(listCount_exist != 0){
				out.print("exist," + string1 );
				return;	
            }

            rs.beforeFirst();            

		};
		 
		workbook.close();
		
		out.clear();
		out.print("success");

	}catch(Exception e){
        out.clear();
		out.print("exception error," + sql );
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};


%>