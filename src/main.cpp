#include <Arduino.h>
#include "./WeatherServer/WeatherServer.h"
#include "./SensorValuesLogger/SensorValuesLogger.h"
#include "./PersistantSettingsService/PersistantSettingsService.h"

SensorValuesLogger* logger;
AppContext* appContext;
EspSettings appSettings;
WeatherServer* weatherServer;
SPIFFSConfig cfg;

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

  PersistantSettingsService* settingsService=PersistantSettingsService::getInstance();
  appSettings=settingsService->getSettings();
  
  weatherServer=new WeatherServer();
  weatherServer->configure();
}

void loop() {
  if(millis() - time_now > appSettings.logMsInterval){
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