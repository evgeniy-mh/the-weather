import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppState, ESPSettings } from '../../Models';
import Drawer from '@material-ui/core/Drawer/Drawer';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

import "./SettingsDrawer.css"
import { LogDurationSelector } from '../LogDurationSelector/LogDurationSelector';
import { closeSettingsDrawer } from '../../Actions/SettingsDrawerActions';
import { fetchEspSettings } from '../../Services/EspSettingsService';

export function SettingsDrawer() {
    const isOpened: boolean = useSelector((state: AppState) => state.settingsDrawerOpened);
    const logDurationHourInitial: number = useSelector((state: AppState) =>
        state.espSettings.logDuration ? state.espSettings.logDuration.hours : 0
    )

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(fetchEspSettings())
    }, [])

    const closeSettings = React.useCallback(
        () => dispatch(closeSettingsDrawer()),
        [dispatch]
    );

    const [newLogDurationHour, setNewLogDurationHour] = React.useState<number>(0);

    React.useEffect(() => {
        setNewLogDurationHour(logDurationHourInitial);
    }, [logDurationHourInitial]);

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
                        <LogDurationSelector
                            timeDurationHourValue={newLogDurationHour}
                            onChange={value => { setNewLogDurationHour(value) }}
                        />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}