#pragma once
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "./CO2Meter/CO2Meter.h"
#include "./BME280/BME280.h"

struct Entry{
    unsigned long ms;
    int co2;
    // int temp;
    // int humid;
};

struct SensorValues{
    int co2;
    int temp;
    int humid;
};

class SensorValuesLogger{
    public:
        SensorValuesLogger(int numberOfLogEntries);
        ~SensorValuesLogger();
        String* getEntireLogCSV();
        void logSensorValues();
        String* getNewestEntryJSON();
        SensorValues getNewestSensorValues();

    private:
        void addLogEntry(Entry newEntry);
};