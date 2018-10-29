package embro.server.payload;

import java.awt.image.BufferedImage;

public class ProcessedBufferedImage {
    private BufferedImage content;
    private Integer width;
    private Integer height;

    public ProcessedBufferedImage() {
    }

    public ProcessedBufferedImage(BufferedImage content, Integer width, Integer height) {
        this.content = content;
        this.width = width;
        this.height = height;
    }


    public BufferedImage getContent() {
        return content;
    }

    public void setContent(BufferedImage content) {
        this.content = content;
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
}
