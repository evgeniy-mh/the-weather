#include <Arduino.h>
#include "./CO2Meter/CO2Meter.h"

CO2Meter co2Meter;

void setup() {
  Serial.begin(9600);  

  co2Meter.initCO2Meter();
}

void loop() {
  Serial.print("PPM: "); Serial.print(co2Meter.getCO2());  
  Serial.println();

  delay(2500);
}