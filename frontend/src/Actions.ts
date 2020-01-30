import { SensorInfo, emptySensorsInfo } from "./Models";

export type SENSOR_INFO_ACTION =
    'FETCH_SENSOR_INFO_STARTED'
    | 'FETCH_SENSOR_INFO_SUCCESS'
    | 'FETCH_SENSOR_INFO_FAIL';

export interface SensorInfoAction {
    type: SENSOR_INFO_ACTION,
    payload: SensorInfo,
}

export function fetchSensorInfoStart(): SensorInfoAction {
    return {
        type: 'FETCH_SENSOR_INFO_STARTED',
        payload: {
            ...emptySensorsInfo,
            fetchStatus: 'loading'
        }
    }
}

export function fetchSensorInfoFail(): SensorInfoAction {
    return {
        type: 'FETCH_SENSOR_INFO_FAIL',
        payload: {
            ...emptySensorsInfo,
            fetchStatus: 'fail'
        }
    }
}

export function fetchSensorInfoSuccess(payload: SensorInfo): SensorInfoAction {
    return {
        type: 'FETCH_SENSOR_INFO_SUCCESS',
        payload: {...payload, fetchStatus: 'success'}
    }
}