import { Co2ValueLogEntry } from "../Models";

export type CO2_LOG_ACTION =
    'FETCH_CO2_LOG_START'
    | 'FETCH_CO2_LOG_FAIL'
    | 'FETCH_CO2_LOG_SUCCESS';

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