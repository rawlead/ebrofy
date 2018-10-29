package embro.server.payload;

public class FileProcessResponse {
    private String fileDownloadUri;
    private Integer width;
    private Integer height;

    public FileProcessResponse(String fileDownloadUri, Integer width, Integer height) {
        this.fileDownloadUri = fileDownloadUri;
        this.width = width;
        this.height = height;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public FileProcessResponse() {
    }

    public String getFileDownloadUri() {
        return fileDownloadUri;
    }

    public void setFileDownloadUri(String fileDownloadUri) {
        this.fileDownloadUri = fileDownloadUri;
    }
}
