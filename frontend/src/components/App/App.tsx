import * as React from "react";
import { connect } from 'react-redux'
import { connectViaWebSocket, fetchSensorFullLog } from "../../Services/SensorsService";
import { Co2Chart } from "../Charts/Co2Chart";
import { SensorsData, AppState } from "../../Models";
import { ValueCircle } from "../Charts/ValueCircle";

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

class App extends React.Component<Props> {

    componentDidMount() {
        this.props.fetchSensorFullLog();
        this.props.connectViaWebSocket();
    }

    render() {
        const { sensorsData, isDataLoaded } = this.props;
        const { co2ValuesLog, humidity, temperature } = sensorsData;

        if (isDataLoaded) {
            return (
                <>
                    <h4>entries count: {co2ValuesLog.length}</h4>
                    <h4>temperature: {temperature}</h4>
                    <h4>humidity: {humidity}</h4>
                    <Co2Chart data={co2ValuesLog} />
                    <ValueCircle header={'Temperature'} value={temperature} valueUnit={'C°'} />
                    <ValueCircle header={'Humidity'} value={humidity} valueUnit={'%'} />
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