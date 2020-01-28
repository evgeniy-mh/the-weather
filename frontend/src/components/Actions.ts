import { ReduxAction } from "./Models";
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { FetchStatus } from "./Reducers";

export const FETCH_SENSOR_INFO_STARTED = 'FETCH_SENSOR_INFO_STARTED';
export const FETCH_SENSOR_INFO_SUCCESS = 'FETCH_SENSOR_INFO_SUCCESS';
export const FETCH_SENSOR_INFO_FAIL = 'FETCH_SENSOR_INFO_FAIL';

export function fetchSensorInfoStarted(): Partial<ReduxAction> {
    return {
        type: FETCH_SENSOR_INFO_STARTED
    }
}

export function fetchSensorInfoSuccess(payload: any): ReduxAction {
    const fetchStatus: FetchStatus='success';
    return {
        type: FETCH_SENSOR_INFO_SUCCESS,
        payload:{
            ...payload,
            fetchStatus
        }
    }
}

// export function fetchSensorInfo(payload: any): ReduxAction {
//     return {
//         type: FETCH_SENSOR_INFO,
//         payload
//     }
// }

export function fetchSensorInfo() {
    return (dispatch: any) => {
        dispatch(fetchSensorInfoStarted());


        dispatch(fetchSensorInfoSuccess({
            co2: 555,
            temperature: 777,
            humidity: 888,
        }))
    };
};