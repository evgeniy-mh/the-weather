#include "./WeatherServer.h"

AsyncWebServer server(80);
AsyncWebSocket ws("/ws"); // access at ws://[esp ip]/ws
int WSClientCount=0;
bool serverIsReady=false;

WeatherServer::WeatherServer(SensorValuesLogger *logger){
  this->logger=logger;
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

    server.on("/log-create", HTTP_POST, [this](AsyncWebServerRequest *request){
        String n=request->getParam("n",true,false)->value();
        this->logger= new SensorValuesLogger(atoi(n.c_str()));
    });

    server.on("/log-populate", HTTP_POST, [this](AsyncWebServerRequest *request){
        Serial.print(F("Free heap before populating log: "));
        Serial.print(ESP.getFreeHeap());
        Serial.println();

        this->logger->addMockValuesToLog();

        Serial.print(F("Free heap after populating log: "));
        Serial.print(ESP.getFreeHeap());
        Serial.println();
    });

    server.on("/log-get", HTTP_POST, [this](AsyncWebServerRequest *request){
        String* respond=this->logger->getEntireLogCSV();
        request->send(200, "text/plain", *respond);
        delete respond;
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

    // ws.textAll(getSensorsOutputJSONString());
    String* res=logger->getNewestEntryJSON();
    ws.textAll(*res);
    delete res;
  }    
}