import { Co2LogAction, SensorValuesAction, SettingsDrawerAction } from './Actions';
import { AppState, SensorsData, Co2ValueLogEntry } from './Models';

function settingsDrawerReducer(
    state: boolean,
    action: SettingsDrawerAction
): boolean {
    switch(action.type){
        case "OPEN_SETTINGS":
            return true;
        case "CLOSE_SETTINGS":
            return false;
        default: return state;
    }
}

function sensorsDataReducer(
    state: SensorsData,
    action: Co2LogAction | SensorValuesAction
): SensorsData {
    switch (action.type) {
        case 'FETCH_CO2_LOG_SUCCESS': {
            console.log(action);
            return {
                ...state,
                dataFetchStatus: 'success',
                co2ValuesLog: action.payload
            }
        }
        case 'NEW_SENSOR_VALUES': {
            const newEntry: Co2ValueLogEntry = {
                co2: action.payload.co2,
                time: action.payload.time
            }

            let newLog: Co2ValueLogEntry[] = [...state.co2ValuesLog, newEntry];

            const maxElementsCount = 200;
            if (newLog.length > maxElementsCount) {
                newLog = newLog.slice(newLog.length - maxElementsCount);
            }
            return {
                ...state,
                co2ValuesLog: newLog,
                humidity: action.payload.humidity,
                temperature: action.payload.temperature
            }
        }
        case 'FETCH_CO2_LOG_START':
            return { ...state, dataFetchStatus: 'loading' }
        case 'FETCH_CO2_LOG_FAIL':
            return { ...state, dataFetchStatus: 'fail' }
        default: return state;
    }
}

function createEmptyAppState(): AppState {
    return {
        settingsDrawerOpened: false,
        sensorsData: {
            co2ValuesLog: [],
            humidity: 0,
            temperature: 0,
            dataFetchStatus: 'loading'
        }
    }
}

export function AppReducer(
    state: AppState = createEmptyAppState(),
    action: any
): AppState {
    return {
        settingsDrawerOpened: settingsDrawerReducer(state.settingsDrawerOpened, action),
        sensorsData: sensorsDataReducer(state.sensorsData, action),
    }
}