#pragma once

#include <FS.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"

#define settingsFileName "/settings.json"
#define defaultLogMsInterval 10000
#define defaultLogEntriesCount 200

struct EspSettings{
    int logMsInterval;
    int logEntriesCount;
};

class PersistantSettingsService{
    private:
        static PersistantSettingsService* instance;
        PersistantSettingsService();

        EspSettings settings;
        void writeSettingsToFile(EspSettings settings);
        EspSettings readSettingsFile();

    public:
        static PersistantSettingsService* getInstance();   

        EspSettings getSettings();
        void setSettings(EspSettings newSettings);
};