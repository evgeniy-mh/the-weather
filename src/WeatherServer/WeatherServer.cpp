#include "./WeatherServer.h"

AsyncWebServer server(80);
AsyncWebSocket sensorsWS("/sensors"); // access at ws://[esp ip]/sensors

int WSClientCount=0;
bool serverIsReady=false;

WeatherServer::WeatherServer(){
  appContext=AppContext::getInstance();
  appSettingsService=PersistantSettingsService::getInstance();
}

void onSensorsWSEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){
  if(type == WS_EVT_CONNECT){
    //client connected
    // Serial.printf("ws[%s][%u] connect\n", server->url(), client->id());
    // client->printf("Hello Client %u :)", client->id());
    client->ping();
    WSClientCount++;
  } else if(type == WS_EVT_DISCONNECT){
    //client disconnected
    // Serial.printf("ws[%s][%u] disconnect: %u\n", server->url(), client->id());
    WSClientCount--;
  } else if(type == WS_EVT_ERROR){
    //error was received from the other end
    // Serial.printf("ws[%s][%u] error(%u): %s\n", server->url(), client->id(), *((uint16_t*)arg), (char*)data);
  } else if(type == WS_EVT_PONG){
    //pong message was received (in response to a ping request maybe)
    // Serial.printf("ws[%s][%u] pong[%u]: %s\n", server->url(), client->id(), len, (len)?(char*)data:"");
  }
}

void WeatherServer::configure(){
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    if (WiFi.waitForConnectResult() != WL_CONNECTED) {
        // Serial.printf("WiFi Failed!\n");
        return;
    }

    boolean reconfigureResult=WiFi.config(
      IPAddress(192,168,0,100), IPAddress(192,168,0,1), IPAddress(192,168,0,0));

    if(reconfigureResult){
      // Serial.println("reconfigured to use static IP");
    }else{
      // Serial.println("reconfiguration failed");
    }

    // Serial.print("IP Address: ");
    // Serial.println(WiFi.localIP());

    defineRESTRoutes();    

    sensorsWS.onEvent(onSensorsWSEvent);
    server.addHandler(&sensorsWS);

    // debugWS.onEvent(onDebugWSEvent);
    server.addHandler(appContext->getDebugWebSocket());

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

    server.on("/log", HTTP_GET, [this](AsyncWebServerRequest *request){
        String* respond=appContext->getSensorValuesLogger()->getEntireLogCSV();
        request->send(200, "text/plain", *respond);
        delete respond;
    });

    server.on("/cpuinfo", HTTP_GET, [](AsyncWebServerRequest *request){
        const int capacity=JSON_OBJECT_SIZE(13);
        StaticJsonDocument<capacity>doc;

        doc[F("FreeHeap")]=ESP.getFreeHeap();
        doc[F("HeapFragmentation")]=ESP.getHeapFragmentation();
        doc[F("MaxFreeBlockSize")]=ESP.getMaxFreeBlockSize();
        doc[F("ChipId")]=ESP.getChipId();
        doc[F("CoreVersion")]=ESP.getCoreVersion();
        doc[F("SdkVersion")]=ESP.getSdkVersion();
        doc[F("CpuFreqMHz")]=ESP.getCpuFreqMHz();
        doc[F("SketchSize")]=ESP.getSketchSize();
        doc[F("FreeSketchSpace")]=ESP.getFreeSketchSpace();
        doc[F("FlashChipId")]=ESP.getFlashChipId();
        doc[F("FlashChipSize")]=ESP.getFlashChipSize();
        doc[F("FlashChipRealSize")]=ESP.getFlashChipRealSize();
        doc[F("FlashChipSpeed")]=ESP.getFlashChipSpeed();

        String output="";
        serializeJson(doc, output);
        request->send(200, "application/json", output);
    });

    server.on("/settings", HTTP_GET, [this](AsyncWebServerRequest *request){
        EspSettings settings=appSettingsService->getSettings();

        const int capacity=JSON_OBJECT_SIZE(5);
        StaticJsonDocument<capacity>doc;
        doc[F("logEntriesCount")]=settings.logEntriesCount;
        doc[F("logMsInterval")]=settings.logMsInterval;

        String output="";
        serializeJson(doc, output);
        request->send(200, "application/json", output);
    });

    server.on("/settings", HTTP_POST, [this](AsyncWebServerRequest *request){
        if(request->hasParam("setLogMsInterval", true)
        && request->hasParam("setLogEntriesCount", true)){
            AsyncWebParameter* newLogMsInterval = request->getParam("setLogMsInterval", true);
            AsyncWebParameter* newLogEntriesCount = request->getParam("setLogEntriesCount", true);

            EspSettings newSettings;
            newSettings.logEntriesCount=newLogEntriesCount->value().toInt();
            newSettings.logMsInterval=newLogMsInterval->value().toInt();

            if(appSettingsService->areSettingsValid(newSettings)){
              appSettingsService->setSettings(newSettings);
              if(appSettingsService->writeSettingsToFile()){
                request->send(200);
              }else{
                request->send(500, "application/text", "unable to write settings to file");
              }
            }else{
              request->send(500, "application/text", "invalid settings");
            }
        }else{
          request->send(500, "application/text", "invalid post params");
        }
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
    // Serial.print("Clients: "); Serial.print(WSClientCount);
    // Serial.println();

    String* res=appContext->getSensorValuesLogger()->getNewestEntryJSON();
    sensorsWS.textAll(*res);
    delete res;

    if(WSClientCount>DEFAULT_MAX_WS_CLIENTS){
      sensorsWS.cleanupClients();
    }
  }    
}