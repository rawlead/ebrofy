let centroids: any;

// Check for equality of elements in two arrays
const arraysEqual = (a1: any, a2: any) => {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; ++i) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
};

// Given width w and height h, rescale the dimensions to satisfy
// he specified number of pixels
const rescaleDimensions = (w: number, h: number, pixels: number) => {
    const aspectRatio = w / h;
    const scalingFactor = Math.sqrt(pixels / aspectRatio);
    const rescaledW = Math.floor(aspectRatio * scalingFactor);
    const rescaledH = Math.floor(scalingFactor);
    return [rescaledW, rescaledH];
};

// Given an Image, return a dataset with pixel colors.
// If resized_pixels > 0, image will be resized prior to building
// the dataset.
// return: [[R,G,B,a], [R,G,B,a], [R,G,B,a], ...]
export const getPixelDataset = (img: any, resizedPixels: number) => {
    if (resizedPixels === undefined) {
        resizedPixels = -1;
    }
    // Get pixel colors from a <canvas> width the image
    const canvas = document.createElement("canvas");
    const imgNPixels = img.width * img.height;
    let canvasWidth = img.width;
    let canvasHeight = img.height;
    if (resizedPixels > 0 && imgNPixels > resizedPixels) {
        const rescaled = rescaleDimensions(img.width, img.height, resizedPixels);
        canvasWidth = rescaled[0];
        canvasHeight = rescaled[1];
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const canvasNPixels = canvasWidth * canvasHeight;
    const context = canvas.getContext("2d");
    if (!context) {
        alert("Context is null (getPixelDataset)");
        return;
    }
    context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    const flattenedDataset = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const nChannels = flattenedDataset.length / canvasNPixels;
    const dataset = [];
    for (let i = 0; i < flattenedDataset.length; i += nChannels) {
        dataset.push(flattenedDataset.slice(i, i + nChannels));
    }
    return dataset;
};

// Given a point and a list of neighbor points, return the index
// for the neighbor that's closest to the point
const nearestNeighbor = (point: any, neightbors: any) => {
    let bestDist = Infinity; // squared distance
    let bestIndex = -1;
    for (let i = 0; i < neightbors.length; ++i) {
        const neighbor = neightbors[i];
        let dist = 0;
        for (let j = 0; j < point.length; ++j) {
            dist += Math.pow(point[j] - neighbor[j], 2);
        }
        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
        }
    }
    return bestIndex;
};

// Returns the centroid of a dataset
const centroid = (dataset: any) => {
    if (dataset.length === 0) {
        return [];
    }
    // Calculate running means
    const runningCentroid: any = [];
    for (let i = 0; i < dataset[0].length; ++i) {
        runningCentroid.push(0);
    }
    for (let i = 0; i < dataset.length; ++i) {
        const point = dataset[i];
        for (let j = 0; j < point.length; ++j) {
            runningCentroid[j] += (point[j] - runningCentroid[j]) / (i + 1);
        }
    }
    return runningCentroid;
};

// Returns the k-means centroids
export const kMeans = (dataset: any, k: number) => {
    if (k === undefined) {
        k = Math.min(3, dataset.length);
    }
    // Use a seeded random number generator instead of Math.random(),
    // so that k-mans always produces the same centroids for the same input
    let rngSeed = 0;
    const random = () => {
        rngSeed = (rngSeed * 9301 + 49297) % 233280;
        return rngSeed / 233280;
    };

    // Choose initial centroids randomly
    centroids = [];
    for (let i = 0; i < k; ++i) {
        const idx = Math.floor(random() * dataset.length);
        centroids.push(dataset[idx]);
    }
    while (true) {
        // 'clusters is an array of arrays. each sub-array corresponds to
        // a cluster, and has the points in that cluster
        const clusters: any = [];
        for (let i = 0; i < k; ++i) {
            clusters.push([]);
        }
        for (let i = 0; i < dataset.length; ++i) {
            const point = dataset[i];
            const nearestCentroid = nearestNeighbor(point, centroids);
            clusters[nearestCentroid].push(point);
        }
        let converged = true;
        for (let i = 0; i < k; ++i) {
            const cluster = clusters[i];
            let centroidI = [];
            if (cluster.length > 0) {
                centroidI = centroid(cluster);
            } else {
                // For an empty cluster, set a random point as the centroid
                const idx = Math.floor(random() * dataset.length);
                centroidI = dataset[idx];
            }
            converged = converged && arraysEqual(centroidI, centroids[i]);
            centroids[i] = centroidI;
        }
        if (converged) {
            break;
        }
    }
    return centroids;
};

// Takes an <img> as input and returns a pixelatedAndQuanitizedFile data URL
export const quantize = (img: any, colors: any) => {
    const width = img.width;
    const height = img.height;
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    const sourceContext = sourceCanvas.getContext("2d");
    if (!sourceContext) {
        alert("Source context is null (quantize)")
        return;
    }
    sourceContext.drawImage(img, 0, 0, width, height);

    // flattened_*_data = [R, G, B, a, R, G, B, a, ...] where
    // (R, G, B, a) groups each correspond to a single pixel, and they are
    // column-major ordered.
    const flattenedSourceData = sourceContext.getImageData(
        0, 0, width, height).data;
    const nPixels = width * height;
    const nChannels = flattenedSourceData.length / nPixels;

    const flattenedQuantizedData = new Uint8ClampedArray(flattenedSourceData.length);

    // Set each pixel to its nearest color
    const currentPixel = new Uint8ClampedArray(nChannels);
    for (let i = 0; i < flattenedSourceData.length; i += nChannels) {
        // this for loop approach is faster than using Array.slice();
        for (let j = 0; j < nChannels; ++j) {
            currentPixel[j] = flattenedSourceData[i + j];
        }
        const nearestColorIndex = nearestNeighbor(currentPixel, colors);
        const nearestColor = centroids[nearestColorIndex];
        for (let j = 0; j < nearestColor.length; ++j) {
            flattenedQuantizedData[i + j] = nearestColor[j];
        }
    }

    const quantizedCanvas = document.createElement("canvas");
    quantizedCanvas.width = width;
    quantizedCanvas.height = height;
    const quantizedContext = quantizedCanvas.getContext("2d");

    if (!quantizedContext) {
        alert("quantizedContext is null (quantize)");
        return;
    }

    const image = quantizedContext.createImageData(width,height);
    image.data.set(flattenedQuantizedData);
    quantizedContext.putImageData(image,0,0);
    const dataUrl = quantizedCanvas.toDataURL();
    return dataUrl;
};













































