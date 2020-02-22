import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FilterVintage from '@material-ui/icons/FilterVintage';
import Settings from '@material-ui/icons/Settings';
import SvgIcon from '@material-ui/core/SvgIcon';
import { useDispatch } from 'react-redux';
import { openSettingsDrawer } from '../../Actions/SettingsDrawerActions';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBarRoot: {
            flexGrow: 1,
            alignItems: 'center'
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export default function WeatherAppBar() {
    const classes = useStyles();

    const dispatch = useDispatch();
    const openSettings = React.useCallback(
        () => dispatch(openSettingsDrawer()),
        [dispatch]
    )

    const settingsIcon = (
        <SvgIcon className={classes.menuButton} color="inherit">
            <Settings />
        </SvgIcon>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <SvgIcon className={classes.menuButton} color="inherit">
                    <FilterVintage />
                </SvgIcon>
                <Typography variant="h5" className={classes.title}>
                    The Weather
                </Typography>
                <Button color="inherit" onClick={openSettings} startIcon={settingsIcon}>
                    Settings
                </Button>
            </Toolbar>
        </AppBar>
    );
}
