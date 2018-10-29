package embro.server.controller;

import embro.server.payload.FileProcessRequest;
import embro.server.service.FileStorageService;
import embro.server.model.Image;
import embro.server.payload.FileProcessResponse;
import embro.server.payload.ProcessedFile;
import embro.server.payload.UploadFileResponse;
import embro.server.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FileController {
    private FileStorageService fileStorageService;
    private ImageRepository imageRepository;

    @Autowired
    public FileController(FileStorageService fileStorageService, ImageRepository imageRepository) {
        this.fileStorageService = fileStorageService;
        this.imageRepository = imageRepository;
    }


    @PostMapping(value = "/uploadFile")
    public UploadFileResponse uploadFile(@RequestPart("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        BufferedImage image = null;
        try {
            image = ImageIO.read(file.getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
        long width = image.getWidth();
        long height = image.getHeight();

        String fileDonwnloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/downloadFile/")
                .path(fileName)
                .toUriString();
        Long id = imageRepository.save(new Image(fileDonwnloadUri, file.getSize(), fileName, file.getContentType(), width, height)).getId();



        return new UploadFileResponse(id, fileName, fileDonwnloadUri, file.getContentType(), file.getSize(), width, height);
    }


    @PostMapping(value = "/pixelate")
    public FileProcessResponse pixelateFile(@RequestBody FileProcessRequest request) {
        System.out.println("Controller | filename: " + request.getFileName() + "; - pixelSize: " + request.getPixelSize());
        ProcessedFile processedFile = fileStorageService.pixelate(request.getFileName(), request.getPixelSize());

        String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/downloadFile/")
                .path(processedFile.getName())
                .toUriString();
        return new FileProcessResponse(fileDownloadUrl,
                processedFile.getProcessedBufferedImage().getWidth(),
                processedFile.getProcessedBufferedImage().getHeight());
    }

//
//    @PostMapping("/uploadMultipleFiles")
//    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
//        return Arrays.asList(files)
//                .stream()
//                .map(file -> uploadFile(file))
//                .collect(Collectors.toList());
//    }


    @GetMapping("/downloadFile/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename, HttpServletRequest request) {
        // Load file as resource
        Resource resource = fileStorageService.loadFileAsResource(filename);
        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            System.out.println("Could not determine file type");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null)
            contentType = "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment: filename\"" + resource.getFilename() + "\"")
                .body(resource);
    }


    @GetMapping("/images")
    public List<UploadFileResponse> getAllImages() {
        return imageRepository.findAllOrderByIdDesc().stream().map(image -> new UploadFileResponse(image.getId(), image.getName(), image.getUrl(), image.getType(), image.getSize(), image.getWidth(),image.getHeight())).collect(Collectors.toList());
    }


//    @PostMapping("/process")
//    public FileProcessResponse processImage(@RequestBody FileProcessRequest request) {
////        Image image = imageRepository.findByName(request.getFileName());
//        ProcessedFile processedFile = fileStorageService.process(request.getFileName(), request.getPixelSize());
//        String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/api/downloadFile/")
//                .path(processedFile.getName())
//                .toUriString();
//
//        return new FileProcessResponse(fileDownloadUrl,
//                processedFile.getProcessedBufferedImage().getWidth(),
//                processedFile.getProcessedBufferedImage().getHeight());
//    }


}
