import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../Models';
import Drawer from '@material-ui/core/Drawer/Drawer';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

import "./SettingsDrawer.css"
import { LogDurationSelector } from '../LogDurationSelector/LogDurationSelector';
import { closeSettingsDrawer } from '../../Actions/SettingsDrawerActions';
import { fetchEspSettings, writeEspSettings } from '../../Services/EspSettingsService';
import Button from '@material-ui/core/Button/Button';
import SaveIcon from '@material-ui/icons/Save';

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

    const writeSettingsToESP = React.useCallback(
        () => dispatch(writeEspSettings({
            logEntriesCount: 100,
            logMsInterval: 10000
        })),
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

                {bottomButtons()}
            </div>
        </Drawer>
    );

    function bottomButtons(): React.ReactNode {
        return (
            <div className='bottom-buttons'>
                <Button
                    variant="contained"
                    color="default"
                >
                    Cancel
            </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={writeSettingsToESP}
                >
                    Save
          </Button>
            </div>
        );
    };
}