#ifndef BME280_H
#define BME280_H

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define SEA_LEVEL_PRESSURE_HPA (1013.25)
#define DEFAULT_BME280_I2C_ADDRESS 0x76

class BME280{
    public:
        void initBME280();
        int readTemperature();
        int readPressure();
        int readHumidity();
        int readAltitude();

        void printAllValuesToSerial();
};

#endif