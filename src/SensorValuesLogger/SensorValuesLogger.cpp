#include "SensorValuesLogger.h"

struct Entry{
    String time;
    int co2;
    int temp;
    int humid;
};

String* SensorValuesLogger::getEntireLogCSV(int n){
    Entry* log=new Entry[n];

    for(int i=0;i<n;i++){
        log[i].time="hi handsome";
        log[i].co2=888;
        log[i].humid=777;
        log[i].temp=444;
    }

    String* res=new String("");
    for(int i=0;i<n;i++){
        res->concat(log[i].time);
        res->concat(" ");


        res->concat(log[i].co2);
        res->concat(" ");

        res->concat(log[i].humid);
        res->concat(" ");

        res->concat(log[i].temp);
        res->concat(";");
    }
    delete [] log;

    return res;
}