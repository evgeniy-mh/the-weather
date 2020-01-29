import * as React from "react";
import { connect } from 'react-redux'
import { fetchSensorInfo } from "./SensorsService";

interface State {
    co2: number;
    temperature: number;
    humidity: number;
}

interface Dispatch {
    fetchSensorInfo: () => void;
}

type Props = State & Dispatch;

const mapStateToProps = (state: any): State => {
    console.log(state);
    return {
        co2: state.sensorsInfo.co2,
        temperature: state.sensorsInfo.temperature,
        humidity: state.sensorsInfo.humidity,
    }
}

const mapDispatchToProps = (dispatch: any): Dispatch => {
    return {
        fetchSensorInfo: () => {
            dispatch(fetchSensorInfo());
        }
    };
};

class App extends React.Component<Props> {

    componentDidMount() {
        this.props.fetchSensorInfo();
    }

    render() {
        const { co2, humidity, temperature } = this.props;
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
    }
}

export const AppConnected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)