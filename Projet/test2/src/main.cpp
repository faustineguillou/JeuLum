#include <Arduino.h>

#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPAsyncWebServer.h>

#define RED_PIN 25
#define GREEN_PIN 27
#define BLUE_PIN 26
#define BUTTON_PIN 23

const char* R = "Red";
const char* G = "Green";
const char* B = "Blue";

AsyncWebServer server(80);

String serverName = "http://192.168.0.101:8102/bp?pressed=";

// Variables will change:
int lastState = HIGH; // the previous state from the input pin
int currentState;     // the current reading from the input pin

const char* ssid = "HeikoFaustine";
const char* password = "01234567";

void connected_to_ap(WiFiEvent_t wifi_event, WiFiEventInfo_t wifi_info){
  //Code
  Serial.println("\nConnected to the WiFi network");
}

void got_ip_from_ap(WiFiEvent_t wifi_event, WiFiEventInfo_t wifi_info){
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
}


void WiFiStationDisconnected(WiFiEvent_t wifi_event, WiFiEventInfo_t wifi_info){
  Serial.print("Disconnect from WiFi ");
  Serial.print("WiFi lost connection. Reason: ");
  Serial.println(wifi_info.wifi_sta_disconnected.reason);
  Serial.println("Trying to Reconnect");
  WiFi.begin(ssid, password);
}

void notFound(AsyncWebServerRequest *request) {
  request->send(404, "text/plain", "Not found");
}

void loop() {

  currentState = digitalRead(BUTTON_PIN);

  if(lastState == LOW && currentState == HIGH) {
    Serial.println("The state changed from LOW to HIGH");
    digitalWrite(19, HIGH);
    if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;

      String serverPath = serverName + "1";
      Serial.println(serverPath);
      http.begin(serverPath.c_str());

      int httpResponseCode = http.GET();
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
      }
    }
  lastState = currentState;
  delay(100);
}

void setup() {
  Serial.begin(115200);
  // initialize the pushbutton pin as an pull-up input
  
  
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  digitalWrite(RED_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(RED_PIN, LOW);
  WiFi.begin(ssid, password);
  WiFi.mode(WIFI_STA); //Optional
  WiFi.onEvent(connected_to_ap,  WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED );
  WiFi.onEvent(got_ip_from_ap, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(WiFiStationDisconnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
 
    int paramsNr = request->params();
    Serial.println(paramsNr);

    for(int i=0;i<paramsNr;i++){
 
        AsyncWebParameter* p = request->getParam(i);
        if(p->name() == R)
        {
          if(p->value() == "0")
          {
            digitalWrite(RED_PIN, LOW);
          }
          else
          {
            digitalWrite(RED_PIN, HIGH);
          }
        }
        else if(p->name() == B)
        {
          if(p->value() == "0")
          {
            digitalWrite(BLUE_PIN, LOW);
          }
          else
          {
            digitalWrite(BLUE_PIN, HIGH);
          }
        }
        else if(p->name() == G)
        {
          if(p->value() == "0")
          {
            digitalWrite(GREEN_PIN, LOW);
          }
          else
          {
            digitalWrite(GREEN_PIN, HIGH);
          }
        }
    }
 
    request->send(200, "text/plain", "message received");
  });

  server.on("/chcouleur", HTTP_GET, [](AsyncWebServerRequest *request){
 
    int paramsNr = request->params();
    Serial.println(paramsNr);

    for(int i=0;i<paramsNr;i++){
 
        AsyncWebParameter* p = request->getParam(i);
        if(p->name() == Red)
        {
          if(p->value() == "0")
          {
            digitalWrite(RED_PIN, LOW);
          }
          else
          {
            digitalWrite(RED_PIN, HIGH);
          }
        }
        else if(p->name() == Blue)
        {
          if(p->value() == "0")
          {
            digitalWrite(BLUE_PIN, LOW);
          }
          else
          {
            digitalWrite(BLUE_PIN, HIGH);
          }
        }
        else if(p->name() == Green)
        {
          if(p->value() == "0")
          {
            digitalWrite(GREEN_PIN, LOW);
          }
          else
          {
            digitalWrite(GREEN_PIN, HIGH);
          }
        }
    }
 
    request->send(200, "text/plain", "message received");
  });
 
  server.begin();

}