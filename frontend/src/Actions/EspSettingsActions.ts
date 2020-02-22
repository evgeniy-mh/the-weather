import { ESPSettings } from "../Models";

export type ESP_SETTINGS_ACTION =
    'FETCH_ESP_SETTINGS_START'
    | 'FETCH_ESP_SETTINGS_FAIL'
    | 'FETCH_ESP_SETTINGS_SUCCESS';

export interface EspSettingsAction{
    type: ESP_SETTINGS_ACTION,
    payload: ESPSettings
}