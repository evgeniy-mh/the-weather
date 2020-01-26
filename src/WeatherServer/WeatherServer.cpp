#include "./WeatherServer.h"
#include <FS.h>

AsyncWebServer server(80);

CO2Meter co2meter;
BME280 bme280;



SPIFFSConfig cfg;


WeatherServer::WeatherServer(){
  co2meter.initCO2Meter();
  bme280.initBME280();

  cfg.setAutoFormat(false);
  SPIFFS.setConfig(cfg);

  if (SPIFFS.begin()) {
    Serial.println("Mounted SPIFFS");
  } else {
    Serial.println("Unable to mount SPIFFS");
  }
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

String getContentType(String filename) { // convert the file extension to the MIME type
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  return "text/plain";
}

void WeatherServer::defineRESTRoutes(){
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
        request->send(200, "text/plain", "Hello, world");
    });

    server.on("/files", HTTP_GET, [](AsyncWebServerRequest *request){
        String files = "";
        Dir dir = SPIFFS.openDir("/");
        while (dir.next()) {
          files += dir.fileName();
          files += " / ";
          files += dir.fileSize();
          files += " ";
        }

        request->send(200, "application/text", files);
    });

    server.on("/test", HTTP_GET, [](AsyncWebServerRequest *request){
        String path="/index.html";
        String contentType = getContentType(path);

        Dir dir = SPIFFS.openDir("/");
        if (SPIFFS.exists(path)) {
            request->send(SPIFFS, path);
        }else{
          Serial.print("Can't find file:"); Serial.println(path);
          request->send(500);
        }        
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
