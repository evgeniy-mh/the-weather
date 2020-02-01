#pragma once

#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>

#include "AsyncJson.h"
#include "ArduinoJson.h"

#include <FS.h>
#include "../SensorValuesLogger/SensorValuesLogger.h"

class WeatherServer{
    public:
        const char* ssid = "dlink";
        const char* password = "768513783";
        WeatherServer(SensorValuesLogger* logger);
        void configure();
        void sendUpdatesToConnectedWebSocketClients();

    private:
        SensorValuesLogger *logger;
        void defineRESTRoutes();
};