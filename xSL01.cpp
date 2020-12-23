/*
	This is a library for the SL01 Digital Light Sensor
	breakout board.
	The board uses I2C for communication.

	The board communicates with two I2C devices:
	* 	VEML6075
	*	TSL4531

	Data Sheets:
	VEML6075	- http://www.vishay.com/docs/84304/veml6075.pdf
	VEML6075 Note	- https://www.vishay.com/docs/84339/designingveml6075.pdf
	TSL4531		- http://wisense.in/datasheets/TSL4531.pdf
*/

#include "xSL01.h"

#if MICROBIT_CODAL
#define BUFFER_TYPE uint8_t*
#else
#define BUFFER_TYPE char*
#endif

/*---Public Function---*/
/********************************************************
 	Constructor
*********************************************************/
SL01v1::SL01v1(void)
{
	VEML6075_I2C_ADDRESS = 0x10;
	TSL4531_I2C_ADDRESS = 0x29;
	UVAintensity = 0.0;
	UVBintensity = 0.0;
	UVindex = 0.0;
	LUX = 0.0;
	rawUVA = 0;
	rawUVB = 0;
	UVcomp1 = 0;
	UVcomp2 = 0;
}

/********************************************************
 	Configure Sensor
*********************************************************/
bool SL01v1::begin(void)
{
	writeVEML(VEML6075_REG_CONF, VEML6075_CONF_IT_100, 0x00);
	//xCore.write8(TSL4531_I2C_ADDRESS, (TSL4531_WRITE_CMD | TSL4531_REG_CONTROL), TSL4531_CONF_START);

	uint8_t buf[2] = {TSL4531_WRITE_CMD | TSL4531_REG_CONTROL, TSL4531_CONF_START};

	uBit.i2c.write(TSL4531_I2C_ADDRESS << 1, (BUFFER_TYPE)buf, 2, true);

	//xCore.write8(TSL4531_I2C_ADDRESS, (TSL4531_WRITE_CMD | TSL4531_REG_CONF), TSL4531_CONF_IT_100);

	buf[0] = TSL4531_WRITE_CMD | TSL4531_REG_CONF;
	buf[1] = TSL4531_CONF_IT_100;

	uBit.i2c.write(TSL4531_I2C_ADDRESS << 1, (BUFFER_TYPE)buf, 2, false);

	poll();
	return true;
}

/********************************************************
 	Reads Sensor Data
*********************************************************/
void SL01v1::poll(void)
{
	GET_TSL();
	GET_VEML();
	calculateIndex();
}

/********************************************************
 	Request UVA data in micoWatts/cm^2
*********************************************************/
float SL01v1::getUVA(void)
{
	return UVAintensity;
}

/********************************************************
 	Request UVB data in micoWatts/cm^2
*********************************************************/
float SL01v1::getUVB(void)
{
	return UVBintensity;
}

/********************************************************
 	Request ambeint light in LUX
*********************************************************/
float SL01v1::getLUX(void)
{
	return LUX;
}

/********************************************************
 	Request ambeint light in LUX
*********************************************************/
float SL01v1::uvi(void)
{
	return UVindex;
}

/*---Private Function---*/

/********************************************************
 	Reads Data from TSL4531
*********************************************************/
void SL01v1::GET_TSL(void)
{
	int multi = 4;
	uint8_t tx_buf[1] = {0};
	uint8_t rx_buf[1] = {0};

	//raw_LUX_H = xCore.read8(TSL4531_I2C_ADDRESS, (TSL4531_WRITE_CMD | TSL4531_REG_DATA_HIGH));
	tx_buf[0] = (TSL4531_WRITE_CMD | TSL4531_REG_DATA_HIGH);
	uBit.i2c.write(TSL4531_I2C_ADDRESS << 1, (BUFFER_TYPE)tx_buf, 1, true);
	uBit.i2c.read(TSL4531_I2C_ADDRESS << 1, (BUFFER_TYPE)rx_buf, true);
	raw_LUX_H = rx_buf[0];

	//raw_LUX_L = xCore.read8(TSL4531_I2C_ADDRESS, (TSL4531_WRITE_CMD | TSL4531_REG_DATA_LOW));
	tx_buf[0] = (TSL4531_WRITE_CMD | TSL4531_REG_DATA_LOW);
	uBit.i2c.write(TSL4531_I2C_ADDRESS << 1, (BUFFER_TYPE)tx_buf, 1, true);
	uBit.i2c.read(TSL4531_I2C_ADDRESS << 1, (BUFFER_TYPE)rx_buf, true);
	raw_LUX_L = rx_buf[0];

	uint16_t data = ((raw_LUX_H << 8) | (raw_LUX_L));
	LUX = multi * ((float)data);
}

/********************************************************
 	Reads data from VEML6075
*********************************************************/
void SL01v1::GET_VEML(void)
{
	readUVdata();

	UVAintensity = (float)rawUVA;
	UVBintensity = (float)rawUVB;

	UVAintensity -= (VEML6075_UVA_VIS_COEFF * UVcomp1) - (VEML6075_UVA_IR_COEFF * UVcomp2);
	UVBintensity -= (VEML6075_UVB_VIS_COEFF * UVcomp1) - (VEML6075_UVB_IR_COEFF * UVcomp2);
}

/********************************************************
 	Reads data from VEML6075
*********************************************************/
void SL01v1::readUVdata(void)
{
	rawUVA = readVEML(VEML6075_REG_UVA);
	rawUVB = readVEML(VEML6075_REG_UVB);

	rawUVA = readVEML(VEML6075_REG_UVA);
	rawUVB = readVEML(VEML6075_REG_UVB);

	UVcomp1 = readVEML(VEML6075_REG_UVCOMP1);
	UVcomp2 = readVEML(VEML6075_REG_UVCOMP2);

	UVcomp1 = readVEML(VEML6075_REG_UVCOMP1);
	UVcomp2 = readVEML(VEML6075_REG_UVCOMP2);
}

/********************************************************
 	Calculation of UV Index
*********************************************************/
void SL01v1::calculateIndex(void)
{
	float UVAComp, UVBComp = 0;
	UVAComp = (UVAintensity * VEML6075_UVA_RESP);
	UVBComp = (UVBintensity * VEML6075_UVB_RESP);
	UVindex = (UVAComp + UVBComp) / 2.0;
}

/********************************************************
 	Write Config Data to VEML
*********************************************************/
void SL01v1::writeVEML(byte reg, byte lowbyte, byte highbyte)
{
	/*Wire.beginTransmission(VEML6075_I2C_ADDRESS);
	Wire.write((uint8_t)reg);
	Wire.write((uint8_t)lowbyte);
	Wire.write((uint8_t)highbyte);
	Wire.endTransmission();*/

	uint8_t buf[3] = {reg, lowbyte, highbyte};

	uBit.i2c.write(VEML6075_I2C_ADDRESS << 1, (BUFFER_TYPE)buf, 3);
}

/********************************************************
 	Read Data from VEML
*********************************************************/
uint16_t SL01v1::readVEML(byte reg)
{
	uint16_t value = 0;
	uint8_t lowByte = 0;
	uint8_t highByte = 0;

	uint8_t tx_buf[1];
	uint8_t rx_buf[2];

	/*Wire.beginTransmission(VEML6075_I2C_ADDRESS);
	Wire.write((uint8_t)reg);
	Wire.endTransmission(false);
	Wire.requestFrom(VEML6075_I2C_ADDRESS, 2); // Read two bytes from slave register address
	if (Wire.available())
	{
		lowByte = Wire.read();
		highByte = Wire.read();
	}*/

	tx_buf[0] = (uint8_t)reg;
	uBit.i2c.write(VEML6075_I2C_ADDRESS << 1, (BUFFER_TYPE)tx_buf, 1, true);
	uBit.i2c.read(VEML6075_I2C_ADDRESS << 1, (BUFFER_TYPE)rx_buf, 2, false);

	lowByte = rx_buf[0];
	highByte = rx_buf[1];

	value = (highByte << 8 | lowByte);

	return value;
}

#define UTIL_delay(x) uBit.sleep(x)
#define i2c_addr 0x52
static SI1133_LuxCoeff_TypeDef lk = {
	{{0, 209},
	 {1665, 93},
	 {2064, 65},
	 {-2671, 234}},
	{{0, 0},
	 {1921, 29053},
	 {-1022, 36363},
	 {2320, 20789},
	 {-367, 57909},
	 {-1774, 38240},
	 {-608, 46775},
	 {-1503, 51831},
	 {-1886, 58928}}};
/***************************************************************************/
static SI1133_Coeff_TypeDef uk[2] = {
	{1281, 30902},
	{-638, 46301}};
/***************************************************************************/
static int32_t SI1133_calcPolyInner(int32_t input, int8_t fraction, uint16_t mag, int8_t shift);
static int32_t SI1133_calcEvalPoly(int32_t x, int32_t y, uint8_t input_fraction, uint8_t output_fraction, uint8_t num_coeff, SI1133_Coeff_TypeDef *kp);
/***************************************************************************/

SL01v2::SL01v2()
{
}
uint32_t SL01v2::SI1133_registerRead(uint8_t reg, uint8_t *data)
{

	/*Wire.beginTransmission(i2c_addr);
	Wire.write(reg);
	Wire.endTransmission();
	Wire.requestFrom(i2c_addr, 1);
	while (Wire.available())
		data[0] = (uint8_t)Wire.read();
	}*/

	uint8_t tx_buf[1] = {0};
	uint8_t rx_buf[1] = {0};

	tx_buf[0] = reg;

	uBit.i2c.write(i2c_addr << 1, (BUFFER_TYPE)tx_buf, 1);
	uBit.i2c.read(i2c_addr << 1, (BUFFER_TYPE)rx_buf, 1);
	data[0] = rx_buf[0];

	return 0;
	// I2C_TransferSeq_TypeDef seq;
	// I2C_TransferReturn_TypeDef ret;
	// uint8_t i2c_write_data[1];
	// uint32_t retval;
	// retval = SI1133_OK;
	// seq.addr = SI1133_I2C_DEVICE_BUS_ADDRESS;
	// seq.flags = I2C_FLAG_WRITE_READ;
	// /* Select register to start reading from */
	// i2c_write_data[0] = reg;
	// seq.buf[0].data = i2c_write_data;
	// seq.buf[0].len = 1;
	// /* Select length of data to be read */
	// seq.buf[1].data = data;
	// seq.buf[1].len = 1;
	// ret = I2CSPM_Transfer( SI1133_I2C_DEVICE, &seq );
	// if( ret != i2cTransferDone ) {
	//    *data = 0xff;
	//    retval = SI1133_ERROR_I2C_TRANSACTION_FAILED;
	// }
	// return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_registerWrite(uint8_t reg, uint8_t data)
{
	uint8_t tx_buf[2] = {0};

	tx_buf[0] = reg;
	tx_buf[1] = data;



	/*Wire.beginTransmission(i2c_addr);
	Wire.write(reg);
	Wire.write(data);
	Wire.endTransmission();*/
	return uBit.i2c.write(i2c_addr << 1, (BUFFER_TYPE)tx_buf, 2, false);
	// I2C_TransferSeq_TypeDef seq;
	// I2C_TransferReturn_TypeDef ret;
	// uint8_t i2c_write_data[2];
	// uint8_t i2c_read_data[1];
	// uint32_t retval;
	// retval = SI1133_OK;
	// seq.addr = SI1133_I2C_DEVICE_BUS_ADDRESS;
	// seq.flags = I2C_FLAG_WRITE;
	// /* Select register and data to write */
	// i2c_write_data[0] = reg;
	// i2c_write_data[1] = data;
	// seq.buf[0].data = i2c_write_data;
	// seq.buf[0].len = 2;
	// seq.buf[1].data = i2c_read_data;
	// seq.buf[1].len = 0;
	// ret = I2CSPM_Transfer( SI1133_I2C_DEVICE, &seq );
	// if( ret != i2cTransferDone ) {
	//    retval = SI1133_ERROR_I2C_TRANSACTION_FAILED;
	// }
	// return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_registerBlockWrite(uint8_t reg, uint8_t length, uint8_t *data)
{

	/*Wire.beginTransmission(i2c_addr);
	Wire.write(reg);*/



	/*for (int i = 0; i < length; i++)
	{
		Wire.write(data[i]);
	}
	Wire.endTransmission();*/


	uint8_t buf[length + 1] = {0};
	buf[0] = reg;
	for (int i = 1; i < length + 1; i++)
	{
		buf[i] = data[i - 1];
	}

	uBit.i2c.write(i2c_addr << 1, (BUFFER_TYPE)buf, length + 1);

	return 0;

	// I2C_TransferSeq_TypeDef seq;
	// I2C_TransferReturn_TypeDef ret;
	// uint8_t i2c_write_data[10];
	// uint8_t i2c_read_data[1];
	// uint8_t i;
	// uint32_t retval;
	// retval = SI1133_OK;
	// seq.addr = SI1133_I2C_DEVICE_BUS_ADDRESS;
	// seq.flags = I2C_FLAG_WRITE;
	// /* Select register to start writing to*/
	// i2c_write_data[0] = reg;
	// for( i = 0; i < length; i++ ) {
	//    i2c_write_data[i + 1] = data[i];
	// }
	// seq.buf[0].data = i2c_write_data;
	// seq.buf[0].len = length + 1;
	// seq.buf[1].data = i2c_read_data;
	// seq.buf[1].len = 0;
	// ret = I2CSPM_Transfer( SI1133_I2C_DEVICE, &seq );
	// if( ret != i2cTransferDone ) {
	//    retval = SI1133_ERROR_I2C_TRANSACTION_FAILED;
	// }
	// return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_registerBlockRead(uint8_t reg, uint8_t length, uint8_t *data)
{

	uint8_t tx_buf[1] = {0};
	uint8_t rx_buf[length] = {0};

	tx_buf[0] = reg;
	uBit.i2c.write(i2c_addr << 1, (BUFFER_TYPE)tx_buf, 1);
	uBit.i2c.read(i2c_addr << 1, (BUFFER_TYPE)rx_buf, length);

	/*Wire.beginTransmission(i2c_addr);
	Wire.write(reg);
	Wire.endTransmission();
	Wire.requestFrom(i2c_addr, length);*/
	int i = length;
	int j = 0;
	while (i)
	{
		data[j] = (uint8_t)rx_buf[j];
		i--;
		j++;
	}
	return 0;
	// I2C_TransferSeq_TypeDef seq;
	// I2C_TransferReturn_TypeDef ret;
	// uint8_t i2c_write_data[1];
	// uint32_t retval;
	// retval = SI1133_OK;
	// seq.addr = SI1133_I2C_DEVICE_BUS_ADDRESS;
	// seq.flags = I2C_FLAG_WRITE_READ;
	// /* Select register to start reading from */
	// i2c_write_data[0] = reg;
	// seq.buf[0].data = i2c_write_data;
	// seq.buf[0].len = 1;
	// /* Select length of data to be read */
	// seq.buf[1].data = data;
	// seq.buf[1].len = length;
	// ret = I2CSPM_Transfer(SI1133_I2C_DEVICE, &seq);
	// if (ret != i2cTransferDone)
	// {
	//    retval = SI1133_ERROR_I2C_TRANSACTION_FAILED;
	// }
	// return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_waitUntilSleep(void)
{
	uint32_t ret;
	uint8_t response;
	uint8_t count = 0;
	uint32_t retval;
	retval = SI1133_OK;
	/* This loops until the Si1133 is known to be in its sleep state  */
	/* or if an i2c error occurs                                      */
	while (count < 5)
	{
		ret = SI1133_registerRead(SI1133_REG_RESPONSE0, &response);
		if ((response & SI1133_RSP0_CHIPSTAT_MASK) == SI1133_RSP0_SLEEP)
		{
			break;
		}
		if (ret != SI1133_OK)
		{
			retval = SI1133_ERROR_SLEEP_FAILED;
			break;
		}
		count++;
	}
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_reset(void)
{
	uint32_t retval;
	/* Do not access the Si1133 earlier than 25 ms from power-up */
	UTIL_delay(30);
	/* Perform the Reset Command */
	retval = SI1133_registerWrite(SI1133_REG_COMMAND, SI1133_CMD_RESET);
	/* Delay for 10 ms. This delay is needed to allow the Si1133   */
	/* to perform internal reset sequence.                         */
	UTIL_delay(10);
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_sendCmd(uint8_t command)
{
	uint8_t response;
	uint8_t response_stored;
	uint8_t count = 0;
	uint32_t ret;
	/* Get the response register contents */
	ret = SI1133_registerRead(SI1133_REG_RESPONSE0, &response_stored);
	if (ret != SI1133_OK)
	{
		return ret;
	}
	response_stored = response_stored & SI1133_RSP0_COUNTER_MASK;
	/* Double-check the response register is consistent */
	while (count < 5)
	{
		ret = SI1133_waitUntilSleep();
		if (ret != SI1133_OK)
		{
			return ret;
		}
		/* Skip if the command is RESET COMMAND COUNTER */
		if (command == SI1133_CMD_RESET_CMD_CTR)
		{
			break;
		}
		ret = SI1133_registerRead(SI1133_REG_RESPONSE0, &response);
		if ((response & SI1133_RSP0_COUNTER_MASK) == response_stored)
		{
			break;
		}
		else
		{
			if (ret != SI1133_OK)
			{
				return ret;
			}
			else
			{
				response_stored = response & SI1133_RSP0_COUNTER_MASK;
			}
		}
		count++;
	}
	/* Send the command */
	ret = SI1133_registerWrite(SI1133_REG_COMMAND, command);
	if (ret != SI1133_OK)
	{
		return ret;
	}
	count = 0;
	/* Expect a change in the response register */
	while (count < 5)
	{
		/* Skip if the command is RESET COMMAND COUNTER */
		if (command == SI1133_CMD_RESET_CMD_CTR)
		{
			break;
		}
		ret = SI1133_registerRead(SI1133_REG_RESPONSE0, &response);
		if ((response & SI1133_RSP0_COUNTER_MASK) != response_stored)
		{
			break;
		}
		else
		{
			if (ret != SI1133_OK)
			{
				return ret;
			}
		}
		count++;
	}
	return SI1133_OK;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_resetCmdCtr(void)
{
	return SI1133_sendCmd(SI1133_CMD_RESET_CMD_CTR);
}
/***************************************************************************/
uint32_t SL01v2::SI1133_measurementForce(void)
{
	return SI1133_sendCmd(SI1133_CMD_FORCE_CH);
}
/***************************************************************************/
uint32_t SL01v2::SI1133_measurementStart(void)
{
	return SI1133_sendCmd(SI1133_CMD_START);
}
/***************************************************************************/
uint32_t SL01v2::SI1133_paramRead(uint8_t address)
{
	uint8_t retval;
	uint8_t cmd;
	cmd = 0x40 + (address & 0x3F);
	retval = SI1133_sendCmd(cmd);
	if (retval != SI1133_OK)
	{
		return retval;
	}
	SI1133_registerRead(SI1133_REG_RESPONSE1, &retval);
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_paramSet(uint8_t address, uint8_t value)
{
	uint32_t retval;
	uint8_t buffer[2];
	uint8_t response_stored;
	uint8_t response;
	uint8_t count;
	retval = SI1133_waitUntilSleep();

	if (retval != SI1133_OK)
	{
		return retval;
	}

	SI1133_registerRead(SI1133_REG_RESPONSE0, &response_stored);
	response_stored &= SI1133_RSP0_COUNTER_MASK;
	buffer[0] = value;
	buffer[1] = 0x80 + (address & 0x3F);
	retval = SI1133_registerBlockWrite(SI1133_REG_HOSTIN0, 2, (uint8_t *)buffer);
	if (retval != SI1133_OK)
	{
		return retval;
	}
	/* Wait for command to finish */
	count = 0;
	/* Expect a change in the response register */
	while (count < 5)
	{
		retval = SI1133_registerRead(SI1133_REG_RESPONSE0, &response);
		if ((response & SI1133_RSP0_COUNTER_MASK) != response_stored)
		{
			break;
		}
		else
		{
			if (retval != SI1133_OK)
			{
				return retval;
			}
		}
		count++;
	}
	return SI1133_OK;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_measurementPause(void)
{
	return SI1133_sendCmd(SI1133_CMD_PAUSE_CH);
}
/**************************************************************************/
uint32_t SL01v2::SI1133_init(void)
{
	uint32_t retval;
	/* Enable power to the sensor */
	//BOARD_envSensEnable(true);
	/* Allow some time for the part to power up */
	UTIL_delay(5);
	retval = SI1133_reset();
	UTIL_delay(10);
	retval += SI1133_paramSet(SI1133_PARAM_CH_LIST, 0x0f);
	retval += SI1133_paramSet(SI1133_PARAM_ADCCONFIG0, 0x78);
	retval += SI1133_paramSet(SI1133_PARAM_ADCSENS0, 0x71);
	retval += SI1133_paramSet(SI1133_PARAM_ADCPOST0, 0x40);
	retval += SI1133_paramSet(SI1133_PARAM_ADCCONFIG1, 0x4d);
	retval += SI1133_paramSet(SI1133_PARAM_ADCSENS1, 0xe1);
	retval += SI1133_paramSet(SI1133_PARAM_ADCPOST1, 0x40);
	retval += SI1133_paramSet(SI1133_PARAM_ADCCONFIG2, 0x41);
	retval += SI1133_paramSet(SI1133_PARAM_ADCSENS2, 0xe1);
	retval += SI1133_paramSet(SI1133_PARAM_ADCPOST2, 0x50);
	retval += SI1133_paramSet(SI1133_PARAM_ADCCONFIG3, 0x4d);
	retval += SI1133_paramSet(SI1133_PARAM_ADCSENS3, 0x87);
	retval += SI1133_paramSet(SI1133_PARAM_ADCPOST3, 0x40);
	retval += SI1133_registerWrite(SI1133_REG_IRQ_ENABLE, 0x0f);
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_deInit(void)
{
	uint32_t retval;
	retval = SI1133_paramSet(SI1133_PARAM_CH_LIST, 0x3f);
	retval += SI1133_measurementPause();
	retval += SI1133_waitUntilSleep();
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_measurementGet(SI1133_Samples_TypeDef *samples)
{
	uint8_t buffer[13];
	uint32_t retval;
	retval = SI1133_registerBlockRead(SI1133_REG_IRQ_STATUS, 13, buffer);
	samples->irq_status = buffer[0];
	samples->ch0 = buffer[1] << 16;
	samples->ch0 |= buffer[2] << 8;
	samples->ch0 |= buffer[3];
	if (samples->ch0 & 0x800000)
	{
		samples->ch0 |= 0xFF000000;
	}
	samples->ch1 = buffer[4] << 16;
	samples->ch1 |= buffer[5] << 8;
	samples->ch1 |= buffer[6];
	if (samples->ch1 & 0x800000)
	{
		samples->ch1 |= 0xFF000000;
	}
	samples->ch2 = buffer[7] << 16;
	samples->ch2 |= buffer[8] << 8;
	samples->ch2 |= buffer[9];
	if (samples->ch2 & 0x800000)
	{
		samples->ch2 |= 0xFF000000;
	}
	samples->ch3 = buffer[10] << 16;
	samples->ch3 |= buffer[11] << 8;
	samples->ch3 |= buffer[12];
	if (samples->ch3 & 0x800000)
	{
		samples->ch3 |= 0xFF000000;
	}
	return retval;
}
/***************************************************************************/
int32_t SL01v2::SI1133_calcPolyInner(int32_t input, int8_t fraction, uint16_t mag, int8_t shift)
{
	int32_t value;
	if (shift < 0)
	{
		value = ((input << fraction) / mag) >> -shift;
	}
	else
	{
		value = ((input << fraction) / mag) << shift;
	}
	return value;
}
/***************************************************************************/
int32_t SL01v2::SI1133_calcEvalPoly(int32_t x, int32_t y, uint8_t input_fraction, uint8_t output_fraction, uint8_t num_coeff, SI1133_Coeff_TypeDef *kp)
{
	uint8_t info, x_order, y_order, counter;
	int8_t sign, shift;
	uint16_t mag;
	int32_t output = 0, x1, x2, y1, y2;
	for (counter = 0; counter < num_coeff; counter++)
	{
		info = kp->info;
		x_order = get_x_order(info);
		y_order = get_y_order(info);
		shift = ((uint16_t)kp->info & 0xff00) >> 8;
		shift ^= 0x00ff;
		shift += 1;
		shift = -shift;
		mag = kp->mag;
		if (get_sign(info))
		{
			sign = -1;
		}
		else
		{
			sign = 1;
		}
		if ((x_order == 0) && (y_order == 0))
		{
			output += sign * mag << output_fraction;
		}
		else
		{
			if (x_order > 0)
			{
				x1 = SI1133_calcPolyInner(x, input_fraction, mag, shift);
				if (x_order > 1)
				{
					x2 = SI1133_calcPolyInner(x, input_fraction, mag, shift);
				}
				else
				{
					x2 = 1;
				}
			}
			else
			{
				x1 = 1;
				x2 = 1;
			}
			if (y_order > 0)
			{
				y1 = SI1133_calcPolyInner(y, input_fraction, mag, shift);
				if (y_order > 1)
				{
					y2 = SI1133_calcPolyInner(y, input_fraction, mag, shift);
				}
				else
				{
					y2 = 1;
				}
			}
			else
			{
				y1 = 1;
				y2 = 1;
			}
			output += sign * x1 * x2 * y1 * y2;
		}
		kp++;
	}
	if (output < 0)
	{
		output = -output;
	}
	return output;
}
/***************************************************************************/
int32_t SL01v2::SI1133_getUv(int32_t uv, SI1133_Coeff_TypeDef *uk)
{
	int32_t uvi;
	uvi = SI1133_calcEvalPoly(0, uv, UV_INPUT_FRACTION, UV_OUTPUT_FRACTION, UV_NUMCOEFF, uk);
	return uvi;
}
/***************************************************************************/
int32_t SL01v2::SI1133_getLux(int32_t vis_high, int32_t vis_low, int32_t ir, SI1133_LuxCoeff_TypeDef *lk)
{
	int32_t lux;
	if ((vis_high > ADC_THRESHOLD) || (ir > ADC_THRESHOLD))
	{
		lux = SI1133_calcEvalPoly(vis_high,
								  ir,
								  INPUT_FRACTION_HIGH,
								  LUX_OUTPUT_FRACTION,
								  NUMCOEFF_HIGH,
								  &(lk->coeff_high[0]));
	}
	else
	{
		lux = SI1133_calcEvalPoly(vis_low,
								  ir,
								  INPUT_FRACTION_LOW,
								  LUX_OUTPUT_FRACTION,
								  NUMCOEFF_LOW,
								  &(lk->coeff_low[0]));
	}
	return lux;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_measureLuxUvi(float *lux, float *uvi)
{
	SI1133_Samples_TypeDef samples;
	uint32_t retval;
	uint8_t response;
	/* Force measurement */
	retval = SI1133_measurementForce();
	/* Go to sleep while the sensor does the conversion */
	UTIL_delay(200);
	/* Check if the measurement finished, if not then wait */
	retval += SI1133_registerRead(SI1133_REG_IRQ_STATUS, &response);
	while (response != 0x0F)
	{
		UTIL_delay(5);
		retval += SI1133_registerRead(SI1133_REG_IRQ_STATUS, &response);
	}
	/* Get the results */
	SI1133_measurementGet(&samples);
	/* Convert the readings to lux */
	*lux = (float)SI1133_getLux(samples.ch1, samples.ch3, samples.ch2, &lk);
	*lux = *lux / (1 << LUX_OUTPUT_FRACTION);
	/* Convert the readings to UV index */
	*uvi = (float)SI1133_getUv(samples.ch0, uk);
	*uvi = *uvi / (1 << UV_OUTPUT_FRACTION);
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_getHardwareID(uint8_t *hardwareID)
{
	uint32_t retval;
	retval = SI1133_registerRead(SI1133_REG_PART_ID, hardwareID);
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_getMeasurement(float *lux, float *uvi)
{
	SI1133_Samples_TypeDef samples;
	uint32_t retval;
	/* Get the results */
	retval = SI1133_measurementGet(&samples);
	/* Convert the readings to lux */
	*lux = (float)SI1133_getLux(samples.ch1, samples.ch3, samples.ch2, &lk);
	*lux = *lux / (1 << LUX_OUTPUT_FRACTION);
	/* Convert the readings to UV index */
	*uvi = (float)SI1133_getUv(samples.ch0, uk);
	*uvi = *uvi / (1 << UV_OUTPUT_FRACTION);
	return retval;
}
/***************************************************************************/
uint32_t SL01v2::SI1133_getIrqStatus(uint8_t *irqStatus)
{
	uint32_t retval;
	/* Read the IRQ status register */
	retval = SI1133_registerRead(SI1133_REG_IRQ_STATUS, irqStatus);
	return retval;
}

xSL01::xSL01()
{
}

bool xSL01::begin()
{
	checkVersion();
	if (version == 1)
	{
		//SL01v1 v1;
		v1.begin();
	}
	else if (version == 2)
	{
		//SL01v2 v2;
		v2.SI1133_init();
	}
	return true;
}

float xSL01::getUVIndex()
{
	float uvi;
	if (version == 1)
	{
		//SL01v1 v1;
		v1.poll();
		uvi = v1.uvi();
	}
	else if (version == 2)
	{
		float lux;
		//SL01v2 v2;
		v2.SI1133_measurementForce();
		v2.SI1133_getMeasurement(&lux, &uvi);
	}
	if (uvi < 0)
		return 0;
	else
		return uvi;
}

float xSL01::getLUX()
{
	float lux;
	if (version == 1)
	{
		//SL01v1 v1;
		v1.poll();
		lux = v1.getLUX();
	}
	else if (version == 2)
	{
		//SL01v2 v2;
		float uvi;
		//v2.SI1133_init();
		v2.SI1133_measurementForce();
		v2.SI1133_getMeasurement(&lux, &uvi);
	}
	if (lux < 0)
		return 0;
	else
		return lux;
}

uint8_t xSL01::checkVersion()
{
	uint8_t buf[1] = {1};

	/*if (xCore.ping(0x10) && xCore.ping(0x29))
	{
		version = 1;
	}
	else if (xCore.ping(0x52))
	{
		version = 2;
	}*/


	if((uBit.i2c.write(0x10 << 1, (BUFFER_TYPE)buf, 1) == 0) || (uBit.i2c.write(0x29 << 1, (BUFFER_TYPE)buf, 1) == 0))
	{
		version = 1;
	}

	else if ((uBit.i2c.write(0x52 << 1, (BUFFER_TYPE)buf, 1) == 0))
	{
		version = 2;
	}
	return version;
}

void xSL01::poll()
{
}

float xSL01::getUVA()
{
	if (version == 1)
	{
		//SL01v1 v1;
		v1.poll();
		float uva = v1.getUVA();

		if (uva < 0)
			return 0;
		else
			return uva;
	}
	else
	{
		return 255;
	}
}
float xSL01::getUVB()
{
	if (version == 1)
	{
		//SL01v1 v1;
		v1.poll();
		float uvb = v1.getUVB();

		if (uvb < 0)
			return 0;
		else
			return uvb;
	}
	else
	{
		return 255;
	}
}


namespace sl01
{
	xSL01 sl01 =  xSL01();

	//%
	bool begin()
	{
		return sl01.begin();
	}

	//%
	void poll()
	{
		sl01.poll();
	}

	//%
	float getLUX()
	{
		return sl01.getLUX();
	}

	//%
	float getUVA()
	{
		return sl01.getUVA();
	}

	//%
	float getUVB()
	{
		return sl01.getUVB();
	}

	//%
	float getUVIndex()
	{
		return sl01.getUVIndex();
	}

	//%
	uint8_t getHardwareID()
	{
		uint8_t id;
		SL01v2 v2;
		v2.SI1133_getHardwareID(&id);
		return id;
	}

	//%
	uint8_t checkVersion()
	{
		return sl01.checkVersion();
	}
}