package embro.server.payload;

public class FileProcessRequest {

    private String fileName;
    private Integer pixelSize;

    public FileProcessRequest(String fileName, Integer pixelSize) {
        this.fileName = fileName;
        this.pixelSize = pixelSize;
    }

    public FileProcessRequest() {
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getPixelSize() {
        return pixelSize;
    }

    public void setPixelSize(Integer pixelSize) {
        this.pixelSize = pixelSize;
    }
}

