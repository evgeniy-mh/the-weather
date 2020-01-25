#include <Arduino.h>
#include "./CO2Meter/CO2Meter.h"

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define SEA_LEVEL_PRESSURE_HPA (1013.25)

Adafruit_BME280 bme;
unsigned long delayTime;

CO2Meter co2Meter;

void setup() {
  Serial.begin(9600);  

  co2Meter.initCO2Meter();



  boolean status = bme.begin(0x76);  //i2c adress
  if (!status) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }
  
  Serial.println("-- Default Test --");
  delayTime = 1000;

  Serial.println();
}

void readBME(){
  Serial.print("Temperature = ");
  Serial.print(bme.readTemperature());
  Serial.println(" *C");
  
  Serial.print("Pressure = ");
  Serial.print(bme.readPressure() / 100.0F);
  Serial.println(" hPa");
  
  Serial.print("Approx. Altitude = ");
  Serial.print(bme.readAltitude(SEA_LEVEL_PRESSURE_HPA));
  Serial.println(" m");
  
  Serial.print("Humidity = ");
  Serial.print(bme.readHumidity());
  Serial.println(" %");
  
  Serial.println();
}

void loop() {
  Serial.print("PPM: "); Serial.print(co2Meter.getCO2());  
  Serial.println();

  readBME();

  delay(2500);
}