#include <Arduino.h>

#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPAsyncWebServer.h>

#define RED_PIN1 25
#define BLUE_PIN1 27
#define GREEN_PIN1 26
#define RED_PIN2 18
#define BLUE_PIN2 19
#define GREEN_PIN2 21
#define BUTTON_PIN1 23
#define BUTTON_PIN2 33
#define ESPNUMBER 1

const int buttonNumber [2] = {1, 2};
const int ledNumber [2] = {1, 2};

const int led1 [3] = {RED_PIN1, BLUE_PIN1, GREEN_PIN1};
const int led2 [3] = {RED_PIN2, BLUE_PIN2, GREEN_PIN2};

const int* leds [2] = {led1, led2};

const char* R = "Red";
const char* G = "Green";
const char* B = "Blue";

AsyncWebServer server(80);

String serverName = "http://192.168.0.100:8102/";
String requestBP = "bp?esp=";
String bpName = "&bp=";
String pressedName = "&pressed=";

// Variables will change:
int lastState1 = HIGH; int lastState2 = HIGH; // the previous state from the input pin
int currentState1; int currentState2;     // the current reading from the input pin

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

void sendGetRequest(String getRequest)
{
  HTTPClient http;

  String serverPath = getRequest; //serverName + ESPNUMBER + bpName + buttonNumber + pressedName + "1";
  Serial.println(serverPath);
  http.begin(serverPath.c_str());

  int httpResponseCode = http.GET();
  if (httpResponseCode>0) 
  {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else 
  {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void switchOnRed(int led, boolean value)
{
  if(led==1)
  {
    digitalWrite(RED_PIN1, value);
  }
  else if(led==2)
  {
    digitalWrite(RED_PIN2, value);
  }
}

void switchOnBlue(int led, boolean value)
{
  if(led==1)
  {
    digitalWrite(BLUE_PIN1, value);
  }
  else if(led==2)
  {
    digitalWrite(BLUE_PIN2, value);
  }
}

void switchOnGreen(int led, boolean value)
{
  if(led==1)
  {
    digitalWrite(GREEN_PIN1, value);
  }
  else if(led==2)
  {
    digitalWrite(GREEN_PIN2, value);
  }
}

void loop() {

  currentState1 = digitalRead(BUTTON_PIN1);
  currentState2 = digitalRead(BUTTON_PIN2);

  if(lastState1 == LOW && currentState1 == HIGH) {
    Serial.println("The state changed from LOW to HIGH, BP1");
    if(WiFi.status()== WL_CONNECTED)
    {
      String request = serverName + requestBP + ESPNUMBER + bpName + "1" + pressedName + "1";
      sendGetRequest(request);
    }
  }
  if(lastState2 == LOW && currentState2 == HIGH) {
    Serial.println("The state changed from LOW to HIGH, BP2");
    if(WiFi.status()== WL_CONNECTED)
    {
      String request = serverName + requestBP + ESPNUMBER + bpName + "2" + pressedName + "1";
      sendGetRequest(request);
    }
  }

  //Boucle if juste pour l'ESP 1 pour lancer le jeu de réflexe en faisant une requete start, il suffit d'appuyer sur les 2 buttons
  if((lastState1 == LOW && currentState1 == HIGH) && (lastState2 == LOW && currentState2 == HIGH))
  {
    Serial.println("Request to launch game");
    if(WiFi.status() == WL_CONNECTED)
    {
      String request = serverName + "start";
      sendGetRequest(request);
    }
  }

  lastState1 = currentState1;
  lastState2 = currentState2;
  delay(100);
}

void setup() {
  Serial.begin(115200);
  // initialize the pushbutton pin as an pull-up input
  pinMode(BUTTON_PIN1, INPUT_PULLUP);
  pinMode(BUTTON_PIN2, INPUT_PULLUP);
  pinMode(RED_PIN1, OUTPUT);
  pinMode(GREEN_PIN1, OUTPUT);
  pinMode(BLUE_PIN1, OUTPUT);
  pinMode(RED_PIN2, OUTPUT);
  pinMode(GREEN_PIN2, OUTPUT);
  pinMode(BLUE_PIN2, OUTPUT);
  digitalWrite(RED_PIN1, LOW);
  digitalWrite(GREEN_PIN1, LOW);
  digitalWrite(RED_PIN1, LOW);
  digitalWrite(RED_PIN2, LOW);
  digitalWrite(GREEN_PIN2, LOW);
  digitalWrite(RED_PIN2, LOW);
  WiFi.begin(ssid, password);
  WiFi.mode(WIFI_STA); //Optional
  WiFi.onEvent(connected_to_ap,  WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED );
  WiFi.onEvent(got_ip_from_ap, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(WiFiStationDisconnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
 
    int paramsNr = request->params();
    int led = request->getParam(0)->value().toInt();

    for(int i=1;i<paramsNr;i++){
        AsyncWebParameter* p = request->getParam(i);
        String name = p->name();
        boolean value = p->value().toInt();
        if(name == R)
        {
          switchOnRed(led, value);
        }
        else if(name == B)
        {
          switchOnBlue(led, value);
        }
        else if(name == G)
        {
          switchOnGreen(led, value);
        }
    }
 
    request->send(200, "text/plain", "message received");
  });
 
  server.begin();

}