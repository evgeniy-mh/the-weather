import * as React from "react";
import { connect } from 'react-redux'
import { fetchSensorInfo } from "../../Services/SensorsService";
import { AppState } from "../../Reducers";

interface ComponentState {
    isDataLoaded: boolean;
    co2: number;
    temperature: number;
    humidity: number;
}

interface Dispatch {
    fetchSensorInfo: () => void;
}

type Props = ComponentState & Dispatch;

const mapStateToProps = (state: AppState): ComponentState => ({
    isDataLoaded: state.sensors.fetchStatus ? state.sensors.fetchStatus === 'success' : false,
    co2: state.sensors.co2,
    temperature: state.sensors.temp,
    humidity: state.sensors.humid,
});

const mapDispatchToProps = (dispatch: any): Dispatch => ({
    fetchSensorInfo: () => {
        dispatch(fetchSensorInfo());
    }
});

class App extends React.Component<Props> {

    componentDidMount() {
        this.props.fetchSensorInfo();
    }

    render() {
        const { co2, humidity, temperature, isDataLoaded } = this.props;

        if (isDataLoaded) {
            return (
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>CO2</td>
                            <td>{co2}</td>
                        </tr>
                        <tr>
                            <td>Temperature</td>
                            <td>{temperature}</td>
                        </tr>
                        <tr>
                            <td>Humidity</td>
                            <td>{humidity}</td>
                        </tr>
                    </tbody>
                </table>
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