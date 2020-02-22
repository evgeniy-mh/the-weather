import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppState, ESPSettings } from '../../Models';
import { closeSettingsDrawer } from '../../Actions';
import { LogIntervalSelector } from '../LogIntervalSelector/LogIntervalSelector';
import Drawer from '@material-ui/core/Drawer/Drawer';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

import "./SettingsDrawer.css"

export function SettingsDrawer() {
    const isOpened: boolean = useSelector((state: AppState) => state.settingsDrawerOpened);
    const espSettings: ESPSettings = useSelector((state: AppState) => state.espSettings);

    const dispatch = useDispatch();
    const closeSettings = React.useCallback(
        () => dispatch(closeSettingsDrawer()),
        [dispatch]
    );

    // const [espLogInterval, setEspLogInterval] = React.useState<number>(espSettings.logInterval);
    const [espLogInterval, setEspLogInterval] = React.useState<number>(7000);

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
                        <LogIntervalSelector
                            initialTimeValueMs={espLogInterval}
                            // logEntriesCount={espSettings.maxStoredLogEntries}
                            logEntriesCount={200}
                            onChange={(value) => { setEspLogInterval(value) }}
                        />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}