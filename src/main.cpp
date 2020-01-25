#include <Arduino.h>
#include "MHZ19.h" 
#include <SoftwareSerial.h>
#include "main.h"

#define MHZ19_TX_PIN D5             
#define MHZ19_RX_PIN D6  
#define MHZ19_BAUDRATE 9600

MHZ19 myMHZ19; 
SoftwareSerial MHZ19Serial(MHZ19_TX_PIN,MHZ19_RX_PIN);   

void setup() {
  Serial.begin(9600);  

  initCO2Meter();
}

void loop() {
  Serial.print("PPM: "); Serial.print(myMHZ19.getCO2());  
  Serial.println();

  delay(2500);
}

void initCO2Meter(){
    Serial.println("MHZ19b::: Initializing...");  

    MHZ19Serial.begin(MHZ19_BAUDRATE, SWSERIAL_8N1,MHZ19_TX_PIN, MHZ19_RX_PIN);
    myMHZ19.begin(MHZ19Serial);          
    myMHZ19.autoCalibration(true);                            
    myMHZ19.setRange(2000);
    Serial.println("MHZ19b::: Initializing done");  
}