import * as React from 'react';
import {Modal} from "@material-ui/core";

interface ImageModalProps {
    open:any,
    onClose:any,
    image:any
}

class ImageModal extends React.Component<ImageModalProps, any> {
    constructor(props: ImageModalProps) {
        super(props);

    }

    render() {
        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.props.onClose}

                >
                    <div>
                        <img src={this.props.image.fileDownloadUri} alt=""/>
                    </div>
                </Modal>
            </div>
        )

    }

}

// We need an intermediary variable for handling the recursive nesting.
// @ts-ignore
export default ImageModal;


