#pragma once

#include <Arduino.h>
#include "MHZ19.h" 
// #include <SoftwareSerial.h>

#define MHZ19_TX_PIN 1
#define MHZ19_RX_PIN 3  
#define MHZ19_BAUDRATE 9600

class CO2Meter{
    public:
        void initCO2Meter();
        int getCO2();

        void printPPMValueToSerial();
};