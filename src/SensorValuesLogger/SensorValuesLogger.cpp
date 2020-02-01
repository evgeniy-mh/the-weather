#include "SensorValuesLogger.h"

struct Entry{
    String time;
    int co2;
    int temp;
    int humid;
};

int nOfEntries;
Entry* sensorsLog;

SensorValuesLogger::SensorValuesLogger(int numberOfLogEntries){
    nOfEntries=numberOfLogEntries;
    sensorsLog=new Entry[nOfEntries];
}

SensorValuesLogger::~SensorValuesLogger(){
    delete [] sensorsLog;
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