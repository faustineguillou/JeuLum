import os

numberEsp = 100

for i in range(1, numberEsp):
    codeEsp = "#include <Arduino.h>\n\n"

    codeEsp += "#include <WiFi.h>\n"
    codeEsp += "#include <HTTPClient.h>\n"
    codeEsp += "#include <ESPAsyncWebServer.h>\n\n"

    codeEsp += "#define RED_PIN1 25\n"
    codeEsp += "#define BLUE_PIN1 27\n"
    codeEsp += "#define GREEN_PIN1 26\n"
    codeEsp += "#define RED_PIN2 18\n"
    codeEsp += "#define BLUE_PIN2 19\n"
    codeEsp += "#define GREEN_PIN2 21\n"
    codeEsp += "#define BUTTON_PIN1 23\n"
    codeEsp += "#define BUTTON_PIN2 33\n"
    codeEsp += "#define ESPNUMBER " + str(i) + "\n\n"

    codeEsp += "const int buttonNumber [2] = {" + str(i*2-1)+", " + str(i*2) + "};\n"
    codeEsp += "const int ledNumber [2] = {" + str(i*2-1)+", " + str(i*2) + "};\n\n"

    codeEsp += "const int led1 [3] = {RED_PIN1, BLUE_PIN1, GREEN_PIN1};\n"
    codeEsp += "const int led2 [3] = {RED_PIN2, BLUE_PIN2, GREEN_PIN2};\n\n"
    codeEsp += "const int* leds [2] = {led1, led2};\n\n"

    codeEsp += "const char* R = \"Red\";\n"
    codeEsp += "const char* G = \"Green\";\n"
    codeEsp += "const char* B = \"Blue\";\n\n"
    
    codeEsp += "AsyncWebServer server(80);\n"

    codeEsp += "String serverName = \"http://192.168.0.100:8102/\";\n"
    codeEsp += "String requestBP = \"bp?esp=\";\n"
    codeEsp += "String bpName = \"&bp=\";\n"
    codeEsp += "String pressedName = \"&pressed=\";\n\n"

    codeEsp += "// Variables will change:\n"
    codeEsp += "int lastState1 = HIGH; int lastState2 = HIGH; // the previous state from the input pin\n"
    codeEsp += "int currentState1; int currentState2;     // the current reading from the input pin\n\n"

    codeEsp += "const char* ssid = \"HeikoFaustine\";\n"
    codeEsp += "const char* password = \"01234567\";\n\n"

    codeEsp += "void connected_to_ap(WiFiEvent_t wifi_event, WiFiEventInfo_t wifi_info){\n\t//Code\n"
    
    codeEsp += "\tSerial.println(\"\\nConnected to the WiFi network\");\n}\n\n"
    
    codeEsp += "void got_ip_from_ap(WiFiEvent_t wifi_event, WiFiEventInfo_t wifi_info){\n"
    codeEsp += "\tSerial.print(\"Local ESP32 IP: \");\n"
    codeEsp += "\tSerial.println(WiFi.localIP());\n}\n\n"

    codeEsp += "void WiFiStationDisconnected(WiFiEvent_t wifi_event, WiFiEventInfo_t wifi_info){\n"
    codeEsp += "\tSerial.print(\"Disconnect from WiFi \");\n"
    codeEsp += "\tSerial.print(\"WiFi lost connection. Reason: \");\n"
    codeEsp += "\tSerial.println(wifi_info.wifi_sta_disconnected.reason);\n"
    codeEsp += "\tSerial.println(\"Trying to Reconnect\");\n"
    codeEsp += "\tWiFi.begin(ssid, password);\n}\n\n"

    codeEsp += "void notFound(AsyncWebServerRequest *request) {\n"
    codeEsp += "\trequest->send(404, \"text/plain\", \"Not found\");\n}\n\n"

    codeEsp += "void sendGetRequest(String getRequest){\n"
    codeEsp += "\tHTTPClient http;\n\n"

    codeEsp += "\tString serverPath = getRequest;\n"
    codeEsp += "\tSerial.println(serverPath);\n"
    codeEsp += "\thttp.begin(serverPath.c_str());\n\n"

    codeEsp += "\tint httpResponseCode = http.GET();\n"
    codeEsp += "\tif (httpResponseCode>0) {\n"
    codeEsp += "\t\tSerial.print(\"HTTP Response code: \");\n"
    codeEsp += "\t\tSerial.println(httpResponseCode);\n"
    codeEsp += "\t\tString payload = http.getString();\n"
    codeEsp += "\t\tSerial.println(payload);\n\t}\n"
    codeEsp += "\telse{\n"
    codeEsp += "\t\tSerial.print(\"Error code: \");\n"
    codeEsp += "\t\tSerial.println(httpResponseCode);\n\t}\n"
    codeEsp += "\thttp.end();\n}\n\n"

    codeEsp += "void switchOnRed(int led, boolean value){\n"
    codeEsp += "\tif(led==1){\n"
    codeEsp += "\t\tdigitalWrite(RED_PIN1, value);\n\t}\n"
    codeEsp += "\telse if(led==2){\n"
    codeEsp += "\t\tdigitalWrite(RED_PIN2, value);\n\t}\n}\n\n"

    codeEsp += "void switchOnBlue(int led, boolean value){\n"
    codeEsp += "\tif(led==1){\n"
    codeEsp += "\t\tdigitalWrite(BLUE_PIN1, value);\n\t}\n"
    codeEsp += "\telse if(led==2){\n"
    codeEsp += "\t\tdigitalWrite(BLUE_PIN2, value);\n\t}\n}\n\n"

    codeEsp += "void switchOnGreen(int led, boolean value){\n"
    codeEsp += "\tif(led==1){\n"
    codeEsp += "\t\tdigitalWrite(GREEN_PIN1, value);\n\t}\n"
    codeEsp += "\telse if(led==2){\n"
    codeEsp += "\t\tdigitalWrite(GREEN_PIN2, value);\n\t}\n}\n\n"

    codeEsp += "void loop() {\n\n"

    codeEsp += "\tcurrentState1 = digitalRead(BUTTON_PIN1);\n"
    codeEsp += "\tcurrentState2 = digitalRead(BUTTON_PIN2);\n\n"

    codeEsp += "\tif(lastState1 == LOW && currentState1 == HIGH) {\n"
    codeEsp += "\t\tSerial.println(\"The state changed from LOW to HIGH, BP1\");\n"
    codeEsp += "\t\tif(WiFi.status()== WL_CONNECTED){\n"
    codeEsp += "\t\t\tString request = serverName + requestBP + ESPNUMBER + bpName + \"1\" + pressedName + \"1\";\n"
    codeEsp += "\t\t\tsendGetRequest(request);\n\t\t}\n\t}\n\n"

    codeEsp += "\tif(lastState2 == LOW && currentState2 == HIGH) {\n"
    codeEsp += "\t\tSerial.println(\"The state changed from LOW to HIGH, BP1\");\n"
    codeEsp += "\t\tif(WiFi.status()== WL_CONNECTED){\n"
    codeEsp += "\t\t\tString request = serverName + requestBP + ESPNUMBER + bpName + \"2\" + pressedName + \"1\";\n"
    codeEsp += "\t\t\tsendGetRequest(request);\n\t\t}\n\t}\n\n"

    if(i == 1):
        codeEsp += "\t//Boucle if juste pour l'ESP 1 pour lancer le jeu de réflexe en faisant une requete start, il suffit d'appuyer sur les 2 buttons\n"
        codeEsp += "\tif((lastState1 == LOW && currentState1 == HIGH) && (lastState2 == LOW && currentState2 == HIGH)){\n"
        codeEsp += "\t\tSerial.println(\"Request to launch game\");\n"
        codeEsp += "\t\tif(WiFi.status()== WL_CONNECTED){\n"
        codeEsp += "\t\t\tString request = serverName + \"start\";\n"
        codeEsp += "\t\t\tsendGetRequest(request);\n\t\t}\n\t}\n\n"

    codeEsp += "\tlastState1 = currentState1;\n"
    codeEsp += "\tlastState2 = currentState2;\n"
    codeEsp += "\tdelay(100);\n}\n\n"

    codeEsp += "void setup() {\n"
    codeEsp += "\tSerial.begin(115200);\n"
    codeEsp += "\t// initialize the pushbutton pin as an pull-up input\n"
    codeEsp += "\tpinMode(BUTTON_PIN1, INPUT_PULLUP);\n"
    codeEsp += "\tpinMode(BUTTON_PIN2, INPUT_PULLUP);\n"
    codeEsp += "\tpinMode(RED_PIN1, OUTPUT);\n"
    codeEsp += "\tpinMode(GREEN_PIN1, OUTPUT);\n"
    codeEsp += "\tpinMode(BLUE_PIN1, OUTPUT);\n"
    codeEsp += "\tpinMode(RED_PIN2, OUTPUT);\n"
    codeEsp += "\tpinMode(GREEN_PIN2, OUTPUT);\n"
    codeEsp += "\tpinMode(BLUE_PIN2, OUTPUT);\n"
    codeEsp += "\tdigitalWrite(RED_PIN1, LOW);\n"
    codeEsp += "\tdigitalWrite(GREEN_PIN1, LOW);\n"
    codeEsp += "\tdigitalWrite(RED_PIN1, LOW);\n"
    codeEsp += "\tdigitalWrite(RED_PIN2, LOW);\n"
    codeEsp += "\tdigitalWrite(GREEN_PIN2, LOW);\n"
    codeEsp += "\tdigitalWrite(RED_PIN2, LOW);\n"
    codeEsp += "\tWiFi.begin(ssid, password);\n"
    codeEsp += "\tWiFi.mode(WIFI_STA); //Optional\n"
    codeEsp += "\tWiFi.onEvent(connected_to_ap,  WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED );\n"
    codeEsp += "\tWiFi.onEvent(got_ip_from_ap, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);\n"
    codeEsp += "\tWiFi.onEvent(WiFiStationDisconnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);\n"

    codeEsp += "\tserver.on(\"/\", HTTP_GET, [](AsyncWebServerRequest *request){\n\n"

    codeEsp += "\t\tint paramsNr = request->params();\n"
    codeEsp += "\t\tint led = request->getParam(0)->value().toInt();\n\n"

    codeEsp += "\t\tfor(int i=1;i<paramsNr;i++){\n"
    codeEsp += "\t\t\tAsyncWebParameter* p = request->getParam(i);\n"
    codeEsp += "\t\t\tString name = p->name();\n"
    codeEsp += "\t\t\tboolean value = p->value().toInt()\n"
    codeEsp += "\t\t\tif(name == R){\n"
    codeEsp += "\t\t\t\tswitchOnRed(led, value);\n\t\t\t}\n"
    codeEsp += "\t\t\telse if(name == B){\n"
    codeEsp += "\t\t\t\tswitchOnBlue(led, value);\n\t\t\t}\n"
    codeEsp += "\t\t\telse if(name == G){\n"
    codeEsp += "\t\t\t\tswitchOnGreen(led, value);\n\t\t\t}\n\t\t}\n\n"

    codeEsp += "\t\trequest->send(200, \"text/plain\", \"message received\");\n\t});\n"

    codeEsp += "\tserver.begin();\n}"

    if(os.path.exists("./CodeEsp/Esp"+str(i)) == False):
        os.mkdir("./CodeEsp/Esp"+str(i))

    f = open("./CodeEsp/Esp"+str(i)+"/main.cpp", "w")

    f.write(codeEsp)

    f.close()