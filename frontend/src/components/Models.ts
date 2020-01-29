interface FetchStatus {
    fetchStatus?: 'loading' | 'success' | 'fail';
}

interface SensorInfo extends FetchStatus {
    co2?: number;
    temperature?: number;
    humidity?: number;
}