import * as React from "react";
import { connect } from 'react-redux'
import { connectViaWebSocket, fetchSensorFullLog } from "../../Services/SensorsService";
import { AppState } from "../../Reducers";
import { SensorsInfoEntry } from "../../Models";
import { SensorsLineChart } from "../SensorsLineChart/SensorsLineChart";

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
                    <SensorsLineChart data={sensorValuesLog} />
                </>
            );
        } else {
            return 'data is loading';
        }
    }
}

export const AppConnected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)