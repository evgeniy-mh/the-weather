import { SensorInfoAction } from './Actions';
import { SensorInfo, emptySensorsInfo } from './Models';

function sensorsInfoReducer(
    state: SensorInfo = emptySensorsInfo,
    action: SensorInfoAction
): SensorInfo {
    switch (action.type) {
        case 'FETCH_SENSOR_INFO_SUCCESS':
            return { ...action.payload };
        case 'FETCH_SENSOR_INFO_STARTED':
            return { ...emptySensorsInfo, fetchStatus: 'loading' }
        case 'FETCH_SENSOR_INFO_FAIL':
            return { ...emptySensorsInfo, fetchStatus: 'fail' }
        default:
            return state;
    }
}

export type AppState = Readonly<{
    sensors: SensorInfo;
}>

function createEmptyAppState(): AppState {
    return {
        sensors: emptySensorsInfo
    }
}

export function AppReducer(
    state: AppState = createEmptyAppState(),
    action: SensorInfoAction
): AppState {
    return {
        sensors: sensorsInfoReducer(state.sensors, action)
    }
}