import { fetchSensorInfoSuccess, fetchSensorInfoStart, fetchSensorInfoFail } from "../Actions"
import { getServerURL } from "..";
import { parseLogCSV, sortLogByAscendingTime, SensorsRawInfoEntry, processTime, SensorsInfoEntry } from "../Models";

export function connectViaWebSocket(): any {
    return async function (dispatch: any) {
        let socket = new WebSocket("ws://192.168.0.100/ws");
        socket.onmessage = function (event) {
            const jsonObj: SensorsRawInfoEntry = JSON.parse(event.data);
            dispatch(fetchSensorInfoSuccess([{
                co2: jsonObj.co2,
                temperature: jsonObj.temp,
                humidity: jsonObj.humid,
                time: new Date(),
            }]))
            console.log(jsonObj);
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
        dispatch(fetchSensorInfoStart());

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
            dispatch(fetchSensorInfoFail());
        }
        const log = await res.text();

        const sortedAndParsedRawValues: SensorsRawInfoEntry[] = sortLogByAscendingTime(
            parseLogCSV(log)
        )

        const valuesWithProcessedTime: SensorsInfoEntry[] = processTime(sortedAndParsedRawValues);

        dispatch(
            fetchSensorInfoSuccess(valuesWithProcessedTime)
        )
    }
}