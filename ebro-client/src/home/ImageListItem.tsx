import * as React from 'react';
import ImageModal from "./ImageModal";

interface ImageProps {
    image: any,
}

interface ImageState {
    modalIsOpen: boolean,
}

class ImageListItem extends React.Component<ImageProps, ImageState> {
    constructor(props: ImageProps) {
        super(props);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.state = {modalIsOpen: false}
    }

    handleModalOpen() {
        this.setState({modalIsOpen: true})
    }

    handleModalClose() {
        this.setState({modalIsOpen: false})
    }

    render() {
        return (
            <React.Fragment>
                <img src={this.props.image.fileDownloadUri} alt={this.props.image.fileName}
                     onClick={this.handleModalOpen}/>
                <ImageModal onClose={this.handleModalClose} image={this.props.image} open={this.state.modalIsOpen}/>
            </React.Fragment>
        )
    }
}
// @ts-ignore
export default ImageListItem;
