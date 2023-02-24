#include <TimeLib.h>

class Device
{
  public:
    int pin;                // pin
    int enable;             // enabled?
    int ON;                 // On or off
    Device(int pinCode, int isEnable, int state);
    void setSchedule();
};
