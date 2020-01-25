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

class WeatherServer{
    public:
        const char* ssid = "dlink";
        const char* password = "768513783";

        // WeatherServer(CO2Meter co2meter, BME280 bme280);
        void configure();

    private:
        void defineRESTRoutes();
};