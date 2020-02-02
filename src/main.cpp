#include <Arduino.h>
#include "./WeatherServer/WeatherServer.h"
#include "./SensorValuesLogger/SensorValuesLogger.h"

SensorValuesLogger *logger;
WeatherServer* weatherServer;
SPIFFSConfig cfg;

void setup() {
  Serial.begin(9600);  

  cfg.setAutoFormat(false);
  SPIFFS.setConfig(cfg);

  if (SPIFFS.begin()) {
    Serial.println("Mounted SPIFFS");
  } else {
    Serial.println("Unable to mount SPIFFS");
  }
  
  logger=new SensorValuesLogger(10);
  weatherServer=new WeatherServer(logger);
  weatherServer->configure();
}

// 1000 = 1 sec
int period = 5000;
unsigned long time_now = 0;

void loop() {
  if(millis() - time_now > period){
        time_now = millis();        
        logger->logSensorValues();
        weatherServer->sendUpdatesToConnectedWebSocketClients();

        // Serial.print(F("Heap spce:")); Serial.print(ESP.getFreeHeap());
        // Serial.println();
        // Serial.print(F("Heap fragm:")); Serial.print(ESP.getHeapFragmentation());
        // Serial.println();
    }
}