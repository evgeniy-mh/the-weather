import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FilterVintage from '@material-ui/icons/FilterVintage';
import Settings from '@material-ui/icons/Settings';
import SvgIcon from '@material-ui/core/SvgIcon';

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

    return (
        <AppBar position="static">
            <Toolbar>
                <SvgIcon className={classes.menuButton} color="inherit">
                    <FilterVintage />
                </SvgIcon>
                <Typography variant="h5" className={classes.title}>
                    The Weather
                </Typography>
                <Button color="inherit">
                    <SvgIcon className={classes.menuButton} color="inherit">
                        <Settings />
                    </SvgIcon>
                    Settings
                    </Button>
            </Toolbar>
        </AppBar>
    );
}
