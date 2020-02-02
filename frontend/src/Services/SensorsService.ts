// import { ThunkAction } from "redux-thunk";
// import fetch from 'cross-fetch'

import { fetchSensorInfoStart, fetchSensorInfoSuccess, fetchSensorInfoFail } from "../Actions"
import { getServerURL } from "..";

export function connectViaWebSocket(): any {
    return async function (dispatch: any) {
        let socket = new WebSocket("ws://192.168.0.100/ws");

        socket.onmessage = function (event) {
            console.log(event.data);

            const jsonObj = JSON.parse(event.data);

            dispatch(fetchSensorInfoSuccess({
                co2: jsonObj.co2,
                temp: jsonObj.temp,
                humid: jsonObj.humid,
                time: jsonObj.time,
            }))
        };
    }
}

// export function fetchSensorInfo(): any {
//     return async function (dispatch: any) {
//         dispatch(fetchSensorInfoStart());

//         const res = await fetch(`${getServerURL()}/info`,
//             {
//                 method: 'GET',
//                 headers: {
//                     "Accept": "application/json, text/javascript, */*; q=0.01",
//                     "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//                     "Content-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//                     "Content-Type": "text/plain",
//                 }
//             }
//         );


//         if (!res.ok) {
//             console.log(res.statusText);
//             dispatch(fetchSensorInfoFail());
//         }

//         const jsonObj = await res.json();

//         dispatch(fetchSensorInfoSuccess({
//             co2: jsonObj.co2,
//             temp: jsonObj.temp,
//             humid: jsonObj.humid,
//             pressure: jsonObj.pressure,
//             alt: jsonObj.alt,
//         }))
//     }
// }