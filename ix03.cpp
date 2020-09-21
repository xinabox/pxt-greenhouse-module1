#include "ix03.h"

uint8_t i2cwrite(uint16_t address, uint8_t reg, uint8_t *data, int len)
{
    int i2c_error_status = 0;
#ifdef CODAL_I2C
    auto sda = LOOKUP_PIN(SDA);
    auto scl = LOOKUP_PIN(SCL);
    codal::I2C *i2c = pxt::getI2C(sda, scl);
#endif
    uint8_t val[len + 1];
    val[0] = reg;
    for (uint8_t i = 0; i < len; i++)
    {
        val[i + 1] = data[i];
    }
#ifdef CODAL_I2C
    return i2c_error_status = i2c->write((uint16_t)address, (uint8_t *)&val, len + 1, false);
#else
    return i2c_error_status = uBit.i2c.write(address, (const char *)&val, len + 1, false);
#endif
}

uint8_t i2cread(uint16_t address, uint8_t reg, uint8_t *data, int len)
{
    uint8_t val[1] = {reg};
#ifdef CODAL_I2C
    auto sda = LOOKUP_PIN(SDA);
    auto scl = LOOKUP_PIN(SCL);
    codal::I2C *i2c = pxt::getI2C(sda, scl);
#endif
    int i2c_error_status = 0;

#ifdef CODAL_I2C
    i2c_error_status = i2c->write((uint16_t)address, (uint8_t*)&reg, 1, true);
#else
    i2c_error_status = uBit.i2c.write(address, (const char *)&val, 1, true);
#endif

#ifdef CODAL_I2C
    return i2c_error_status = i2c->read((uint16_t)address, (uint8_t*)&data, len, false);
#else
    return i2c_error_status = uBit.i2c.read(address, (char *)data, len, false);
#endif
}

void delay(uint16_t time_ms)
{
#ifdef CODAL_I2C
    sleep_ms(time_ms);
#else
    uBit.sleep(time_ms);
#endif
}

xIX03::xIX03()
{
    i2cAddr = SC16IS740_I2C_ADDR << 1;
}

xIX03::xIX03(uint8_t addr)
{
    i2cAddr = addr << 1;
}

bool xIX03::begin(uint16_t baudRate)
{
    resetDevice();
    FIFOEnable(1);
    setBaudRate(baudRate);
    config();
    return true;
}

void xIX03::config()
{
    writeByte(SC16IS740_LCR, 0x03); // SERIAL_8N1
}

void xIX03::setBaudRate(uint16_t baudRate)
{
    uint8_t old_data, new_data;
    uint16_t divisor = (uint16_t)((1.8432 * 1000000UL) / (baudRate * 16));
    uint8_t baud_low = (uint8_t)(divisor);
    uint8_t baud_hi = (uint8_t)(divisor >> 8);
    old_data = readByte(SC16IS740_LCR);
    new_data |= 0x80;
    writeByte(SC16IS740_LCR, new_data);
    writeByte(SC16IS740_DLL, baud_low);
    writeByte(SC16IS740_DLH, baud_hi);
    writeByte(SC16IS740_LCR, 0x7F);
}

void xIX03::resetDevice()
{
    uint8_t reg;
    reg = readByte(SC16IS740_IOCONTROL);
    reg |= 0x08;
    writeByte(SC16IS740_IOCONTROL, reg);
}

bool xIX03::ping()
{
    writeByte(SC16IS740_SPR, 0x99);
    if (readByte(SC16IS740_SPR) != 0x99)
        return false;
    return true;
}

void xIX03::FIFOEnable(uint8_t fifo_enable)
{
    uint8_t temp_fcr = readByte(SC16IS740_FCR);
    if (fifo_enable == 0)
        temp_fcr &= ~(1 << 1);
    else
        temp_fcr |= 1 << 1;
    writeByte(SC16IS740_FCR, temp_fcr);
    return;
}

bool xIX03::readLSR()
{
    uint8_t tmp_lsr;
    do
    {
        tmp_lsr = readByte(SC16IS740_LSR);
    } while ((tmp_lsr & 0x20) == 0);
    return true;
}

void xIX03::write(uint8_t val)
{
    if (readLSR())
        writeByte(SC16IS740_THR, val);
}

void xIX03::write(const char *str)
{
    if (readLSR())
        writeBlock(SC16IS740_THR, (uint8_t *)str, 20);
}

void xIX03::write(const uint8_t *buffer, uint8_t size)
{
    if (readLSR())
        writeBlock(SC16IS740_THR, (uint8_t *)buffer, size);
}

void xIX03::write(const char *buffer, uint8_t size)
{
    if (readLSR())
        writeBlock(SC16IS740_THR, (uint8_t *)buffer, size);
}

void xIX03::flush()
{
    uint8_t reg = readByte(SC16IS740_FCR);
    writeByte(SC16IS740_FCR, reg | 0x06);
}

uint8_t xIX03::available()
{
    return readByte(SC16IS740_RXLVL);
}

uint8_t xIX03::availableForWrite()
{
    return 64 - readByte(SC16IS740_TXLVL);
}

uint8_t xIX03::read()
{
    if (available() == 0)
        return 0;
    return readByte(SC16IS740_RHR);
}

void xIX03::end()
{
}

void xIX03::pinMode(uint8_t pin, uint8_t mode)
{
    uint8_t _reg = readByte(SC16IS740_IODIR);
    if (mode == OUTPUT)
    {
        _reg |= 1 << pin;
    }
    else
    {
        _reg &= ~(1 << pin);
    }
    writeByte(SC16IS740_IODIR, _reg);
}
void xIX03::digitalWrite(uint8_t pin, uint8_t state)
{
    uint8_t _reg = readByte(SC16IS740_IOSTATE);
    if (state == HIGH)
    {
        _reg |= 1 << pin;
    }
    else
    {
        _reg &= ~(1 << pin);
    }
    writeByte(SC16IS740_IOSTATE, _reg);
}
bool xIX03::digitalRead(uint8_t pin)
{
    uint8_t _reg = readByte(SC16IS740_IOSTATE);
    return (_reg & pin) >> pin;
}

void xIX03::writeByte(uint8_t reg, uint8_t val)
{
    uint8_t k[2] = {reg << 3, val};
#ifdef CODAL_I2C
    auto sda = LOOKUP_PIN(SDA);
    auto scl = LOOKUP_PIN(SCL);
    codal::I2C *i2c = pxt::getI2C(sda, scl);
    i2c->write(i2cAddr, (uint8_t *)k, 2, false);
#else
    uBit.i2c.write(i2cAddr, (const char *)k, 2, false);
#endif
}

uint8_t xIX03::readByte(uint8_t reg)
{
    uint8_t val[1] = {reg << 3};
#ifdef CODAL_I2C
    uint8_t data;
#else
    char data;
#endif

#ifdef CODAL_I2C
    auto sda = LOOKUP_PIN(SDA);
    auto scl = LOOKUP_PIN(SCL);
    codal::I2C *i2c = pxt::getI2C(sda, scl);
    i2c->write(i2cAddr, (uint8_t *)val, 1, true);
    i2c->read(i2cAddr, &data, 1, false);
#else
    uBit.i2c.write(i2cAddr, (const char *)val, 1, true);
    uBit.i2c.read(i2cAddr, &data, 1, false);
#endif
    return (uint8_t)data;
}

void xIX03::writeBlock(uint8_t reg, uint8_t *val, uint8_t len)
{
    i2cwrite(i2cAddr, reg << 3, val, len);
    delay(100);
}
