#include "CO2Meter.h"

MHZ19 MHZ19_Obj; 
void CO2Meter::initCO2Meter(){
    // Serial.begin(MHZ19_BAUDRATE,SERIAL_8N1,SERIAL_FULL);
    // Serial.pins(MHZ19_TX_PIN,MHZ19_RX_PIN);
    // MHZ19_Obj.begin(Serial);          
    // MHZ19_Obj.autoCalibration(true);                            
    // MHZ19_Obj.setRange(2000);

    // do nothing...
}

int CO2Meter::getCO2(){
    // return MHZ19_Obj.getCO2();
    return 555;
}