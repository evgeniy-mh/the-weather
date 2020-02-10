import { getServerURL } from "..";
import { parseLogCSV, convertTimeFromESPUptimeToLocalTime, SensorRawValues, EspRawLog, Co2ValueLogEntry } from "../Models";
import { fetchCo2LogStart, fetchCo2LogFail, fetchCo2LogSuccess, fetchNewSensorValues } from "../Actions";

export function connectViaWebSocket(): any {
    return async function (dispatch: any) {
        let socket = new WebSocket("ws://192.168.0.100/sensors");
        socket.onmessage = function (event) {
            const jsonObj: SensorRawValues = JSON.parse(event.data);
            dispatch(fetchNewSensorValues({
                co2: jsonObj.co2,
                temperature: jsonObj.temp,
                humidity: jsonObj.humid,
                time: new Date(),
            }))
        };

        socket.onclose = function (closeEvent) {
            console.error(closeEvent);
            console.log("Trying to reconnect to WS after connection closed");
            dispatch(connectViaWebSocket());
        }

        socket.onerror = function (event) {
            console.error(event);
            console.log("Trying to reconnect to WS after connection error");
            dispatch(connectViaWebSocket());
        }
    }
}

export function fetchSensorFullLog(): any {
    return async function (dispatch: any) {
        dispatch(fetchCo2LogStart());

        const res = await fetch(`${getServerURL()}/log`,
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
        if (!res.ok) {
            console.log(res.statusText);
            dispatch(fetchCo2LogFail());
        }
        const logCSV = await res.text();

        const parsedLog: EspRawLog = parseLogCSV(logCSV);
        const valuesWithProcessedTime: Co2ValueLogEntry[] =
            convertTimeFromESPUptimeToLocalTime(parsedLog);
        dispatch(fetchCo2LogSuccess(valuesWithProcessedTime))
    }
}