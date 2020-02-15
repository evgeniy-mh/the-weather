import * as React from "react";
import { useEffect } from "react";
import { connect } from 'react-redux'
import { connectViaWebSocket, fetchSensorFullLog } from "../../Services/SensorsService";
import { Co2Chart } from "../CO2Chart/Co2Chart";
import { SensorsData, AppState } from "../../Models";
import { ValueCircle } from "../ValueCircle/ValueCircle";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import './AppTest.css';

interface ComponentState {
    isDataLoaded: boolean;
    sensorsData: SensorsData
}

interface Dispatch {
    fetchSensorFullLog: () => void;
    connectViaWebSocket: () => void;
}

type Props = ComponentState & Dispatch;

const mapStateToProps = (state: AppState): ComponentState => ({
    isDataLoaded: state.sensorsData.dataFetchStatus
        ? state.sensorsData.dataFetchStatus === 'success'
        : false,
    sensorsData: state.sensorsData,
});

const mapDispatchToProps = (dispatch: any): Dispatch => ({
    fetchSensorFullLog: () => {
        dispatch(fetchSensorFullLog());
    },
    connectViaWebSocket: () => {
        dispatch(connectViaWebSocket());
    }
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            elevation: 3,
        },
    }),
);

const AppTest = ({ fetchSensorFullLog, connectViaWebSocket, sensorsData }: Props) => {
    const classes = useStyles();

    useEffect(() => {
        // code to run on component mount
        fetchSensorFullLog();
        connectViaWebSocket();
    }, [])

    return (
        <div className={classes.root}>
            <Grid container spacing={3} alignContent='center'>
                <Grid item xs={12}>
                    <h4>entries count: {sensorsData.co2ValuesLog.length}</h4>
                    <Co2Chart data={sensorsData.co2ValuesLog} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ValueCircle
                        header={'Temperature'}
                        value={sensorsData.temperature}
                        valueUnit={'C°'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ValueCircle
                        header={'Humidity'}
                        value={sensorsData.humidity}
                        valueUnit={'%'}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export const AppTestConnected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppTest)