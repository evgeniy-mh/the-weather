import { Co2ValueLogEntry, SensorValues } from "./Models";

// For getting co2 log
export type CO2_LOG_ACTION =
    'FETCH_CO2_LOG_START'
    | 'FETCH_CO2_LOG_FAIL'
    | 'FETCH_CO2_LOG_SUCCESS'

// For getting sensor values from web socket connection
export type SENSOR_VALUES_ACTION = 'NEW_SENSOR_VALUES'

export type SETTINGS_DRAWER_ACTION = 'OPEN_SETTINGS' | 'CLOSE_SETTINGS'

export interface Co2LogAction {
    type: CO2_LOG_ACTION,
    payload: Co2ValueLogEntry[]
}

export function fetchCo2LogStart(): Co2LogAction {
    return {
        type: 'FETCH_CO2_LOG_START',
        payload: []
    }
}

export function fetchCo2LogFail(): Co2LogAction {
    return {
        type: 'FETCH_CO2_LOG_FAIL',
        payload: []
    }
}

export function fetchCo2LogSuccess(log: Co2ValueLogEntry[]): Co2LogAction {
    return {
        type: 'FETCH_CO2_LOG_SUCCESS',
        payload: log,
    }
}

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

export interface SettingsDrawerAction {
    type: SETTINGS_DRAWER_ACTION
}

export function openSettingsDrawer(): SettingsDrawerAction {
    return {
        type: 'OPEN_SETTINGS'
    }
}

export function closeSettingsDrawer(): SettingsDrawerAction {
    return {
        type: 'CLOSE_SETTINGS'
    }
}