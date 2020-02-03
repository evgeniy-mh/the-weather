import { SensorsRawInfoEntry, emptySensorsInfoLog, SensorsInfoEntry } from "./Models";

export type SENSOR_INFO_ACTION =
    'FETCH_SENSOR_INFO_STARTED'
    | 'FETCH_SENSOR_INFO_SUCCESS'
    | 'FETCH_SENSOR_INFO_FAIL';

export interface SensorInfoAction {
    type: SENSOR_INFO_ACTION,
    payload: SensorsInfoEntry[],
}

export function fetchSensorInfoStart(): SensorInfoAction {
    return {
        type: 'FETCH_SENSOR_INFO_STARTED',
        payload: emptySensorsInfoLog.log
    }
}

export function fetchSensorInfoFail(): SensorInfoAction {
    return {
        type: 'FETCH_SENSOR_INFO_FAIL',
        payload: emptySensorsInfoLog.log,
    }
}

export function fetchSensorInfoSuccess(payload: SensorsInfoEntry[]): SensorInfoAction {
    return {
        type: 'FETCH_SENSOR_INFO_SUCCESS',
        payload: payload
    }
}