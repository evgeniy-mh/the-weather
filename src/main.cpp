#include <Arduino.h>
#include "./CO2Meter/CO2Meter.h"
#include "./BME280/BME280.h"

CO2Meter co2Meter;
BME280 bme280;

void setup() {
  Serial.begin(9600);  

  co2Meter.initCO2Meter();
  bme280.initBME280();
}
void loop() {
  co2Meter.printPPMValueToSerial();
  bme280.printAllValuesToSerial();

  delay(2500);
}