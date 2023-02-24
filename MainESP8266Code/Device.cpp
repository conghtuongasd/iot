#include "Device.h"
#include <Arduino.h>
#define USE_SERIAL Serial

Device::Device(int pinCode, int isEnable, int state) {
  pin = pinCode;
  enable = isEnable;
  ON = state;
}

void Device::setSchedule() {
  Serial.println(pin);
  Serial.println(ON);
  if (enable) {
    digitalWrite(pin, !ON);
  }
}
