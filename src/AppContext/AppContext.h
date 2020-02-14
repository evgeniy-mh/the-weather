#pragma once

#include <ESPAsyncWebServer.h>
#include "./SensorValuesLogger/SensorValuesLogger.h"
#include "./LCD128x64/LCD128x64.h"

class AppContext{
    private:
        static AppContext* instance;
        AppContext();

        int logEntriesCount;
        int logMsInterval;
        SensorValuesLogger* sensorValuesLogger;
        AsyncWebSocket* debugWS;
        LCD128x64* lcd128x64;
    public:
      static AppContext* getInstance();      

      AsyncWebSocket* getDebugWebSocket();
      SensorValuesLogger* getSensorValuesLogger();   
      LCD128x64* getLCD128x64(); 
      void sendDebugMessage(char* mes);
      void displayInfoOnLCD128x64();

      int getLogEntriesCount();
      int getLogMsInterval();
      void setLogMsInterval(int interval);
};