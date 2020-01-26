#include "./WeatherServer.h"

AsyncWebServer server(80);

CO2Meter co2meter;
BME280 bme280;

WeatherServer::WeatherServer(){
  co2meter.initCO2Meter();
  bme280.initBME280();
}

void WeatherServer::configure(){
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    if (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.printf("WiFi Failed!\n");
        return;
    }

    boolean reconfigureResult=WiFi.config(
      IPAddress(192,168,0,100), IPAddress(192,168,0,1), IPAddress(192,168,0,0));

    if(reconfigureResult){
      Serial.println("reconfigured to use static IP");
    }else{
      Serial.println("reconfiguration failed");
    }

    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    defineRESTRoutes();    

    server.begin();
}

void WeatherServer::defineRESTRoutes(){
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
        request->send(200, "text/plain", "Hello, world");
    });

    server.on("/info", HTTP_GET, [](AsyncWebServerRequest *request){
        const int capacity=JSON_OBJECT_SIZE(5);
        StaticJsonDocument<capacity>doc;

        doc["co2"]=co2meter.getCO2();
        doc["temp"]=bme280.readTemperature();
        doc["humid"]=bme280.readHumidity();
        doc["pressure"]=bme280.readPressure();
        doc["altitude"]=bme280.readAltitude();

        String output="";
        serializeJson(doc, output);

        request->send(200, "application/json", output);
    });

    server.on("/cpuinfo", HTTP_GET, [](AsyncWebServerRequest *request){
        const int capacity=JSON_OBJECT_SIZE(13);
        StaticJsonDocument<capacity>doc;

        doc["FreeHeap"]=ESP.getFreeHeap();
        doc["HeapFragmentation"]=ESP.getHeapFragmentation();
        doc["MaxFreeBlockSize"]=ESP.getMaxFreeBlockSize();
        doc["ChipId"]=ESP.getChipId();
        doc["CoreVersion"]=ESP.getCoreVersion();
        doc["SdkVersion"]=ESP.getSdkVersion();
        doc["CpuFreqMHz"]=ESP.getCpuFreqMHz();
        doc["SketchSize"]=ESP.getSketchSize();
        doc["FreeSketchSpace"]=ESP.getFreeSketchSpace();
        doc["FlashChipId"]=ESP.getFlashChipId();
        doc["FlashChipSize"]=ESP.getFlashChipSize();
        doc["FlashChipRealSize"]=ESP.getFlashChipRealSize();
        doc["FlashChipSpeed"]=ESP.getFlashChipSpeed();
        
        String output="";
        serializeJson(doc, output);
        request->send(200, "application/json", output);
    });
}
