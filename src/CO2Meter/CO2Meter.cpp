#include "CO2Meter.h"

MHZ19 MHZ19_Obj; 
// SoftwareSerial MHZ19Serial(MHZ19_TX_PIN,MHZ19_RX_PIN);   
// Serial.

void CO2Meter::initCO2Meter(){
    // Serial.println("MHZ19b::: Initializing...");  

    // MHZ19Serial.begin(MHZ19_BAUDRATE, SWSERIAL_8N1,MHZ19_TX_PIN, MHZ19_RX_PIN);
    Serial.begin(MHZ19_BAUDRATE,SERIAL_8N1,SERIAL_FULL);
    Serial.pins(MHZ19_TX_PIN,MHZ19_RX_PIN);
    MHZ19_Obj.begin(Serial);          
    MHZ19_Obj.autoCalibration(true);                            
    MHZ19_Obj.setRange(2000);
    // Serial.println("MHZ19b::: Initializing done");
}

int CO2Meter::getCO2(){
    return MHZ19_Obj.getCO2();
}