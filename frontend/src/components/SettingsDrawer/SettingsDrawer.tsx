import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../Models';
import { Drawer, List, ListItem, Slider, makeStyles } from '@material-ui/core';
import { closeSettingsDrawer } from '../../Actions';

import "./SettingsDrawer.css"

export const SettingsDrawer = () => {
    const isOpened = useSelector((state: AppState) => state.settingsDrawerOpened);

    const dispatch = useDispatch();
    const closeSettings = React.useCallback(
        () => dispatch(closeSettingsDrawer()),
        [dispatch]
    );

    const useStyles = makeStyles({
        drawerPaper: {
            width: '30%',
            minWidth: '150px'
        },
    });

    const classes = useStyles();

    return (
        <Drawer
            anchor="right"
            open={isOpened}
            onClose={closeSettings}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className='settings-container'>
                <List>
                    <ListItem>
                        <Slider
                            value={50}
                            // onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            max={100}
                            min={0}
                        />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}