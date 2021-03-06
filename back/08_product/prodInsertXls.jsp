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
	String reg_no = (request.getParameter("reg_no")==null)? "0":request.getParameter("reg_no");
	Integer forResult = 0;

	try{

		//===============================================================================================================
		
		// 엑셀 업로드
		//Workbook workbook = Workbook.getWorkbook(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path));
		HSSFWorkbook workBook  =  new HSSFWorkbook(new FileInputStream(new File(request.getRealPath("/upload/")+excel_path)));

        HSSFSheet sheet = workBook.getSheetAt(0);
        HSSFRow row;
        HSSFCell cell;
        int rows = sheet.getPhysicalNumberOfRows();
        int col = 0;

		for(int i = 1; i < rows; i++) {
			forResult = i;
			row = sheet.getRow(i);
			// 상품코드 ( encode )
		    col = 0;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }	

			 String string1 = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                string1 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                string1 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                string1 = String.valueOf(Math.round(Double.parseDouble(string1))); 
            } else if (cell.getCellType().toString() == "BLANK") {   
                //string1 = "";         
				//NULL 예외처리
                out.clear();
				out.print("pd_code_no_exist");
				return;				
            }
			//숫자형 예외처리
            if ( isNumeric(string1) != true){
                out.clear();
				out.print("pd_code_not_number");
				return;
            }



			/*
		    //String string1 = cell.getStringCellValue().trim().replaceAll(",","");
			String string1 = cell.toString().trim().replaceAll(",","").replaceAll("'","");
			if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist," + Integer.toString(i) );
				return;
			}
			else{
				string1 = strEncode(string1);
				if ( isNumeric(string1) == true ){
					string1 = String.valueOf(Math.round(Double.parseDouble(string1)));
					System.out.println(string1);
				}else{
					//상품코드가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("pd_code_not_number");
					return;
				}
			}
			*/
			
			// 상품명 ( encode )
			col = 1;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string2 = cell.getStringCellValue().trim().replaceAll("'","");
			if ( string2.equals("") ){
				//상품명을 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_name_no_exist," + Integer.toString(i) );
				return;
			}

			// 그룹코드
			col = 2;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String string3 = cell.getStringCellValue().trim().replaceAll("'","");

			
			sql = " SELECT a.pd_no from vm_product AS a where a.pd_code = '"+string1+"'; ";
	
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
					
			rs.last();
			int listCount_exist = rs.getRow();
			rs.beforeFirst();

			if(listCount_exist == 0){
				sql = "insert into vm_product (pd_code, pd_name, group_tag, reg_no, reg_date) "
					+" values('"+string1+"', '"+string2+"', '"+string3+"', '"+reg_no+"', now()); ";
			}else{
				sql = "update vm_product "
				    +" set pd_name = '"+string2+"', "
					+" group_tag = '"+string3+"', "
					+" lst_no = '"+reg_no+"', "
					+" lst_date = now() "
					+" where pd_code = '"+string1+"' ";
			}

			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
		}

		// workbook.close();		

		out.clear();
		out.print("success" + "," + Integer.toString(rows) + "," + Integer.toString(forResult + 1) + "," + Integer.toString(rows-(forResult + 1)) );
	}catch(Exception e){
		out.clear();
		//out.print("exception error" + "," + Integer.toString(i-1) + "행," + e );
		out.print("exception error" + "," + e );		
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};


%>