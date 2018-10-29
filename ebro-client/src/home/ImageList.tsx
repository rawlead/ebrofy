import * as React from 'react';
import {GridList, GridListTile} from "@material-ui/core";
import {ImageListItem} from "./";

interface ImageListProps {
    images: []
}

class ImageList extends React.Component<ImageListProps, any> {
    constructor(props: ImageListProps) {
        super(props);

    }

    render() {
        const {images} = this.props;


        const imageViews: any = [];

        images.forEach((image: any) => {
            imageViews.push(
                <GridListTile key={image.id} cols={1}>
                    <ImageListItem image={image}/>
                </GridListTile>
            )
        })

        return (
            <div>
                {/*<ImageListItem image={images[images.length - 1]}/>*/}
                <GridList cols={3}>
                    {imageViews}
                </GridList>
            </div>
        )
    }

}

// @ts-ignore
export default ImageList;
