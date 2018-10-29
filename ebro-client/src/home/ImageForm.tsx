import * as React from 'react';
import './ImageForm.css';
import {
    Button,
    CircularProgress, FormControl,
    FormHelperText,
    Grid,
    Input, InputLabel,
    MenuItem,
    Paper,
    Select,
} from "@material-ui/core";
import {filePixelate, uploadSingleFile} from "../util/ApiUtils";
import {getPixelDataset, kMeans, quantize} from "../util/KMeans";
import {
    COLORS_INTERVAL,
    DEFAULT_NUM_OF_COLORS,
    DEFAULT_PIXEL_SIZE, MAX_COLORS,
    MAX_K_MEANS_PIXELS,
    MAX_PIXEL_SIZE,
    PIXEL_SIZE_INTERVAL
} from "../constants";


interface ImageFormState {
    isLoading: boolean,

    [inputName: string]: any,

    submittedFile: any,
    pixelatedFile: any,

    fileInput: any,
    pixelatedAndQuanitizedFile: any,
}

interface ImageFormProps {
    // fetchAllImages: any,
}

class ImageForm extends React.Component<ImageFormProps, ImageFormState> {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFilePixelation = this.handleFilePixelation.bind(this);
        this.handleFileQuanitization = this.handleFileQuanitization.bind(this);
        this.pixelateFile = this.pixelateFile.bind(this);
        this.quanitizeFile = this.quanitizeFile.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createMenuItemsPS = this.createMenuItemsPS.bind(this);
        this.createMenuItemsColors = this.createMenuItemsColors.bind(this);

        this.state = {
            isLoading: false,

            fileInput: undefined,

            submittedFile: undefined,

            pixelatedAndQuanitizedFile: {
                value: '',
                name: ''
            },

            pixelSize: {
                value: DEFAULT_PIXEL_SIZE,
                validateStatus: '',
                validateMsg: null
            },
            numOfColors: {
                value: DEFAULT_NUM_OF_COLORS,
                validateStatus: '',
                validateMsg: null
            },
            pixelatedFile: undefined,

            imagePreviewUrl: undefined
        }
    }


    handleFilePixelation() {
        const {submittedFile, pixelSize, numOfColors} = this.state;

        if (!submittedFile || pixelSize.value === 0) {
            return;
        }
        this.setState({isLoading: true});

        this.pixelateFile(submittedFile.fileName, pixelSize, (pixelatedFile: any) => {
            this.quanitizeFile(pixelatedFile.fileDownloadUri, submittedFile.fileName, numOfColors)
        });

    }

    handleFileQuanitization() {
        const {submittedFile, pixelatedFile, numOfColors} = this.state;
        this.quanitizeFile(pixelatedFile.fileDownloadUri, submittedFile.fileName, numOfColors)
    }

    pixelateFile(fileName: any, pixelSize: any, callback: any) {
        const pielateRequest = {
            fileName,
            pixelSize: pixelSize.value
        };

        // this.setState({isLoading:true});

        // fetch(dataUrl)
        //     .then(res => res.blob())
        //     .then(blob => {
        //         const fileInput = new File([blob], fileName);

        filePixelate(pielateRequest)
            .then(response => {
                this.setState({
                    pixelatedFile: response,
                });
                callback(response);
            }).catch(error => {
            alert("ERROR" + error.message);
        })
    }

    quanitizeFile(fileDownloadUri: any, fileName: any, numOfColors: any) {
        const reader = new FileReader();

        this.setState({isLoading: true})

        reader.addEventListener("load", () => {
            const img: any = new Image();
            img.onload = () => {
                // Use a combination of requestAnimationFrame and setTimeout
                // to run quantize/post_quantize after the next repaint, which is
                // triggered by pre_quantize().
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        // Use a fixed maximum so that k-means works fast.
                        const pixelDataset = getPixelDataset(img, MAX_K_MEANS_PIXELS);
                        const centroids = kMeans(pixelDataset, numOfColors.value);
                        const quanitizeDataUrl = quantize(img, centroids);
                        // @ts-ignore
                        this.setState({imagePreviewUrl: quanitizeDataUrl, isLoading: false})
                    }, 0);
                });
            };
            img.src = reader.result;
        });
        fetch(fileDownloadUri)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], fileName);
                reader.readAsDataURL(file);
            })
    }

    handleInputChange(event: any) {
        const target = event.target;
        this.setState({
            [target.name]: {
                value: target.value
            }
        }, () => {
            switch (target.name) {
                case "pixelSize":
                    this.handleFilePixelation();
                    break;
                case "numOfColors":
                    this.handleFileQuanitization();
                    break;
            }
        })
    }

    handleSubmit(event: any) {
        const file = event.target.files[0];
        this.setState({
            fileInput: file,
            isLoading: true,
            pixelatedFile: undefined
        }, () => {
            const formData = new FormData();
            formData.append("file", file);
            this.setState({isLoading: true});
            uploadSingleFile(formData)
                .then(response => {
                    this.setState({
                        isLoading: false,
                        submittedFile: response,
                        imagePreviewUrl: URL.createObjectURL(file)
                    });
                    this.handleFilePixelation();
                }).catch(error => {
                alert(error);
                this.setState({isLoading: false})
            })
        });
    }

    createMenuItemsPS = () => {
        const menuItems = [];
        const {submittedFile} = this.state;
        if (!submittedFile) {
            return;
        }
        for (let i = PIXEL_SIZE_INTERVAL + 1; i <= MAX_PIXEL_SIZE; i += PIXEL_SIZE_INTERVAL) {
            menuItems.push(
                <MenuItem
                    value={i}>{Math.ceil(submittedFile.width / i) + 1}x{Math.ceil(submittedFile.height / i) + 1} (pixel: {i})
                </MenuItem>
            )
        }
        return menuItems;
    };

    createMenuItemsColors = () => {
        const menuItems = [];
        for (let i = COLORS_INTERVAL; i <= MAX_COLORS; i += COLORS_INTERVAL) {
            menuItems.push(
                <MenuItem value={i}>{i}</MenuItem>
            )
        }
        return menuItems;
    };

    render() {
        const {isLoading, imagePreviewUrl, pixelSize, numOfColors, submittedFile} = this.state;

        return (
            <Grid container={true} className="image-form__section" justify={"center"} spacing={24}>
                <Grid item={true} xs={12} md={6} alignContent={"center"}>
                    <h1>Preview</h1>

                    <Paper elevation={3}>
                        <img src={imagePreviewUrl} className="image-form__preview__img"/>
                    </Paper>

                    {this.state.pixelatedAndQuanitizedFile.value &&
                    <img src={URL.createObjectURL(this.state.pixelatedAndQuanitizedFile.value)}/>
                    }
                </Grid>

                <Grid item={true} xs={12} md={3}>
                    <h1>Properties</h1>

                    <input
                        style={{display: 'none'}}
                        accept="image/*"
                        id="contained-button-file"
                        multiple={true}
                        type="file"
                        name="file"
                        onChange={this.handleSubmit}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" component="span" disabled={isLoading}>
                            Choose a file
                        </Button>
                    </label>
                    <br/>
                    <br/>

                    {/*{pixelatedFile && <p>Width: {pixelatedFile.width}, Height: {pixelatedFile.height}</p>}*/}

                    <FormControl disabled={isLoading || !submittedFile}>
                        <InputLabel htmlFor="pixel-size-helper">Size</InputLabel>
                        <Select
                            value={pixelSize.value}
                            onChange={this.handleInputChange}
                            input={<Input name="pixelSize" id="pixel-size-helper"/>}
                        >
                            {this.createMenuItemsPS()}
                        </Select>
                        <FormHelperText>Some important helper text</FormHelperText>
                    </FormControl>

                    <br/>
                    <br/>

                    <FormControl disabled={isLoading || !submittedFile}>
                        <InputLabel htmlFor="num-of-colors-helper">Colors</InputLabel>
                        <Select
                            value={numOfColors.value}
                            onChange={this.handleInputChange}
                            input={<Input name="numOfColors" id="num-of-colors-helper"/>}
                        >
                            {this.createMenuItemsColors()}
                        </Select>
                        <FormHelperText>Some important helper text</FormHelperText>
                    </FormControl>
                    <br/>
                    <br/>
                    <Button variant="outlined" color="primary" disabled={isLoading || !submittedFile}>
                        Download
                    </Button>
                    <br/>
                    <br/>
                    {isLoading && <CircularProgress color="secondary"/>}
                </Grid>
            </Grid>
        )
    }
}

// @ts-ignore
export default ImageForm;
