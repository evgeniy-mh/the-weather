import { ESPSettingsState, EMPTY_ESP_SETTINGS, ESPSettings } from "../Models";

export type ESP_SETTINGS_ACTION =
    'FETCH_ESP_SETTINGS_START'
    | 'FETCH_ESP_SETTINGS_FAIL'
    | 'FETCH_ESP_SETTINGS_SUCCESS'
    | 'WRITE_SETTINGS_TO_ESP_START'
    | 'WRITE_SETTINGS_TO_ESP_FAIL'
    | 'WRITE_SETTINGS_TO_ESP_SUCCESS';

export interface EspSettingsAction {
    type: ESP_SETTINGS_ACTION,
    payload: ESPSettingsState
}

export function fetchEspSettingsStart(): EspSettingsAction {
    return {
        type: 'FETCH_ESP_SETTINGS_START',
        payload: {
            ...EMPTY_ESP_SETTINGS,
            dataFetchStatus: 'loading'
        }
    }
}

export function fetchEspSettingsSuccess(newSettings: ESPSettingsState): EspSettingsAction {
    return {
        type: 'FETCH_ESP_SETTINGS_SUCCESS',
        payload: { ...newSettings, dataFetchStatus: 'success' }
    }
}

export function fetchEspSettingsFail(): EspSettingsAction {
    return {
        type: 'FETCH_ESP_SETTINGS_FAIL',
        payload: {
            ...EMPTY_ESP_SETTINGS,
            dataFetchStatus: 'fail'
        }
    }
}

export function writeSettingsToESPStart(): EspSettingsAction {
    return {
        type: "WRITE_SETTINGS_TO_ESP_START",
        payload: {
            ...EMPTY_ESP_SETTINGS,
            dataFetchStatus: 'loading'
        }
    }
}

export function writeSettingsToESPFail(): EspSettingsAction {
    return {
        type: "WRITE_SETTINGS_TO_ESP_FAIL",
        payload: {
            ...EMPTY_ESP_SETTINGS,
            dataFetchStatus: 'fail'
        }
    }
}

export function writeSettingsToESPSuccess(newSettings: ESPSettings): EspSettingsAction {
    return {
        type: "WRITE_SETTINGS_TO_ESP_SUCCESS",
        payload: {
            ...newSettings,
            dataFetchStatus: 'success'
        }
    }
}