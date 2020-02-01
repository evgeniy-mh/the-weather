#pragma once
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "./CO2Meter/CO2Meter.h"
#include "./BME280/BME280.h"

struct Entry{
    String time;
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
        void addMockValuesToLog();
        String* getNewestEntryJSON();

    private:
        void addLogEntry(Entry newEntry);
};