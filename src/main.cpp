#include <Arduino.h>
#include "./WeatherServer/WeatherServer.h"

void setup() {
  Serial.begin(9600);  

  // co2Meter.initCO2Meter();
  // bme280.initBME280();
  WeatherServer weatherServer;
  weatherServer.configure();
}
void loop() {
}