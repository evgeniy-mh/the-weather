import { SensorValues } from "../Models";

// For getting sensor values from web socket connection
export type SENSOR_VALUES_ACTION = 'NEW_SENSOR_VALUES'

export interface SensorValuesAction {
    type: SENSOR_VALUES_ACTION,
    payload: SensorValues;
}

export function fetchNewSensorValues(values: SensorValues): SensorValuesAction {
    return {
        type: 'NEW_SENSOR_VALUES',
        payload: values
    }
}