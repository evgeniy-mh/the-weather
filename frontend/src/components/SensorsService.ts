import { fetchSensorInfoStart, fetchSensorInfoSuccess, SensorInfoAction } from "./Actions"

import { ThunkAction } from "redux-thunk";


export function fetchSensorInfo(): any {
    console.log('fetchSensorInfo():');
    return function (dispatch: any) {
        dispatch(fetchSensorInfoStart());

        const result: SensorInfo = {
            co2: 555,
            humidity: 777,
            temperature: 888,
        }

        setTimeout(() => {
            dispatch(fetchSensorInfoSuccess(result));
        }, 1000);
    }
}