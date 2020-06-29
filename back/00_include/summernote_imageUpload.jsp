<%@ page language="java" contentType="text/html; charset=UTF-8" %>
 
<%@page import="com.oreilly.servlet.MultipartRequest" %>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy" %>
<%@page import="java.io.*" %>
<%@page import="java.util.*" %>
<%@page import="java.text.SimpleDateFormat" %>
<%@ page import="org.json.simple.JSONObject"%>

<%@ include file = "../00_include/imgResize.jsp" %> 

<%
    request.setCharacterEncoding("UTF-8");

    //영문 + 숫자 난수 만들기
	Random rnd =new Random();
	
	StringBuffer ran =new StringBuffer();
		
	for(int i=0;i<10;i++){
	    if(rnd.nextBoolean()){
	        ran.append((char)((int)(rnd.nextInt(26))+97));
	    }else{
	        ran.append((rnd.nextInt(10))); 
	    }
	}

    // 10Mbyte 제한
    int maxSize  = 1024*1024*10;       
 
    // 웹서버 컨테이너 경로
    //String root = request.getSession().getServletContext().getRealPath("/");
    String root = request.getRealPath("/upload/");
//    String root = "C:\\Users\\visualwave17\\Desktop\\JSP_TEST\\test\\";
//  	out.print(root);
    // 파일 저장 경로(ex : /home/tour/web/ROOT/upload)
    String savePath = root;

    // 업로드 파일명
    String uploadFile = "";
 
    // 실제 저장할 파일명
    String newFileName = "";
 
    int read = 0;
    byte[] buf = new byte[1024];
    FileInputStream fin = null;
    FileOutputStream fout = null;
    long currentTime = System.currentTimeMillis(); 
    SimpleDateFormat simDf = new SimpleDateFormat("yyyyMMddHHmmss"); 
 	
    try{
 
        MultipartRequest multi = new MultipartRequest(request, savePath, maxSize, "UTF-8", new DefaultFileRenamePolicy());
         
        // 전송받은 parameter의 한글깨짐 방지
        //String title = multi.getParameter("title");
        //title = new String(title.getBytes("8859_1"), "UTF-8");
        
        // 파일업로드
        uploadFile = multi.getFilesystemName("uploadFile[]");
        // out.print("ss"+uploadFile);
        // 실제 저장할 파일명(ex : 20140819151221.zip)
        //newFileName = simDf.format(new Date(currentTime)) + ran +"_"+ uploadFile;
        newFileName = simDf.format(new Date(currentTime))+"_"+ uploadFile;

        // 업로드된 파일 객체 생성
        File oldFile = new File(savePath + uploadFile);
 
         
        // 실제 저장될 파일 객체 생성
        File newFile = new File(savePath + newFileName);
         
 
        // 파일명 rename
        if(!oldFile.renameTo(newFile)){
 
            // rename이 되지 않을경우 강제로 파일을 복사하고 기존파일은 삭제
 
            buf = new byte[1024];
            fin = new FileInputStream(oldFile);
            fout = new FileOutputStream(newFile);
            read = 0;
            while((read=fin.read(buf,0,buf.length))!=-1){
                fout.write(buf, 0, read);
            }
                            
            fin.close();
            fout.close();
            oldFile.delete();
        }

		/* 파일 확장자 추출하여 jpg 또는 jpeg 일경우 이미지 resize 한다. */
		String filePath = savePath + newFileName;
	    int pos = filePath.lastIndexOf( "." );
	    String fileExt = filePath.substring( pos + 1 );
	    
		if ( fileExt.equals("jpg") || fileExt.equals("jpeg") ){
			createThumbnail(filePath,filePath,360);
			createThumbnail(filePath,savePath +"180_"+ newFileName,180);
			createThumbnail(filePath,savePath +"90_"+ newFileName,90);
			createThumbnail(filePath,savePath +"720_"+ newFileName,720);
			createThumbnail(filePath,savePath +"45_"+ newFileName,45);
			createThumbnail(filePath,savePath +"1440_"+ newFileName,1440);
		}else{
		}
        
        out.print(newFileName); 
        
 
    }catch(Exception e){
        
      	out.println(e.getMessage());
    	out.print("upload error");
//         e.printStackTrace();
    } 
    // 업로드된 경로와 파일명을 통해 이미지의 경로를 생성
	String uploadPath = "/upload/" + newFileName;
	
    // 생성된 경로를 JSON 형식으로 보내주기 위한 설정
	JSONObject jobj = new JSONObject();
	jobj.put("url", uploadPath);
	
	response.setContentType("application/json"); // 데이터 타입을 json으로 설정하기 위한 세팅
	out.print(jobj.toJSONString());


%>