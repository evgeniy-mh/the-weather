#include "AppContext.h"

AppContext* AppContext::instance = 0;
AppContext* AppContext::getInstance(){
    if (instance == 0)
    {
        instance = new AppContext();
    }
    return instance;
}

void onDebugWSEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){
  if(type == WS_EVT_CONNECT){
    client->ping();
    client->printf("oh, hello there");
  } else if(type == WS_EVT_DISCONNECT){
  } else if(type == WS_EVT_ERROR){

  } else if(type == WS_EVT_PONG){

  }
}

AppContext::AppContext(){
    appSettings=PersistantSettingsService::getInstance();
    sensorValuesLogger=new SensorValuesLogger(appSettings->getSettings().logEntriesCount);
    debugWS=new AsyncWebSocket(F("/debug"));
    debugWS->onEvent(onDebugWSEvent);
    lcd128x64=new LCD128x64();
}

AsyncWebSocket* AppContext::getDebugWebSocket(){
    return debugWS;
}

SensorValuesLogger* AppContext::getSensorValuesLogger() {
    return sensorValuesLogger;
}

LCD128x64* AppContext::getLCD128x64(){
    return lcd128x64;
}

void AppContext::sendDebugMessage(char* mes){
    debugWS->printfAll(mes);
}

void AppContext::displayInfoOnLCD128x64(){
    SensorValues currentValues=sensorValuesLogger->getNewestSensorValues();
    lcd128x64->printData(
        "IP: 192.168.0.100",
        currentValues.co2,
        currentValues.temp,
        currentValues.humid
    );
}