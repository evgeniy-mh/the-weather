interface FetchStatus {
    readonly fetchStatus?: 'loading' | 'success' | 'fail';
}

export interface SensorInfo extends FetchStatus {
    readonly co2: number;
    readonly temp: number;
    readonly humid: number;
    readonly pressure: number;
    readonly alt: number;
}

export const emptySensorsInfo: SensorInfo = {
    co2: 0,
    temp: 0,
    humid: 0,
    pressure: 0,
    alt: 0,
}