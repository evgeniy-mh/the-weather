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

#include "./CO2Meter/CO2Meter.h"
#include "./BME280/BME280.h"

class WeatherServer{
    public:
        const char* ssid = "dlink";
        const char* password = "768513783";
        WeatherServer();
        void configure();

    private:
        void defineRESTRoutes();
};