// import { ThunkAction } from "redux-thunk";
import fetch from 'cross-fetch'

import { fetchSensorInfoStart, fetchSensorInfoSuccess, SensorInfoAction, fetchSensorInfoFail } from "./Actions"


export function fetchSensorInfo(): any {
    console.log('fetchSensorInfo():');
    return async function (dispatch: any) {
        dispatch(fetchSensorInfoStart());

        const res = await fetch('/info',
            {
                method: 'GET'
            }
        );

        if (!res.ok) {
            console.log(res.statusText);
            dispatch(fetchSensorInfoFail());
        }

        const jsonObj = await res.json();

        dispatch(fetchSensorInfoSuccess({
            co2: jsonObj.co2,
            temperature: jsonObj.temp,
            humidity: jsonObj.humid,
            pressure: jsonObj.pressure,
            altitude: jsonObj.alt,
        }))
    }
}