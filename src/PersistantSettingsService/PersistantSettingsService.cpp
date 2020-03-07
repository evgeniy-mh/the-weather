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
    if(SPIFFS.exists(settingsFileName)){
        Serial.println("Will read from settings file");
        settings=readSettingsFile();
    }else{
        // write default settings        
        EspSettings defaultSettings;
        defaultSettings.logMsInterval=defaultLogMsInterval;
        defaultSettings.logEntriesCount=defaultLogEntriesCount;
        setSettings(defaultSettings);
        writeSettingsToFile();
        Serial.println("using default settings");
    }
}

void PersistantSettingsService::setSettings(EspSettings newSettings){
    settings.logMsInterval=newSettings.logMsInterval;
    settings.logEntriesCount=newSettings.logEntriesCount;
}

bool PersistantSettingsService::writeSettingsToFile(){
    File settingsFile=SPIFFS.open(settingsFileName,"w");

    if(!settingsFile){
        return false;
    }
    
    const int capacity=JSON_OBJECT_SIZE(5);
    StaticJsonDocument<capacity>doc;
    doc[F("logMsInterval")]=settings.logMsInterval;
    doc[F("logEntriesCount")]=settings.logEntriesCount;
    String output="";
    serializeJson(doc, output);

    if(output.isEmpty()){
        return false;
    }

    settingsFile.print(output);
    settingsFile.close();
    return true;
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

bool PersistantSettingsService::areSettingsValid(EspSettings newSettings){
       return 
            newSettings.logEntriesCount>1 
            && newSettings.logEntriesCount<=500
            && newSettings.logMsInterval>=5000;
}