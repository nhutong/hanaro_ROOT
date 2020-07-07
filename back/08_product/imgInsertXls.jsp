<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>
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
	String reg_no = (request.getParameter("reg_no")==null)? "0":request.getParameter("reg_no");

	try{

		//===============================================================================================================
		
		// 엑셀 업로드
		// Workbook workbook = Workbook.getWorkbook(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path));
        HSSFWorkbook workBook  =  new HSSFWorkbook(new FileInputStream(new File(request.getRealPath("/upload/")+excel_path)));		

		int col = 0;
        HSSFSheet sheet = workBook.getSheetAt(0);
        HSSFRow row;
        HSSFCell cell;
        int rows = sheet.getPhysicalNumberOfRows();

		for(int i = 1; i < rows; i++) {
            row = sheet.getRow(i);
			// 상품코드 ( encode )
		    col = 0;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string1 = cell.getStringCellValue().trim();
			if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist");
				return;
			}else{
//				string1 = strEncode(string1);
			}

			// 상품명 ( encode )
			col = 1;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string2 = cell.getStringCellValue().trim();
			if ( string2.equals("") ){
				//상품명을 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_name_no_exist");
				return;
			}else{
//				string2 = strEncode(string2);
			}

			// 그룹코드
			col = 2;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string3 = cell.getStringCellValue().trim();
//			string3 = strEncode(string3);

			// 이미지명
			col = 3;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string4 = cell.getStringCellValue().trim();
//			string4 = strEncode(string4);

			//========================================================================================
			//입력정보 끝================================================================================
			//========================================================================================

				// 신규입력한 전단상품의 전단번호를 temp 테이블에서 select 한다.
				sql = " select pd_no as ref_pd_no from vm_product where pd_code =  '" + string1 + "'; " ;

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int listCount0 = rs.getRow();
				if(listCount0 == 0){
					out.clear();
					out.print("NoN_pdCode,"+string1);
					return;
				};
				rs.beforeFirst();	
				Integer ref_pd_no = 0;
				while(rs.next()){
					ref_pd_no = rs.getInt("ref_pd_no");     // 신규 전단번호
				}

				// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
				sql = "insert into vm_product_image (img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_no, reg_date) "
					+" values('"+string4+"', "+ref_pd_no+", '"+string1+"', '"+string3+"', 'N', '"+reg_no+"', now()); ";

				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();


		 }
		 
		 workbook.close();
		
		out.clear();
		out.print("success");

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};


%>