import { ESPSettings } from "../Models";

export type ESP_SETTINGS_ACTION =
    'FETCH_ESP_SETTINGS_START'
    | 'FETCH_ESP_SETTINGS_FAIL'
    | 'FETCH_ESP_SETTINGS_SUCCESS';

export interface EspSettingsAction {
    type: ESP_SETTINGS_ACTION,
    payload: ESPSettings
}

export function fetchEspSettingsStart(): EspSettingsAction {
    return {
        type: 'FETCH_ESP_SETTINGS_START',
        payload: {
            dataFetchStatus: 'loading',
            logEntriesCount: 0,
            logMsInterval: 0
        }
    }
}

export function fetchEspSettingsSuccess(newSettings: ESPSettings): EspSettingsAction {
    return {
        type: 'FETCH_ESP_SETTINGS_SUCCESS',
        payload: { ...newSettings, dataFetchStatus: 'success' }
    }
}

export function fetchEspSettingsFail(): EspSettingsAction {
    return {
        type: 'FETCH_ESP_SETTINGS_FAIL',
        payload: {
            dataFetchStatus: 'fail',
            logEntriesCount: 0,
            logMsInterval: 0
        }
    }
}