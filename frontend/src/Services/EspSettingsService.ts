import * as queryString from 'query-string';

import { fetchEspSettingsStart, fetchEspSettingsFail, fetchEspSettingsSuccess, writeSettingsToESPStart, writeSettingsToESPFail, writeSettingsToESPSuccess } from "../Actions/EspSettingsActions";
import { ESPSettingsState, LogDuration, ESPSettings } from "../Models";

const settingsUrl = 'http://192.168.0.100/settings'

export function fetchEspSettings(): any {
    return async function (dispatch: any) {
        dispatch(fetchEspSettingsStart());

        const result = await fetch(settingsUrl,
            {
                method: 'GET',
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Type": "text/plain",
                }
            }
        );

        if (result.ok) {
            const espSettings: ESPSettingsState = await result.json();
            const logDuration = calculateLogDuration(
                espSettings.logEntriesCount,
                espSettings.logMsInterval
            );
            espSettings.logDuration = logDuration;
            dispatch(fetchEspSettingsSuccess(espSettings))
        } else {
            dispatch(fetchEspSettingsFail())
        }
    }
}

export function writeEspSettings(newSettings: ESPSettings): any {
    return async function (dispatch: any) {
        dispatch(writeSettingsToESPStart());

        // TODO create type
        const dataToSend: any = {
            setLogMsInterval: newSettings.logMsInterval,
            setLogEntriesCount: newSettings.logEntriesCount
        }

        const result = await fetch(settingsUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: queryString.stringify(dataToSend)
            }
        );

        if (result.ok) {
            dispatch(writeSettingsToESPSuccess(newSettings));
        } else {
            dispatch(writeSettingsToESPFail());
        }
    }
}

function calculateLogDuration(
    logEntriesCount: number,
    logMsInterval: number): LogDuration {

    const totalMs = logEntriesCount * logMsInterval;
    const totalSec = Math.trunc(totalMs / 1000);
    const totalMinutes = Math.trunc(totalSec / 60);
    const totalHours = Math.trunc(totalMinutes / 60);
    return {
        minutes: Math.trunc(totalMinutes % 60),
        hours: Math.trunc(totalHours % 24),
    }
}