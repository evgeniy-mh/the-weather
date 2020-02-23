import { fetchEspSettingsStart, fetchEspSettingsFail, fetchEspSettingsSuccess } from "../Actions/EspSettingsActions";
import { ESPSettings, LogDuration } from "../Models";

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
            const espSettings: ESPSettings = await result.json();
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