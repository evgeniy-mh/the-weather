// import { ThunkAction } from "redux-thunk";
// import fetch from 'cross-fetch'

import { fetchSensorInfoStart, fetchSensorInfoSuccess, fetchSensorInfoFail } from "./Actions"
import { getServerURL } from "..";

export function fetchSensorInfo(): any {
    console.log('fetchSensorInfo():');
    return async function (dispatch: any) {
        dispatch(fetchSensorInfoStart());

        const res = await fetch(`${getServerURL()}/info`,
            {
                method: 'GET',
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Type": "text/plain",
                }
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