#include "PersistantSettingsService.h"

PersistantSettingsService* PersistantSettingsService::instance = 0;
PersistantSettingsService* PersistantSettingsService::getInstance(){
    if (instance == 0)
    {
        instance = new PersistantSettingsService();
    }
    return instance;
}

PersistantSettingsService::PersistantSettingsService(){
    Serial.begin(9600);        
    if(SPIFFS.exists(settingsFileName)){
        Serial.println("Will read from settings file");
        settings=readSettingsFile();
    }else{
        // write default settings
        settings.logMsInterval=10000; //10 secongs
        settings.logEntriesCount=200;
        writeSettingsToFile(settings);

        Serial.println("writeSettingsToFile");
    }
}

void PersistantSettingsService::writeSettingsToFile(EspSettings settings){
    File settingsFile=SPIFFS.open(settingsFileName,"w");

    if(!settingsFile){
        //TODO
    }
    
    const int capacity=JSON_OBJECT_SIZE(5);
    StaticJsonDocument<capacity>doc;
    doc[F("logMsInterval")]=settings.logMsInterval;
    doc[F("logEntriesCount")]=settings.logEntriesCount;
    String output="";
    serializeJson(doc, output);

    settingsFile.print(output);
    settingsFile.close();

    Serial.println(output);
}

EspSettings PersistantSettingsService::readSettingsFile(){
    EspSettings fallbackSettings;
    fallbackSettings.logEntriesCount=defaultLogEntriesCount;
    fallbackSettings.logMsInterval=defaultLogMsInterval;

    File settingsFile=SPIFFS.open(settingsFileName,"r");
    if(!settingsFile){
        Serial.println("Failed to open Esp settings file");
        settingsFile.close();
        return fallbackSettings;
    }

    String fileContent=settingsFile.readString();
    if(fileContent.isEmpty()){
        Serial.println("Esp settings file is empty");
        settingsFile.close();
        return fallbackSettings;
    }
    settingsFile.close();

    Serial.print("Esp file content: ");
    Serial.println(fileContent);

    const size_t capacity = JSON_OBJECT_SIZE(5) + 30;
    DynamicJsonDocument doc(capacity);
    DeserializationError err = deserializeJson(doc, fileContent);

    if(err) {
        Serial.print(F("deserializeJson() for Esp settings file failed with code "));
        Serial.println(err.c_str());
        return fallbackSettings;
    }

    int logMsInterval=doc[F("logMsInterval")];
    int logEntriesCount=doc[F("logEntriesCount")];

    if(logMsInterval==0 || logEntriesCount==0){
        Serial.println("Got logMsInterval==0 || logEntriesCount==0");
        return fallbackSettings;
    }

    EspSettings settings;
    settings.logMsInterval=logMsInterval;
    settings.logEntriesCount=logEntriesCount;
    return settings;
}

EspSettings PersistantSettingsService::getSettings(){
    return settings;
}