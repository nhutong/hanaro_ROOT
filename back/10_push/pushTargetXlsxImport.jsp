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

	String pm_no = (request.getParameter("pm_no")==null)? "0":request.getParameter("pm_no");
	String excel_path = (request.getParameter("excel_path")==null)? "":request.getParameter("excel_path");
	String overwrite = (request.getParameter("overwrite")==null)? "N":request.getParameter("overwrite");
	
	excel_path = excel_path.trim();

	try{

        int del_cnt = 0;
		int ins_cnt = 0;   
		int all_ins_cnt = 0;   		

		// 푸시메시지 있는지 확인
		sql = " SELECT pm_no from vm_push_message	WHERE pm_target = '대상등록' and pm_no = "+pm_no+" ;";
						
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
				
		rs.last();
		int pm_exist = rs.getRow();

		if(pm_exist == 0){
			//등록된 푸시메시지가 없어 중단함
			out.clear();
			out.print("no_pm");
			return;
		}
		rs.beforeFirst();    


		//타깃이 등록되어 있는지 확인
		sql = " SELECT pmt_no from vm_push_message_target where pm_no = "+pm_no+"; "; 

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
				
		rs.last();
		int pmt_exist = rs.getRow();
		if(pmt_exist == 0){
		}else{
			//등록된 대상자가 이미 있음			
			if( overwrite.equals("Y")){
				//삭제하고 계속 진행
				sql = " delete from vm_push_message_target where pm_no = "+pm_no+"; "; 
				pstmt = conn.prepareStatement(sql);
				del_cnt = pstmt.executeUpdate();
			}else{
				//멈춤
				out.clear();
				out.print("pmt_no_dup");
				return;
			}
		}
		rs.beforeFirst();    


		// 엑셀 업로드
		XSSFWorkbook workBook  =  new XSSFWorkbook(new FileInputStream(new File(request.getRealPath("/upload/")+excel_path)));
        XSSFSheet sheet = workBook.getSheetAt(0);
        XSSFRow row;
        XSSFCell cell;
        int rows = sheet.getPhysicalNumberOfRows();
        int col = 0;

		for(int i = 1; i < rows; i++) {
            row = sheet.getRow(i);
			// 전화번호
		    col = 0;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    //String string0 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "").replaceAll("-", "");
			String string0 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "").replaceAll("-", "");

			if ( string0.equals("") ){
				//전화번호가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("no_no_exist"+","+Integer.toString(i));
				return;
			}else{
				string0 = strEncode(string0);
				if ( isNumeric(string0) == true ){
					string0 = String.valueOf(Math.round(Double.parseDouble(string0)));
					System.out.println(string0);
				}else{
					//전화번호가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("no_not_number"+","+Integer.toString(i));
					return;
				}
			}
		
			sql = " insert into vm_push_message_target(pm_no, no, reg_date, tel) "
		         +" select a.pm_no, b.no, NOW(), b.tel "
		         +"   from vm_push_message a "
		         +"   inner join vm_member b on a.vm_cp_no = b.company_no "
				 +"  where a.pm_target = '대상등록' "
				 +"    and length(b.tel) IN (13, 11) "
				 +"    and a.pm_no = "+pm_no+"	"
				 +"    and b.tel like '%"+string0+"' ; ";

			pstmt = conn.prepareStatement(sql);
			ins_cnt = pstmt.executeUpdate();

			all_ins_cnt += ins_cnt;
			// 엑셀 row 루프끝
		}

		/* 엑셀메모리를 close 한다. */
		// workbook.close();
		
		out.clear();
		out.print("success"+","+Integer.toString(all_ins_cnt)+","+Integer.toString(del_cnt)+","+sql);
	}catch(Exception e){
		out.clear();
		out.print("exception error"+","+e);	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {}		
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};

%>