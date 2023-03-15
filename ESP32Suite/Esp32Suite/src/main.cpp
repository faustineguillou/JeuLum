//https://techtutorialsx.com/2022/01/17/esp32-chat-application-part-1/
//https://techtutorialsx.com/2017/11/01/esp32-arduino-websocket-client/

#include <Arduino.h>
#include <WebSocketClient.h>

#include <WiFi.h>
#include <ESPAsyncWebServer.h>

const char* ssid = "HeikoFaustine";
const char* password =  "01234567";

AsyncWebServer server(80);

AsyncWebSocket ws("/chat");

AsyncWebSocketClient wc;

void loop(){
  
}

void setup(){
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
    
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
    
  Serial.println(WiFi.localIP());

  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  
  server.begin();
}

void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){
   if(type == WS_EVT_CONNECT){
    Serial.println("Websocket client connection received");  
  }
  else if(type == WS_EVT_DISCONNECT){
    Serial.println("Client disconnected");
  } 
}