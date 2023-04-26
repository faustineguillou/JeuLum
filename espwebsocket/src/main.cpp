//https://techtutorialsx.com/2022/01/17/esp32-chat-application-part-1/
//https://techtutorialsx.com/2017/11/01/esp32-arduino-websocket-client/

#include <Arduino.h>
#include <WebSocketsClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

const char* ssid = "HeikoFaustine";
const char* password =  "01234567";

#define USE_SERIAL Serial

#define RED_PIN1 25
#define BLUE_PIN1 27
#define GREEN_PIN1 26
#define RED_PIN2 18
#define BLUE_PIN2 19
#define GREEN_PIN2 21
#define BUTTON_PIN1 23
#define BUTTON_PIN2 33
#define ESPNUMBER 1

WebSocketsClient webSocket;

const int buttonNumber [2] = {1, 2};
const int ledNumber [2] = {1, 2};

// Variables will change:
int lastState1 = HIGH; int lastState2 = HIGH; // the previous state from the input pin
int currentState1; int currentState2;     // the current reading from the input pin
int game = 0;
StaticJsonDocument<500> jsonBuffer;
DeserializationError error;

//SWITCH ON-OFF LES LEDS EN FONCTION DU BOUTON 

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

//WEBSOCKET EVENT

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length){
    switch(type) {
		case WStype_DISCONNECTED:
			USE_SERIAL.printf("[WSc] Disconnected!\n");
			break;
		case WStype_CONNECTED:
			USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);

			// send message to server when Connected
			//webSocket.sendTXT("Connected");
			break;
		case WStype_TEXT: //LE CLIENT RECOIT UN MESSAGE EN JSON
			USE_SERIAL.printf("[WSc] get text: %s\n", payload);

      error = deserializeJson(jsonBuffer, payload);

      if(jsonBuffer["end"] == 1)
      {
        game = 0;
      }

      if(game == 1)
      {
        if(jsonBuffer["esp"] == ESPNUMBER && jsonBuffer["for"] == "esp")
        {
          switchOnBlue(jsonBuffer["led"], jsonBuffer["action"]);
        }
      }
      else if(game == 2)
      {
        if(jsonBuffer["for"] == "esp" && (jsonBuffer["led"] == ledNumber[0] || jsonBuffer["led"] == ledNumber[1]))
        {
          if(jsonBuffer["color"] == "blue")
          {
            switchOnBlue(jsonBuffer["led"], jsonBuffer["action"]);
          }
          else if(jsonBuffer["color"] == "red")
          {
            switchOnRed(jsonBuffer["led"], jsonBuffer["action"]);
          }
          else if(jsonBuffer["color"] == "green")
          {
            switchOnGreen(jsonBuffer["led"], jsonBuffer["action"]);
          }
        }
      }
			// send message to server
			// webSocket.sendTXT("message here");
			break;
		case WStype_BIN:
			USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
			//hexdump(payload, length);

			// send data to server
			// webSocket.sendBIN(payload, length);
			break;
		case WStype_ERROR:			
		case WStype_FRAGMENT_TEXT_START:
		case WStype_FRAGMENT_BIN_START:
		case WStype_FRAGMENT:
		case WStype_FRAGMENT_FIN:
			break;
	}
}

void loop(){
  webSocket.loop();

  currentState1 = digitalRead(BUTTON_PIN1);
  currentState2 = digitalRead(BUTTON_PIN2);

  if(game == 1)
  {
    if(lastState1 == LOW && currentState1 == HIGH) { //SI LE BP 1 DE L'ESP EST APPUYE
      Serial.println("The state changed from LOW to HIGH, BP1");
      if(WiFi.status()== WL_CONNECTED)
      {
        String request = "{\"type\" : \"esp\", \"game\" : 1, \"esp\" : " + String(ESPNUMBER) + ", \"bp\" : 1}";
        webSocket.sendTXT(request); //ENVOIE LA REQUETE AU SERVEUR
      }
    }
    if(lastState2 == LOW && currentState2 == HIGH) { //SI LE BP 2 DE L'ESP EST APPUYE
      Serial.println("The state changed from LOW to HIGH, BP2");
      if(WiFi.status()== WL_CONNECTED)
      {
        String request = "{\"type\" : \"esp\", \"game\" : 1, \"esp\" : " + String(ESPNUMBER) + ", \"bp\" : 2}";
        webSocket.sendTXT(request); //ENVOIE LA REQUETE AU SERVEUR
      }
    }
  }
  else if (game == 2)
  {
    if(lastState1 == LOW && currentState1 == HIGH) { //SI LE BP 1 DE L'ESP EST APPUYE
      Serial.println("The state changed from LOW to HIGH, BP1");
      if(WiFi.status()== WL_CONNECTED)
      {
        String request = "{\"type\" : \"esp\", \"game\" : 2, \"led\" : " + String(ledNumber[0]) + "}";
        webSocket.sendTXT(request); //ENVOIE LA REQUETE AU SERVEUR
      }
    }
    if(lastState2 == LOW && currentState2 == HIGH) { //SI LE BP 2 DE L'ESP EST APPUYE
      Serial.println("The state changed from LOW to HIGH, BP2");
      if(WiFi.status()== WL_CONNECTED)
      {
        String request = "{\"type\" : \"esp\", \"game\" : 2, \"led\" : " + String(ledNumber[1]) + "}";
        webSocket.sendTXT(request); //ENVOIE LA REQUETE AU SERVEUR
      }
    }
  }
  


  //CONDITION PERMETTANT DE LANCER LA PARTIE SI ON APPUIE SUR LES 2 BOUTONS DE L'ESP 1
  if(game == 0)
  {
    if((lastState1 == LOW && currentState1 == HIGH) && (lastState2 == LOW && currentState2 == HIGH))
    {
      Serial.println("Request to launch game");
      if(WiFi.status() == WL_CONNECTED)
      {
        game = 2;
        String request = "{\"type\" : \"esp\", \"esp\" : " + String(ESPNUMBER) + ", \"game\" : 0}";
        webSocket.sendTXT(request);
      }
    }
  }

  lastState1 = currentState1;
  lastState2 = currentState2;
  delay(100);
}

void setup(){
  Serial.begin(115200);

  //INITIALISE LES PINS LEDS ET BOUTONS
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
  
  //CONNECTION AU WIFI
  WiFi.begin(ssid, password);
    
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
    
  Serial.println(WiFi.localIP());

  webSocket.begin("192.168.0.104", 3000, "/");
  
  webSocket.onEvent(webSocketEvent);

  webSocket.setReconnectInterval(5000);
}