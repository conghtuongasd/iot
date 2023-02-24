#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>
#include <ArduinoJson.h>
ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
#define USE_SERIAL Serial

void parseData(char *jsonString)
{
  Serial.println(jsonString);
  const size_t capacity = JSON_OBJECT_SIZE(3) + JSON_ARRAY_SIZE(2) + 60;
  DynamicJsonBuffer jsonBuffer(capacity);
  JsonObject &root = jsonBuffer.parseObject(jsonString);
  if (!root.success())
  {
    Serial.println(F("Parsing failed!"));
    return;
  }

  const char *type = root["type"];
  if (strcmp(type, "TOGGLE_PIN") == 0)
  {
    int data = root["pinCode"];
    int value = root["state"];
    digitalWrite(data, !value);
  }
  else if (strcmp(type, "ALL_PINS") == 0)
  {
    JsonArray &datas = root["data"].as<JsonArray>();
    int arrayLength = datas.size();
    for (int i = 0; i < arrayLength; i++)
    {
      JsonObject &pinData = datas[i];
      int pin = pinData["pinCode"];
      int state = pinData["state"];
      digitalWrite(pin, !state);
    }
  }
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{

  switch (type)
  {
    case WStype_DISCONNECTED:
      USE_SERIAL.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
      {
        USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);

        // send message to server when Connected
        webSocket.sendTXT("Connected");
      }
      break;
    case WStype_TEXT:
      USE_SERIAL.printf("[WSc] get text: %s\n", payload);
      parseData((char *)payload);
      break;
    case WStype_BIN:
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      break;
    case WStype_PING:
      // pong will be send automatically
      USE_SERIAL.printf("[WSc] get ping\n");
      break;
    case WStype_PONG:
      // answer to a ping we send
      USE_SERIAL.printf("[WSc] get pong\n");
      break;
  }
}

void setup()
{
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(115200);

  // Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
  pinMode(D5, OUTPUT);
  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);
  pinMode(D8, OUTPUT);
  digitalWrite(D1, HIGH);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, HIGH);
  digitalWrite(D5, HIGH);
  digitalWrite(D6, HIGH);
  digitalWrite(D7, HIGH);
  digitalWrite(D8, HIGH);

  for (uint8_t t = 4; t > 0; t--)
  {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    delay(1000);
  }

  WiFiMulti.addAP("Will", "TanKhanh@@");

  while (WiFiMulti.run() != WL_CONNECTED)
  {
    delay(100);
  }

  webSocket.begin("192.168.1.5", 3000);
  //  webSocket.beginSSL("tough-chiseled-puppet.glitch.me", 443);

  // event handler
  webSocket.onEvent(webSocketEvent);

  // use HTTP Basic Authorization this is optional remove if not needed
  webSocket.setAuthorization("user", "Password");

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);
}

void loop()
{
  webSocket.loop();
}
