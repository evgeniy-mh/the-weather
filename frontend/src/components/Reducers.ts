import { combineReducers } from 'redux'
import { ReduxAction } from "./Models";
import { FETCH_SENSOR_INFO_SUCCESS, FETCH_SENSOR_INFO_STARTED, FETCH_SENSOR_INFO_FAIL } from "./Actions";

export type FetchStatus = 'loading' | 'success' | 'fail';

export interface SensorsInfoState {
    fetchStatus?: FetchStatus;
    co2?: number,
    temperature?: number,
    humidity?: number,
}

function createEmptySensorsInfoState(): SensorsInfoState {
    return {
        co2: 0,
        humidity: 0,
        temperature: 0,
    }
}

function sensorsInfo(
    state: SensorsInfoState = createEmptySensorsInfoState(),
    action: ReduxAction
): SensorsInfoState {
    switch (action.type) {
        case FETCH_SENSOR_INFO_SUCCESS:
            return { ...action.payload };
        case FETCH_SENSOR_INFO_STARTED:
            return { fetchStatus: 'loading' }
        case FETCH_SENSOR_INFO_FAIL:
            return { fetchStatus: 'fail' }
        default:
            return state;
    }
}

export const AppReducers = combineReducers({
    sensorsInfo,
});