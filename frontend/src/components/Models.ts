interface FetchStatus {
    fetchStatus?: 'loading' | 'success' | 'fail';
}

export interface SensorInfoServerResponce {
    co2: number,
    temp: number,
    humid: number,
    pressure: number,
    alt: number,
}

export interface SensorInfo extends FetchStatus {
    co2?: number;
    temperature?: number;
    humidity?: number;
    pressure?: number;
    altitude?: number;
}