#include "ArduinoJson.h"

class SensorValuesLogger{
    public:
        SensorValuesLogger(int numberOfLogEntries);
        ~SensorValuesLogger();
        String* getEntireLogCSV();

        void addMockValuesToLog();
};