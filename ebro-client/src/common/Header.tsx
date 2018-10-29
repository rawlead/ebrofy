import * as React from 'react';
import {AppBar, Button, IconButton, Toolbar, Typography} from "@material-ui/core";

export default class Header extends React.Component {
    render() {

        const styles = {
            root: {
                flexGrow: 1,
            },
            flex: {
                flexGrow: 1,
            },
            menuButton: {
                marginLeft: -12,
                marginRight: 20,
            },
        };


        return (
            <AppBar position="static" className="appBar">
                <Toolbar>
                    <IconButton style={styles.menuButton} color="inherit" aria-label="Menu">
                        {/*<MenuSharp />*/}
                    </IconButton>
                    <Typography variant="title" color="inherit" style={styles.flex}>
                        Ebrofy
                    </Typography>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">Convert</Button>
                    <Button color="inherit">Help</Button>
                </Toolbar>
            </AppBar>
        )
    }
}
