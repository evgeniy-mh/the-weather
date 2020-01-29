import { SensorInfoAction } from './Actions';

function createEmptySensorsInfoState(): SensorInfo {
    return {}
}

function sensorsInfoReducer(
    state: SensorInfo = createEmptySensorsInfoState(),
    action: SensorInfoAction
): SensorInfo {
    switch (action.type) {
        case 'FETCH_SENSOR_INFO_SUCCESS':
            return { ...action.payload };
        case 'FETCH_SENSOR_INFO_STARTED':
            return { ...createEmptySensorsInfoState(), fetchStatus: 'loading' }
        case 'FETCH_SENSOR_INFO_FAIL':
            return { ...createEmptySensorsInfoState(), fetchStatus: 'fail' }
        default:
            return state;
    }
}

interface AppState {
    sensors: SensorInfo;
}

function createEmptyAppState(): AppState {
    return {
        sensors: createEmptySensorsInfoState()
    }
}

export function AppReducer(state: AppState = createEmptyAppState(), action: SensorInfoAction) {
    return {
        sensors: sensorsInfoReducer(state.sensors, action)
    }
}