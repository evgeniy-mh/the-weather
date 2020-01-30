#include <Arduino.h>
#include "./WeatherServer/WeatherServer.h"

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

  WeatherServer weatherServer;
  weatherServer.configure();
}
void loop() {
}