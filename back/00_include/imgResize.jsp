<%@ page import="java.io.*,
                java.awt.*,
                java.awt.image.*,
                javax.swing.*,
                com.sun.image.codec.jpeg.*"
 %>
<%!
    public static void createThumbnail(String soruce, String target, int targetW) throws Exception
    {
        Image imgSource = new ImageIcon(soruce).getImage();

        int oldW = imgSource.getWidth(null);
        int oldH = imgSource.getHeight(null);

        int newW = targetW;
        int newH = (targetW * oldH) / oldW;

        Image imgTarget = imgSource.getScaledInstance(newW, newH, Image.SCALE_SMOOTH);

        int pixels[] = new int[newW * newH];

        PixelGrabber pg = new PixelGrabber(imgTarget, 0, 0, newW, newH, pixels, 0, newW);
        pg.grabPixels();

        BufferedImage bi = new BufferedImage(newW, newH, BufferedImage.TYPE_INT_RGB);
        bi.setRGB(0, 0, newW, newH, pixels, 0, newW);

        FileOutputStream fos = new FileOutputStream(target);

        JPEGImageEncoder jpeg = JPEGCodec.createJPEGEncoder(fos);

        JPEGEncodeParam jep = jpeg.getDefaultJPEGEncodeParam(bi);
        jep.setQuality(1, false);

        jpeg.encode(bi, jep);

        fos.close();
    }
%>
<%
//    createThumbnail("C:/apache-tomcat-8.5.45/webapps/ROOT/upload/부채살.jpg","C:/apache-tomcat-8.5.45/webapps/ROOT/upload/부채살_result.jpg",320);
%>
