import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import {getAllImages} from "../util/ApiUtils";
// @ts-ignore
import {withStyles} from "@material-ui/core/styles";
import {ImageForm} from "./";

interface HomeState {
    isLoading: boolean,
    images: any
}

const styles = (theme: any) => ({
    root: {
        // display: 'flex',
        // flexWrap: 'wrap',
        // justifyContent: 'space-around',
        // overflow: 'hidden',
        // backgroundColor: '#f2f2f2',
        // textAlign: 'center',
        // paddingTop: 50,
        // paddingBottom: 50
        // minHeight: '100vh'
    },
    gridList: {
        // height: 800,
        // maxHeight: '88vh',
    },
    paper: {
        // position: 'absolute',
        // width: theme.spacing.unit * 50,
        // backgroundColor: theme.palette.background.paper,
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing.unit * 4,
        // top: `50%`,
        // left: `50%`,
        // transform: `translate(-50%, -50%)`,
        textAlign: 'center',
        padding: 30,
        height: 'auto'
    },
    lastImageListItem: {
        // width: '100%'
    },
    gridContainer: {
        marginTop: 5
    }
});

class Home extends React.Component<any, HomeState> {
    constructor(props: any) {
        super(props);

        this.fetchAllImages = this.fetchAllImages.bind(this);
        this.state = {isLoading: false, images: undefined}
    }

    componentDidMount() {
        this.fetchAllImages();
    }

    fetchAllImages() {
        this.setState({isLoading: true});
        getAllImages()
            .then(response => {
                this.setState({images: response});
                this.setState({isLoading: false});
            }).catch(error => {
            this.setState({isLoading: false});
            alert("ERROR getting all images")
        })
    }

    render() {
        const {classes} = this.props;
        return (
            this.state.images ? (
                    <div className={classes.root}>
                            <ImageForm />
                    </div>
                )
                :
                <CircularProgress color="secondary"/>)


    }
}

// @ts-ignore
export default withStyles(styles)(Home);
