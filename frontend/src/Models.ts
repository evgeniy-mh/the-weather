interface FetchStatus {
    readonly fetchStatus?: 'loading' | 'success' | 'fail';
}

// export interface SensorInfo extends FetchStatus {
//     readonly co2: number;
//     readonly temp: number;
//     readonly humid: number;
//     readonly time: number;
// }

export interface SensorsInfoEntry {
    readonly co2: number;
    readonly temp: number;
    readonly humid: number;
    readonly time: number;
}

export interface SersorsInfoLog extends FetchStatus {
    log: SensorsInfoEntry[];
}


export const emptySensorsInfoLog: SersorsInfoLog = {
    log: []
}

// transform sensor values log in CSV form from esp
export function parseLogCSV(log: string): SensorsInfoEntry[] {
    //CSV: "time(in ms) co2 humidity temperature;"
    if (log.length === 0) {
        console.error("Error getting sensors log, string with zero length");
        return [];
    }

    const entries: string[] = log.split(';');
    return entries
        .map((entry) => {
            const values: string[] = entry.split(' ');
            const res: SensorsInfoEntry = {
                time: values[0] ? Number.parseInt(values[0]) : 0,
                co2: values[1] ? Number.parseInt(values[1]) : 0,
                humid: values[2] ? Number.parseInt(values[2]) : 0,
                temp: values[3] ? Number.parseInt(values[3]) : 0,
            }
            return res;
        })
        .filter((entry) => entry.time + entry.co2 + entry.humid + entry.temp !== 0)
}

export function sortLogByAscendingTime(log: SensorsInfoEntry[]): SensorsInfoEntry[] {
    return log.sort((a, b) => a.time - b.time);
}