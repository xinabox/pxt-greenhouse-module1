#ifndef PMS_H
#define PMS_H

#include "pxt.h"
#include "ix03.h"

using namespace pxt;

#define STATUS_OK 1
#define STATUS_WAITING 0
#define MODE_ACTIVE 0
#define MODE_PASSIVE 1

class PMS
{
public:
  static const uint16_t SINGLE_RESPONSE_TIME = 1000;
  static const uint16_t TOTAL_RESPONSE_TIME = 1000 * 10;
  static const uint16_t STEADY_RESPONSE_TIME = 1000 * 30;

  static const uint16_t BAUD_RATE = 9600;

  struct DATA {
    uint16_t PM_SP_UG_1_0;
    uint16_t PM_SP_UG_2_5;
    uint16_t PM_SP_UG_10_0;

    uint16_t PM_AE_UG_1_0;
    uint16_t PM_AE_UG_2_5;
    uint16_t PM_AE_UG_10_0;
  };

  PMS();
  void sleep();
  void wakeUp();
  void activeMode();
  void passiveMode();
  void begin();

  void requestRead();
  bool read(DATA &data);
  bool readUntil(DATA &data, uint16_t timeout = SINGLE_RESPONSE_TIME);

private:

//   enum STATUS { STATUS_WAITING, STATUS_OK };
//   enum MODE { MODE_ACTIVE, MODE_PASSIVE };

  uint8_t _payload[12];
  xIX03 ix;
  xIX03 *_stream = &ix;
  DATA* _data;
  uint8_t _status;
  uint8_t _mode = MODE_ACTIVE;

  uint8_t _index = 0;
  uint16_t _frameLen;
  uint16_t _checksum;
  uint16_t _calculatedChecksum;
  void loop();
};

#endif