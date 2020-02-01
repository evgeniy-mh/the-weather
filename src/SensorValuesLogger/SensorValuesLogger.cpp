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
        sensorsLog[i].time=F("");
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
    newEntry.time=millis();
    addLogEntry(newEntry);
}

String* SensorValuesLogger::getNewestEntryJSON(){
    const int capacity=JSON_OBJECT_SIZE(4);
        StaticJsonDocument<capacity>doc;
        doc[F("co2")]=sensorsLog[0].co2;
        doc[F("humid")]=sensorsLog[0].humid;
        doc[F("temp")]=sensorsLog[0].temp;        
        doc[F("time")]=sensorsLog[0].time;
        String* output=new String(F(""));
        serializeJson(doc, *output);
        return output;
}

void SensorValuesLogger::addMockValuesToLog(){
    for(int i=0;i<nOfEntries;i++){
        sensorsLog[i].time=F("2019 07 13 15:22:33");
        sensorsLog[i].co2=888;
        sensorsLog[i].humid=777;
        sensorsLog[i].temp=444;
    }
}

String* SensorValuesLogger::getEntireLogCSV(){
    String* res=new String("");
    const String SPACE=F(" ");
    for(int i=0;i<nOfEntries;i++){
        res->concat(sensorsLog[i].time);
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