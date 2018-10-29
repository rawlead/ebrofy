package embro.server.payload;

public class ProcessedFile {
    private ProcessedBufferedImage processedBufferedImage;
    private String name;

    public ProcessedFile(ProcessedBufferedImage processedBufferedImage, String name) {
        this.processedBufferedImage = processedBufferedImage;
        this.name = name;
    }

    public ProcessedFile() {
    }

    public ProcessedBufferedImage getProcessedBufferedImage() {
        return processedBufferedImage;
    }

    public void setProcessedBufferedImage(ProcessedBufferedImage processedBufferedImage) {
        this.processedBufferedImage = processedBufferedImage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
