import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../Models';
import { Drawer } from '@material-ui/core';
import { closeSettingsDrawer } from '../../Actions';

export const SettingsDrawer = () => {
    const isOpened = useSelector((state: AppState) => state.settingsDrawerOpened);

    const dispatch = useDispatch();
    const closeSettings = React.useCallback(
        () => dispatch(closeSettingsDrawer()),
        [dispatch]
    );

    return (
        <Drawer anchor="right" open={isOpened} onClose={closeSettings}>
            <div>hi there</div>
        </Drawer>
    );
}