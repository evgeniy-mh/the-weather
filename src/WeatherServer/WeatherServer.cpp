#include "./WeatherServer.h"
#include <FS.h>

#include "../SensorValuesLogger/SensorValuesLogger.h"

AsyncWebServer server(80);
AsyncWebSocket ws("/ws"); // access at ws://[esp ip]/ws
int WSClientCount=0;
bool serverIsReady=false;


CO2Meter co2meter;
BME280 bme280;

WeatherServer::WeatherServer(){
  
}

void onEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){
  if(type == WS_EVT_CONNECT){
    //client connected
    Serial.printf("ws[%s][%u] connect\n", server->url(), client->id());
    client->printf("Hello Client %u :)", client->id());
    client->ping();
    WSClientCount++;
  } else if(type == WS_EVT_DISCONNECT){
    //client disconnected
    Serial.printf("ws[%s][%u] disconnect: %u\n", server->url(), client->id());
    WSClientCount--;
  } else if(type == WS_EVT_ERROR){
    //error was received from the other end
    Serial.printf("ws[%s][%u] error(%u): %s\n", server->url(), client->id(), *((uint16_t*)arg), (char*)data);
  } else if(type == WS_EVT_PONG){
    //pong message was received (in response to a ping request maybe)
    Serial.printf("ws[%s][%u] pong[%u]: %s\n", server->url(), client->id(), len, (len)?(char*)data:"");
  }
}

String getSensorsOutputJSONString(){
        const int capacity=JSON_OBJECT_SIZE(5);
        StaticJsonDocument<capacity>doc;

        doc["co2"]=co2meter.getCO2();
        doc["temp"]=bme280.readTemperature();
        doc["humid"]=bme280.readHumidity();
        doc["pressure"]=bme280.readPressure();
        doc["alt"]=bme280.readAltitude();

        String output="";
        serializeJson(doc, output);
        return output;
}

void WeatherServer::configure(){
    co2meter.initCO2Meter();
    bme280.initBME280();

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

    ws.onEvent(onEvent);
    server.addHandler(&ws);

    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    server.begin();
    serverIsReady=true;
}

void WeatherServer::defineRESTRoutes(){

    // serve static files from /dist directory
    server.serveStatic("/", SPIFFS, "/dist");

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

    server.on("/log", HTTP_POST, [](AsyncWebServerRequest *request){
        SensorValuesLogger logger;
        
        String n=request->getParam("n",true,false)->value();

        String* respond=logger.getEntireLogCSV(atoi(n.c_str()));
        request->send(200, "application/text", *respond);
        delete respond;
    });

    server.on("/info", HTTP_GET, [](AsyncWebServerRequest *request){
        const int capacity=JSON_OBJECT_SIZE(5);
        StaticJsonDocument<capacity>doc;

        doc["co2"]=co2meter.getCO2();
        doc["temp"]=bme280.readTemperature();
        doc["humid"]=bme280.readHumidity();
        doc["pressure"]=bme280.readPressure();
        doc["alt"]=bme280.readAltitude();

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

    server.onNotFound([](AsyncWebServerRequest *request) {
      if (request->method() == HTTP_OPTIONS) {
        request->send(200);
      } else {
        request->send(404);
      }
});
}

void WeatherServer::sendUpdatesToConnectedWebSocketClients(){
  if(serverIsReady && WSClientCount>0){
    Serial.print("Clients: "); Serial.print(WSClientCount);
    Serial.println();

    ws.textAll(getSensorsOutputJSONString());
  }    
}