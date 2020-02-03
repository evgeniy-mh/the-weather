import * as React from "react";
import { connect } from 'react-redux'
import { connectViaWebSocket, fetchSensorFullLog } from "../../Services/SensorsService";
import { AppState } from "../../Reducers";
import { SensorsInfoEntry, Co2ChartData } from "../../Models";
import { SensorsLineChart } from "../SensorsLineChart/SensorsLineChart";
import { Co2Chart } from "../Charts/Co2Chart";

interface ComponentState {
    isDataLoaded: boolean;
    sensorValuesLog: SensorsInfoEntry[];
}

interface Dispatch {
    fetchSensorFullLog: () => void;
    connectViaWebSocket: () => void;
}

type Props = ComponentState & Dispatch;

const mapStateToProps = (state: AppState): ComponentState => ({
    isDataLoaded: state.sensorsLog.fetchStatus ? state.sensorsLog.fetchStatus === 'success' : false,
    sensorValuesLog: state.sensorsLog.log,
});

const mapDispatchToProps = (dispatch: any): Dispatch => ({
    fetchSensorFullLog: () => {
        dispatch(fetchSensorFullLog());
    },
    connectViaWebSocket: () => {
        dispatch(connectViaWebSocket());
    }
});

class App extends React.Component<Props> {

    componentDidMount() {
        this.props.fetchSensorFullLog();
        this.props.connectViaWebSocket();
    }

    render() {
        const { sensorValuesLog, isDataLoaded } = this.props;

        if (isDataLoaded) {
            // return <div>{JSON.stringify(sensorValuesLog)}</div>
            return (
                <>
                    <span>entries count: {sensorValuesLog.length}</span>
                    <Co2Chart data={this.convertToCo2ChartData(sensorValuesLog)} />
                </>
            );
        } else {
            return 'data is loading';
        }
    }

    convertToCo2ChartData(data: SensorsInfoEntry[]): Co2ChartData {
        return {
            values: data.map((e) => ({
                co2: e.co2,
                time: `${e.time.getHours()}:${e.time.getMinutes()}:${e.time.getSeconds()}`
            })),
        }
    }
}

export const AppConnected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)