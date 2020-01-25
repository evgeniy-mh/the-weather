#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>

class WeatherServer{
    public:
        const char* ssid = "dlink";
        const char* password = "768513783";
        void configure();

    private:
        void defineRESTRoutes();
};