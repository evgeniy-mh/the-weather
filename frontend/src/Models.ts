type DataFetchStatus = 'loading' | 'success' | 'fail';

export interface Co2ValueRawLogEntry {
    readonly co2: number;
    readonly time: number; //esp uptime in ms
}

export interface Co2ValueLogEntry {
    readonly co2: number;
    readonly time: Date; //user local time
}

export interface SensorRawValues extends Co2ValueRawLogEntry {
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

export function parseLogCSV(log: string): Co2ValueRawLogEntry[] {
    //CSV format: "time(in ms) co2;"
    if (log.length === 0) {
        console.error("Error getting sensors log, string with zero length");
        return [];
    }

    const entries: string[] = log.split(';');
    return entries
        .map((entry) => {
            const values: string[] = entry.split(' ');
            const res: Co2ValueRawLogEntry = {
                time: values[0] ? Number.parseInt(values[0]) : 0,
                co2: values[1] ? Number.parseInt(values[1]) : 0,
            }
            return res;
        })
        .filter((entry) => entry.time + entry.co2 !== 0)
}

export function convertTimeFromESPUptimeToLocalTime(log: Co2ValueRawLogEntry[]): Co2ValueLogEntry[] {
    const now: number = Date.now();
    let timeDelta = log[0].time - log[1].time;

    const result: Co2ValueLogEntry[] = [];
    for (let i = 0; i < log.length; i++) {
        const newValue: Co2ValueLogEntry = {
            co2: log[i].co2,
            time: new Date(now - timeDelta)
        }
        result.push(newValue);
        timeDelta = log[0].time - log[i].time;
    }
    return result.reverse();
}