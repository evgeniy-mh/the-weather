import { SensorInfoAction } from './Actions';
import { SersorsInfoLog, emptySensorsInfoLog, sortLogByAscendingTime } from './Models';

function sensorsInfoReducer(
    state: SersorsInfoLog = emptySensorsInfoLog,
    action: SensorInfoAction
): SersorsInfoLog {
    switch (action.type) {
        case 'FETCH_SENSOR_INFO_SUCCESS':
            let resultLogArray = action.payload;
            if (resultLogArray.length > 1) {
                resultLogArray = sortLogByAscendingTime(resultLogArray);
            }
            return {
                fetchStatus: 'success',
                log: [...state.log, ...resultLogArray]
            };
        case 'FETCH_SENSOR_INFO_STARTED':
            return {
                log: state.log, fetchStatus: 'loading'
            }
        case 'FETCH_SENSOR_INFO_FAIL':
            return {
                log: state.log, fetchStatus: 'fail'
            }
        default:
            return state;
    }
}

export type AppState = Readonly<{
    sensorsLog: SersorsInfoLog;
}>

function createEmptyAppState(): AppState {
    return {
        sensorsLog: emptySensorsInfoLog
    }
}

export function AppReducer(
    state: AppState = createEmptyAppState(),
    action: SensorInfoAction
): AppState {
    return {
        sensorsLog: sensorsInfoReducer(state.sensorsLog, action)
    }
}