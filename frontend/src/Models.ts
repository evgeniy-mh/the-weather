type DataFetchStatus = 'loading' | 'success' | 'fail';

export interface Co2RawLog {
    readonly co2: number; // co2 value
    readonly time: number; // when this entry was made (in local esp time)
}

export interface EspRawLog {
    espLocalTimeMs: number // local esp time
    log: Co2RawLog[] // co2 values log
}

export interface Co2ValueLogEntry {
    readonly co2: number;
    readonly time: Date; //client local time
}

export interface SensorRawValues {
    readonly co2: number;
    readonly time: number;
    readonly temp: number;
    readonly humid: number;
}

export interface SensorValues extends Co2ValueLogEntry {
    readonly temperature: number;
    readonly humidity: number;
}

export type SensorsData = {
    dataFetchStatus: DataFetchStatus;
    co2ValuesLog: Co2ValueLogEntry[];
    temperature: number;
    humidity: number;
}

export type AppState = Readonly<{
    sensorsData: SensorsData
    // settings, etc.
}>

export function parseLogCSV(log: string): EspRawLog {
    //CSV format: "esp_local_time(in ms);time(in ms) co2(integer);"
    if (log.length === 0) {
        console.error("Error getting sensors log, string with zero length");
        return { espLocalTimeMs: 0, log: [] };
    }

    const values: string[] = log.split(';');

    let result: EspRawLog = {
        espLocalTimeMs: Number.parseFloat(values[0]),
        log: []
    }

    result.log = values
        .slice(1) // remove first value (local esp time)
        .map((entry) => {
            const values: string[] = entry.split(' ');
            const res: Co2RawLog = {
                time: values[0] ? Number.parseInt(values[0]) : 0,
                co2: values[1] ? Number.parseInt(values[1]) : 0,
            }
            return res;
        })
        .filter((entry) => entry.time + entry.co2 !== 0);

    return result;
}

export function convertTimeFromESPUptimeToLocalTime(espRawLog: EspRawLog): Co2ValueLogEntry[] {
    const clientTimeMs = Date.now();

    const result: Co2ValueLogEntry[] = [];
    for (let i = 0; i < espRawLog.log.length; i++) {
        const newValue: Co2ValueLogEntry = {
            co2: espRawLog.log[i].co2,
            time: new Date(clientTimeMs - (espRawLog.espLocalTimeMs - espRawLog.log[i].time))
        }
        result.push(newValue);
    }
    return result.reverse();
}