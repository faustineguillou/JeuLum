#include <Arduino.h>

#define RED_PIN1 25
#define BLUE_PIN1 26
#define GREEN_PIN1 27
#define RED_PIN2 18
#define BLUE_PIN2 21
#define GREEN_PIN2 19
#define BUTTON_PIN1 23
#define BUTTON_PIN2 33

const char* R = "Red";
const char* G = "Green";
const char* B = "Blue";

int currentState1; int currentState2;
int lastState1 = HIGH; int lastState2 = HIGH;

void loop() {
  currentState1 = digitalRead(BUTTON_PIN1);
  currentState2 = digitalRead(BUTTON_PIN2);
  if(lastState1 == LOW && currentState1 == HIGH)
  {
    Serial.println("The state changed from LOW to HIGH, BP1");
    if(digitalRead(RED_PIN1) == HIGH)
    {
      digitalWrite(RED_PIN1, LOW);
    }
    else
    {
      digitalWrite(RED_PIN1, HIGH);
    }
  }

  if(lastState2 == LOW && currentState2 == HIGH)
  {
    Serial.println("The state changed from LOW to HIGH, BP2");
    if(digitalRead(RED_PIN2) == HIGH)
    {
      digitalWrite(RED_PIN2, LOW);
    }
    else
    {
      digitalWrite(RED_PIN2, HIGH);
    }
  }

  lastState1 = currentState1;
  lastState2 = currentState2;
  delay(100);
}

void setup() {

  Serial.begin(9600);

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
}