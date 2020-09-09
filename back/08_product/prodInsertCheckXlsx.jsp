<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="org.apache.poi.poifs.filesystem.POIFSFileSystem"%>
<%@ page import="org.apache.poi.ss.usermodel.Cell"%>
<%@ page import="org.apache.poi.ss.usermodel.DateUtil"%>
<%@ page import="org.apache.poi.ss.usermodel.Row"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFCell"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFRow"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFSheet"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>

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
		XSSFWorkbook workBook  =  new XSSFWorkbook(new FileInputStream(new File(request.getRealPath("/upload/")+excel_path)));

		XSSFSheet sheet = workBook.getSheetAt(0);
        XSSFRow row;
        XSSFCell cell;
        int rows = sheet.getPhysicalNumberOfRows();
        int col = 0;

		int dup = 0;
		int new1 = 0;
		int i;			

		for(i = 1; i < rows; i++) {
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
		    //String string1 = cell.getStringCellValue().trim();
			String string1 = cell.toString().trim().replaceAll("'","").replaceAll(",","");

            if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist," + Integer.toString(i) );
				return;            
			}else{				
				string1 = strEncode(string1);
				if ( isNumeric(string1) == true ){
					string1 = String.valueOf(Math.round(Double.parseDouble(string1)));
					System.out.println(string1);
				}else{
					//쿠폰할인가가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("discount_price_not_number");
					return;
				}
			}
			*/
			sql = " SELECT a.pd_no from vm_product AS a where a.pd_code = '"+string1+"'; ";	
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);					
			rs.last();
            int listCount_exist = rs.getRow();
            if(listCount_exist != 0){
				dup++;
            }else{
				new1++;
			}
            rs.beforeFirst();            
		};
		 
		// workbook.close();		
		out.clear();
		out.print("success" + "," + Integer.toString(i-1) + "," + Integer.toString(new1) + "," + Integer.toString(dup) );

	}catch(Exception e){
        out.clear();
		//out.print("exception error" + "," + Integer.toString(i-1) + "행," + e );		
		out.print("exception error" + "," + e );
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};


%>