import * as React from 'react';
import {Paper, Tab, Tabs} from "@material-ui/core";

export default class Footer extends React.Component {
    render() {
        return (
            <Paper>
                <Tabs
                    value={0}
                    indicatorColor="primary"
                    textColor="primary"
                    centered={true}
                >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                </Tabs>
            </Paper>
        )
    }
}