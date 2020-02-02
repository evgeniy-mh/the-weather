#include "SensorValuesLogger.h"

CO2Meter co2meter;
BME280 bme280;

int nOfEntries;
Entry* sensorsLog;

SensorValuesLogger::SensorValuesLogger(int numberOfLogEntries){
    co2meter.initCO2Meter();
    bme280.initBME280();

    nOfEntries=numberOfLogEntries;
    sensorsLog=new Entry[nOfEntries];

    // fill log with zero values
    for(int i=0;i<nOfEntries;i++){
        sensorsLog[i].ms=0;
        sensorsLog[i].co2=0;
        sensorsLog[i].humid=0;
        sensorsLog[i].temp=0;
    }
}

SensorValuesLogger::~SensorValuesLogger(){
    delete [] sensorsLog;
}

void SensorValuesLogger::logSensorValues(){
    Entry newEntry;
    newEntry.co2=co2meter.getCO2();
    newEntry.humid=bme280.readHumidity();
    newEntry.temp =bme280.readTemperature();
    newEntry.ms=millis();
    addLogEntry(newEntry);
}

String* SensorValuesLogger::getNewestEntryJSON(){
    const int capacity=JSON_OBJECT_SIZE(10);
        StaticJsonDocument<capacity>doc;
        // doc[F("co2")]=sensorsLog[0].co2;
        // doc[F("humid")]=sensorsLog[0].humid;
        // doc[F("temp")]=sensorsLog[0].temp;        
        // doc[F("time")]=777;
        boolean added;        
        added=doc[F("co2")].set(sensorsLog[0].co2);
        if(!added){
            Serial.println(F("Unable to add co2"));
        }

        added=doc[F("humid")].set(sensorsLog[0].humid);
        if(!added){
            Serial.println(F("Unable to add humid"));
        }

        added=doc[F("temp")].set(sensorsLog[0].temp);
        if(!added){
            Serial.println(F("Unable to add temp"));
        }

        added=doc[F("time")].set(sensorsLog[0].ms);
        if(!added){
            Serial.println(F("Unable to add time"));
        }

        String* output=new String(F(""));
        serializeJson(doc, *output);
        return output;
}

String* SensorValuesLogger::getEntireLogCSV(){
    String* res=new String("");
    const String SPACE=F(" ");
    for(int i=0;i<nOfEntries;i++){
        res->concat(sensorsLog[i].ms);
        res->concat(SPACE);
        res->concat(sensorsLog[i].co2);
        res->concat(SPACE);
        res->concat(sensorsLog[i].humid);
        res->concat(SPACE);
        res->concat(sensorsLog[i].temp);
        res->concat(F(";"));
    }
    return res;
}

// Add new entry to queue end, remove entry from queue start(oldest element)
void SensorValuesLogger::addLogEntry(Entry newEntry){
    for(int i=nOfEntries-1;i>=1;i--){
        sensorsLog[i]=sensorsLog[i-1];
    }
    sensorsLog[0]=newEntry;
}