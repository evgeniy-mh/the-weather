#include "./BME280.h"

Adafruit_BME280 bme;
unsigned long delayTime;

void BME280::initBME280(){
    boolean status = bme.begin(DEFAULT_BME280_I2C_ADDRESS);  //i2c adress
    if (!status) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
    }
}


float BME280::readTemperature(){
    return bme.readTemperature();
}

float BME280::readPressure(){
    return bme.readPressure() / 100.0F;
}

float BME280::readHumidity(){
    return bme.readHumidity();
}

float BME280::readAltitude(){
    return bme.readAltitude(SEA_LEVEL_PRESSURE_HPA);
}

void BME280::printAllValuesToSerial(){
    Serial.print("Temperature = ");
    Serial.print(readTemperature());
    Serial.println(" *C");

    Serial.print("Pressure = ");

    Serial.print(readPressure());
    Serial.println(" hPa");

    Serial.print("Approx. Altitude = ");
    Serial.print(readAltitude());
    Serial.println(" m");

    Serial.print("Humidity = ");
    Serial.print(readHumidity());
    Serial.println(" %");

    Serial.println();
}