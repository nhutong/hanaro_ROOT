<%@ page language="java" contentType="text/html; charset=UTF-8" %>
 
<%@ page import="java.io.*"%>
<%@ page import="java.text.*" %>
<%@ page import="java.lang.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.sql.*" %>
 
<%@ include file = "../00_include/dbConn.jsp" %>
 
<%
    request.setCharacterEncoding("UTF-8");

	String img_no = (request.getParameter("img_no")==null)? "0":request.getParameter("img_no");

	// sql = " SELECT img_path from vm_product_image where img_no = '"+img_no+"'; ";
	sql = " SELECT replace(img_path,char(13),'') as img_path from vm_product_image where img_no = '"+img_no+"'; ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);

	rs.last();
	int listCount = rs.getRow();
	if(listCount == 0){
		out.clear();
		out.print("NoN");
		return;
	};
	rs.beforeFirst();

	while(rs.next()){
	
		String img_path   = rs.getString("img_path");
	
		// 파일 업로드된 경로
		String root = request.getSession().getServletContext().getRealPath("/");
		String savePath = root + "upload";
			 
		// 서버에 실제 저장된 파일명
		//String filename = "kkk.txt" ;
		String filename = img_path;
				 
		// 실제 내보낼 파일명
		//String orgfilename = "kk1.txt" ;
		String orgfilename = img_path ;
			 
		InputStream in = null;
		OutputStream os = null;
		File file = null;
		boolean skip = false;
		String client = "";



		// 파일을 읽어 스트림에 담기
			try{
				file = new File(savePath, filename);
				in = new FileInputStream(file);
			}catch(FileNotFoundException fe){
				skip = true;
			}
			 
			client = request.getHeader("User-Agent");
	 
			// 파일 다운로드 헤더 지정
			response.reset() ;
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Description", "JSP Generated Data");
	 
			if(!skip){
				 
				// IE
				if(client.indexOf("MSIE") != -1){
					response.setHeader ("Content-Disposition", "attachment; filename="+new String(orgfilename.getBytes("KSC5601"),"ISO8859_1"));
	 
				}else{
					// 한글 파일명 처리
					orgfilename = new String(orgfilename.getBytes("utf-8"),"iso-8859-1");
	 
					response.setHeader("Content-Disposition", "attachment; filename=\"" + orgfilename + "\"");
					response.setHeader("Content-Type", "application/octet-stream; charset=utf-8");
				} 
				 
				response.setHeader ("Content-Length", ""+file.length() );
		   
				os = response.getOutputStream();
				byte b[] = new byte[(int)file.length()];
				int leng = 0;
				 
				while( (leng = in.read(b)) > 0 ){
					os.write(b,0,leng);
				}
	 
			}else{
				response.setContentType("text/html;charset=UTF-8");
				out.println("<script language='javascript'>alert('파일을 찾을 수 없습니다');history.back();</script>");
	 
			}
			 
			in.close();
			os.close();

	}

    try{



		

	 
			//// 파일을 읽어 스트림에 담기
			//try{
				//file = new File(savePath, filename);
				//in = new FileInputStream(file);
			//}catch(FileNotFoundException fe){
				//skip = true;
			//}
			 
			//client = request.getHeader("User-Agent");
	 
			//// 파일 다운로드 헤더 지정
			//response.reset() ;
			//response.setContentType("application/octet-stream");
			//response.setHeader("Content-Description", "JSP Generated Data");
	 
			//if(!skip){
				 
				//// IE
				//if(client.indexOf("MSIE") != -1){
					//response.setHeader ("Content-Disposition", "attachment; filename="+new String(orgfilename.getBytes("KSC5601"),"ISO8859_1"));
	 
				//}else{
					//// 한글 파일명 처리
					//orgfilename = new String(orgfilename.getBytes("utf-8"),"iso-8859-1");
	 
					//response.setHeader("Content-Disposition", "attachment; filename=\"" + orgfilename + "\"");
					//response.setHeader("Content-Type", "application/octet-stream; charset=utf-8");
				//} 
				 
				//response.setHeader ("Content-Length", ""+file.length() );
		   
				//os = response.getOutputStream();
				//byte b[] = new byte[(int)file.length()];
				//int leng = 0;
				 
				//while( (leng = in.read(b)) > 0 ){
					//os.write(b,0,leng);
				//}
	 
			//}else{
				//response.setContentType("text/html;charset=UTF-8");
				//out.println("<script language='javascript'>alert('파일을 찾을 수 없습니다');history.back();</script>");
	 
			//}
			 
			//in.close();
			//os.close();

 
        
 
    }catch(Exception e){
      e.printStackTrace();
    }
%>