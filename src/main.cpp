#include <Arduino.h>
#include "./WeatherServer/WeatherServer.h"

WeatherServer weatherServer;
SPIFFSConfig cfg;

void setup() {
  Serial.begin(9600);  

  // co2Meter.initCO2Meter();
  // bme280.initBME280();

  cfg.setAutoFormat(false);
  SPIFFS.setConfig(cfg);

  if (SPIFFS.begin()) {
    Serial.println("Mounted SPIFFS");
  } else {
    Serial.println("Unable to mount SPIFFS");
  }
  
  weatherServer.configure();
}

// 1000 = 1 sec
int period = 5000;
unsigned long time_now = 0;

void loop() {
  if(millis() - time_now > period){
        time_now = millis();        
        weatherServer.sendUpdatesToConnectedWebSocketClients();
    }
}