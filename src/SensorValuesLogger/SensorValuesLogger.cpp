#include "SensorValuesLogger.h"

CO2Meter co2meter;
BME280 bme280;

int nOfEntries;
Entry* sensorsLog;

int currentTemperature=0;
int currentHumidity=0;

SensorValuesLogger::SensorValuesLogger(int numberOfLogEntries){
    co2meter.initCO2Meter();
    bme280.initBME280();

    currentTemperature=bme280.readTemperature();
    currentHumidity=bme280.readHumidity();

    nOfEntries=numberOfLogEntries;
    sensorsLog=new Entry[nOfEntries];

    // fill log with zero values
    for(int i=0;i<nOfEntries;i++){
        sensorsLog[i].ms=0;
        sensorsLog[i].co2=0;
        // sensorsLog[i].humid=0;
        // sensorsLog[i].temp=0;
    }
}

SensorValuesLogger::~SensorValuesLogger(){
    delete [] sensorsLog;
}

void SensorValuesLogger::logSensorValues(){
    Entry newEntry;
    newEntry.co2=co2meter.getCO2();
    newEntry.ms=millis();
    addLogEntry(newEntry);

    currentTemperature=bme280.readTemperature();
    currentHumidity=bme280.readHumidity();
}

String* SensorValuesLogger::getNewestEntryJSON(){
    const int capacity=JSON_OBJECT_SIZE(10);
        StaticJsonDocument<capacity>doc;
        boolean added=doc[F("co2")].set(sensorsLog[0].co2);
        if(!added){
            // Serial.println(F("Unable to add co2"));
        }

        added=doc[F("humid")].set(currentHumidity);
        if(!added){
            // Serial.println(F("Unable to add humid"));
        }

        added=doc[F("temp")].set(currentTemperature);
        if(!added){
            // Serial.println(F("Unable to add temp"));
        }

        added=doc[F("time")].set(sensorsLog[0].ms);
        if(!added){
            // Serial.println(F("Unable to add time"));
        }

        String* output=new String(F(""));
        serializeJson(doc, *output);
        return output;
}

SensorValues SensorValuesLogger::getNewestSensorValues(){
    SensorValues values;
    values.co2=sensorsLog[0].co2;
    values.temp=currentTemperature;
    values.humid=currentHumidity;
    return values;
}

String* SensorValuesLogger::getEntireLogCSV(){
    /*
        CSV log scheme:
        _ms_int_value_; _ms_int_value_ _co2_int_value_; ...
    */
    const String SPACE=F(" ");
    const String SEMICOLON=F(";");

    String* res=new String(F("")); 
    res->concat(millis()); // add esp local time
    res->concat(SEMICOLON);

    
    for(int i=0;i<nOfEntries;i++){ // add co2 log values
        if(sensorsLog[i].ms==0 || sensorsLog[i].co2==0){
            continue;
        }
        res->concat(sensorsLog[i].ms);
        res->concat(SPACE);
        res->concat(sensorsLog[i].co2);
        res->concat(SEMICOLON);
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