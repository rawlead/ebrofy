package embro.server.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.*;
import java.util.List;

public class PixelateUtil {

    public static BufferedImage pixelate(BufferedImage originalImage, int pixelSize) {

        BufferedImage pixelateImage = new BufferedImage(
                originalImage.getWidth() / pixelSize + 1,
                originalImage.getHeight() / pixelSize + 1,
                originalImage.getType()
        );

        List<Integer> dominantColors = new ArrayList<>();

        for (int y = 0; y < originalImage.getHeight(); y += pixelSize) {
            for (int x = 0; x < originalImage.getWidth(); x += pixelSize) {
                BufferedImage croppedImage = getCroppedImage(originalImage, x, y, pixelSize, pixelSize);
                Color dominantColor = getDominantColor(croppedImage);
                dominantColors.add(dominantColor.getRGB());
//                for (int yD = y; (yD < y + pixelSize) && (yD < pixelateImage.getHeight()); yD++) {
//                    for (int xD = x; (xD < x + pixelSize) && (xD < pixelateImage.getWidth()); xD++) {
                        pixelateImage.setRGB(x / pixelSize, y / pixelSize, dominantColor.getRGB());
//                    }
//                }
            }
        }
        return pixelateImage;
    }

    private static BufferedImage getCroppedImage(BufferedImage image, int startX, int startY, int width, int height) {
        if (startX < 0) startX = 0;
        if (startY < 0) startY = 0;
        if (startX > image.getWidth()) startX = image.getWidth();
        if (startY > image.getHeight()) startY = image.getHeight();
        if (startX + width > image.getWidth()) width = image.getWidth() - startX;
        if (startY + height > image.getHeight()) height = image.getHeight() - startY;
        return image.getSubimage(startX, startY, width, height);
    }


    private static Color getDominantColor(BufferedImage image) {
        Map<Integer, Integer> colorCounter = new HashMap<>(100);
        for (int x = 0; x < image.getWidth(); x++) {
            for (int y = 0; y < image.getHeight(); y++) {
                int currentRGB = image.getRGB(x, y);
                int count = colorCounter.getOrDefault(currentRGB, 0);
                colorCounter.put(currentRGB, count + 1);
            }
        }
        return getDominantColor(colorCounter);
    }

    private static Color getDominantColor(Map<Integer, Integer> colorCounter) {
        int dominantRGB = colorCounter.entrySet().stream()
                .max((entry1, entry2) -> entry1.getValue() > entry2.getValue() ? 1 : -1)
                .get()
                .getKey();
        return new Color(dominantRGB);
    }

    public static String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

}
