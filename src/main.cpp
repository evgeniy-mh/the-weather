#include <Arduino.h>
#include "./WeatherServer/WeatherServer.h"
#include "./SensorValuesLogger/SensorValuesLogger.h"

SensorValuesLogger* logger;
AppContext* appContext;
WeatherServer* weatherServer;
SPIFFSConfig cfg;

// 1000 = 1 sec
const int period = 5*1000;
unsigned long time_now = 0;

void setup() {
  cfg.setAutoFormat(false);
  SPIFFS.setConfig(cfg);

  if (SPIFFS.begin()) {
    // Serial.println("Mounted SPIFFS");
  } else {
    // Serial.println("Unable to mount SPIFFS");
  }
  
  appContext=AppContext::getInstance();
  
  weatherServer=new WeatherServer();
  weatherServer->configure();
}

void loop() {
  if(millis() - time_now > period){
        time_now = millis();        
        appContext->getSensorValuesLogger()->logSensorValues();
        appContext->displayInfoOnLCD128x64();
        weatherServer->sendUpdatesToConnectedWebSocketClients();

        // Serial.print(F("Heap spce:")); Serial.print(ESP.getFreeHeap());
        // Serial.println();
        // Serial.print(F("Heap fragm:")); Serial.print(ESP.getHeapFragmentation());
        // Serial.println();
    }
}