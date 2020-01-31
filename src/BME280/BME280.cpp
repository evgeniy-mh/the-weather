#include "./BME280.h"

Adafruit_BME280 bme;
unsigned long delayTime;

void BME280::initBME280(){
    boolean status = bme.begin(DEFAULT_BME280_I2C_ADDRESS);  //i2c adress
    if (!status) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
    }
}


int BME280::readTemperature(){
    return (int)floor(bme.readTemperature());
}

int BME280::readPressure(){
    return (int)floor(bme.readPressure() / 100.0F);
}

int BME280::readHumidity(){
    return (int)floor(bme.readHumidity());
}

int BME280::readAltitude(){
    return (int)floor(bme.readAltitude(SEA_LEVEL_PRESSURE_HPA));
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