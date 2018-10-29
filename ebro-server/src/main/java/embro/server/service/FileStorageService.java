package embro.server.service;

import embro.server.exception.FileStorageException;
import embro.server.exception.MyFileNotFoundException;
import embro.server.payload.ProcessedBufferedImage;
import embro.server.payload.ProcessedFile;
import embro.server.property.FileStorageProperties;
import embro.server.util.PixelateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored", e);
        }
    }

    public String storeFile(MultipartFile file) {

        if (file.getOriginalFilename() == null) {
            throw new FileStorageException("The name of the file you are trying to save is null");
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = PixelateUtil.getFileExtension(fileName);

        fileName = UUID.randomUUID().toString() + '.' + fileExtension;

        System.out.println("store type: " + file.getContentType());

//        if (fileName.contains(".."))
//            throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);

        // Generate processed file name
        String processedFileName = fileName + "_processed." + fileExtension;

        try {
            Path originalTargetLocation = this.fileStorageLocation.resolve(fileName);
//            Path processedTargetLocation = this.fileStorageLocation.resolve(processedFileName);

            // Copy file to the target location
            Files.copy(file.getInputStream(), originalTargetLocation);

            // Copy duplicate of the file to the target location, which will be used for storing processed file
//            Files.copy(file.getInputStream(), processedTargetLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", e);
        }

        return fileName;
    }


    public ProcessedFile pixelate(String fileName, int pixelSize) {
        if (fileName == null) {
            throw new MyFileNotFoundException("Name of the file you are trying to process is null");
        }

//        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

        // Get original file
//        Path originalFileLocation = this.fileStorageLocation.resolve(fileName);
        // Get stored copy of original file,
        Path targetLocation = this.fileStorageLocation.resolve(fileName + "_processed." + PixelateUtil.getFileExtension(fileName));

        System.out.println("target location: " + targetLocation.toString());
        ProcessedFile processedFile = new ProcessedFile();
        try {

            BufferedImage bufferedImage = ImageIO.read(loadFileAsResource(fileName).getURL());

            if (bufferedImage == null) {
                throw new MyFileNotFoundException("The file you are trying to process does not exist");
            }

            // Pixelate file
            bufferedImage = PixelateUtil.pixelate(bufferedImage, pixelSize);

            // Store BufferedImage, image width and height in ProcessedBufferedImage
            ProcessedBufferedImage processedBufferedImage = new ProcessedBufferedImage(bufferedImage,
                    bufferedImage.getWidth(),
                    bufferedImage.getHeight());

            processedFile.setProcessedBufferedImage(processedBufferedImage);
            processedFile.setName(targetLocation.toFile().getName());

            // Replace existing copy of original file with processed file
            ImageIO.write(processedFile.getProcessedBufferedImage().getContent(), PixelateUtil.getFileExtension(fileName), targetLocation.toFile());
        } catch (IOException e) {
            System.out.println("ERROR: " + e.getMessage());
        }
        return processedFile;
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists())
                return resource;
            else
                throw new MyFileNotFoundException("File not found " + fileName);
        } catch (MalformedURLException e) {
            throw new MyFileNotFoundException("File not found " + fileName, e);
        }
    }
}
