enum USER {
    //% block="INDUSTRIAL"
    INDUSTRIAL = 1,
    //% block="EDUCATIONAL"
    EDUCATIONAL = 2
}

enum Measuremode {
    //% block="IDLE"
    MODE_IDLE = 0x00,
    //% block="1SEC"
    MODE_1SEC = 0x10,
    //% block="10SEC"
    MODE_10SEC = 0x20,
    //% block="60SEC"
    MODE_60SEC = 0x30,
    //% block="250MS"
    MODE_250MS = 0x40
}

enum SH01_KEY {
    //% block="UP"
    KEY_UP = 1,
    //% block="DOWN"
    KEY_DOWN = 8,
    //% block="LEFT"
    KEY_LEFT = 16,
    //% block="RIGHT"
    KEY_RIGHT = 32,
    //% block="TRIANGLE"
    KEY_TRIANGLE = 1,
    //% block="NO"
    KEY_NO = 8,
    //% block="SQUARE"
    KEY_SQUARE = 16,
    //% block="CIRCLE"
    KEY_CIRCLE = 32,
}

//% color=105 weight=100 icon="\uf299" block="Greenhouse kit"
//% groups='["OD01", "SG33", "SL01", "SW01", "SW07", "SH01", "SD CARD", "Wifi-Common", "ATT"]'
namespace greenhouse
{
   // CW01 Variables start

    class cw01_int_var123 {
        res: string
        NEWLINE: string
        DEVICE_ID: string
        TOKEN: string
        start: boolean
        asset_name: string
        timer: number
        mqtt_message: string
        constructor() {
            this.res = ""
            this.NEWLINE = "\u000D\u000A"
            this.DEVICE_ID = ""
            this.TOKEN = ""
            this.asset_name = ""
            this.timer = 0
            this.mqtt_message = ""
        }
    }

    class cw01_mqtt {
        new_payload: string
        prev_payload: string
        new_topic: string
        prev_topic: string
        enable_event_1: boolean
        enable_event_2: boolean
        id: string
        id_enable: boolean
        timer_enable: boolean
        sending_payload: boolean
        sending_pingreq: boolean
        receiving_msg: boolean
        mqtt_busy: boolean
        mac_addr: string

        constructor() {
            this.new_payload = ""
            this.prev_payload = ""
            this.new_topic = ""
            this.prev_topic = ""
            this.enable_event_1 = false
            this.enable_event_2 = false
            this.id = ""
            this.id_enable = false
            this.timer_enable = true
            this.sending_payload = false
            this.sending_pingreq = false
            this.receiving_msg = false
            this.mac_addr = ""
            this.mqtt_busy = false
        }
    }

    class button_class {
        sending_data: boolean

        constructor() {
            this.sending_data = false
        }
    }

    let cw01_button_object = new button_class()
    let cw01_vars = new cw01_int_var123()
    let cw01_mqtt_vars = new cw01_mqtt()
    let en_Feedback: boolean = true
    let en_doubleLink: boolean = false
    let cmd_rcvd_count: number = 0
    cw01_vars.start = true

    // CW01 Variables end

    // SH01 Variables start

    const CAP1296_I2C_ADDRESS = 40
    const REG_MainControl = 0
    const REG_InputStatus = 3
    const _interval = 100

    let KeyPressed: boolean[] = [false, false, false, false, false, false, false, false]
    let KeyReleased: boolean[] = [true, true, true, true, true, true, true, true]
    let buf = pins.createBuffer(2)
    let rk: number = 0

    // SH01 Variables end

    // OD01 variables start

    // 6x8 font
    const Font_5x7 = hex`000000000000005F00000007000700147F147F14242A072A12231308646237495522500005030000001C2241000041221C00082A1C2A0808083E080800503000000808080808006060000020100804023E5149453E00427F400042615149462141454B311814127F1027454545393C4A49493001710905033649494936064949291E003636000000563600000008142241141414141441221408000201510906324979413E7E1111117E7F494949363E414141227F4141221C7F494949417F090901013E414151327F0808087F00417F41002040413F017F081422417F404040407F0204027F7F0408107F3E4141413E7F090909063E4151215E7F09192946464949493101017F01013F4040403F1F2040201F7F2018207F63140814630304780403615149454300007F4141020408102041417F000004020102044040404040000102040020545454787F484444383844444420384444487F3854545418087E090102081454543C7F0804047800447D40002040443D00007F10284400417F40007C041804787C0804047838444444387C14141408081414187C7C080404084854545420043F4440203C4040207C1C2040201C3C4030403C44281028440C5050503C4464544C44000836410000007F000000413608000201020402`


    export enum Display {
        //% block="ON"
        On = 1,
        //% block="OFF"
        Off = 0
    }

    const MIN_X = 0
    const MIN_Y = 0
    const MAX_X = 127
    const MAX_Y = 63

    let _I2CAddr = 60
    let _screen = pins.createBuffer(1025)
    let _buf2 = pins.createBuffer(2)
    let _buf3 = pins.createBuffer(3)
    let _buf4 = pins.createBuffer(4)
    let _buf7 = pins.createBuffer(7)
    _buf7[0] = 0x40
    let _DRAW = 1
    let _cx = 0
    let _cy = 0

    // OD01 Variables end

    // SW01 Variables start

    export enum Temperature {
        //% block="ºC"
        Celcius = 0,
        //% block="ºF"
        Fahrenheit = 1
    }

    export enum Pressure {
        //% block="hPa"
        HectoPascal = 0,
        //% block="mbar"
        MilliBar = 1
    }

    export enum Humidity {
        //% block="%RH"
        RelativeHumidity = 0
    }

    export enum Length {
        //% block="meter"
        Meter = 0,
        //% block="feet"
        Feet = 1
    }
    
    let SW01_ADDR = 0x76

    let dig_T1 = getUInt16LE(0x88, SW01_ADDR)
    let dig_T2 = getInt16LE(0x8A, SW01_ADDR)
    let dig_T3 = getInt16LE(0x8C, SW01_ADDR)
    let dig_P1 = getUInt16LE(0x8E, SW01_ADDR)
    let dig_P2 = getInt16LE(0x90, SW01_ADDR)
    let dig_P3 = getInt16LE(0x92, SW01_ADDR)
    let dig_P4 = getInt16LE(0x94, SW01_ADDR)
    let dig_P5 = getInt16LE(0x96, SW01_ADDR)
    let dig_P6 = getInt16LE(0x98, SW01_ADDR)
    let dig_P7 = getInt16LE(0x9A, SW01_ADDR)
    let dig_P8 = getInt16LE(0x9C, SW01_ADDR)
    let dig_P9 = getInt16LE(0x9E, SW01_ADDR)
    let dig_H1 = getreg(0xA1, SW01_ADDR)
    let dig_H2 = getInt16LE(0xE1, SW01_ADDR)
    let dig_H3 = getreg(0xE3, SW01_ADDR)
    let a = getreg(0xE5, SW01_ADDR)
    let dig_H4 = (getreg(0xE4, SW01_ADDR) << 4) + (a % 16)
    let dig_H5 = (getreg(0xE6, SW01_ADDR) << 4) + (a >> 4)
    let dig_H6 = getInt8LE(0xE7, SW01_ADDR)

    let T = 0
    let P = 0
    let H = 0

    // SW01 Variables end

    // SL01 Variables start

    let v1 = 0
    let v2 = 0

    export enum SL01_L {
        //% block="lx"
        LX = 1,
        //% block="fc"
        FC = 2
    }

    export enum DISTANCE {
        //% block="m"
        METER = 1,
        //% block="cm"
        CENTIMETER = 2
    }

    let TSL_I2C_ADDR = 0x29
    let VEML_I2C_ADDR = 0x10

    let initialized = false
    const VEML6075_REG_CONF = 0x00
    const VEML6075_REG_UVA = 0x07
    const VEML6075_REG_UVB = 0x09
    const VEML6075_REG_UVCOMP1 = 0x0A
    const VEML6075_REG_UVCOMP2 = 0x0B
    const VEML6075_CONF_HD_NORM = 0x00
    const VEML6075_CONF_HD_HIGH = 0x80
    const VEML6075_CONF_UV_TRIG_ONCE = 0x04
    const VEML6075_CONF_UV_TRIG_NORM = 0x00
    const VEML6075_CONF_AF_FORCE = 0x00
    const VEML6075_CONF_AF_AUTO = 0x02
    const VEML6075_CONF_SD_OFF = 0x00
    const VEML6075_CONF_SD_ON = 0x01
    const VEML6075_CONF_IT_50 = 0x00
    const VEML6075_CONF_IT_100 = 0x10
    const VEML6075_CONF_IT_200 = 0x20
    const VEML6075_CONF_IT_400 = 0x30
    const VEML6075_CONF_IT_800 = 0x40
    const VEML6075_UVA_VIS_COEFF = (333 / 100)
    const VEML6075_UVA_IR_COEFF = (25 / 10)
    const VEML6075_UVB_VIS_COEFF = (366 / 100)
    const VEML6075_UVB_IR_COEFF = (275 / 100)
    const VEML6075_UVA_RESP = (11 / 10000)
    const VEML6075_UVB_RESP = (125 / 100000)

    const TSL4531_REG_CONTROL = 0x00
    const TSL4531_REG_CONF = 0x01
    const TSL4531_REG_DATA_LOW = 0x04
    const TSL4531_REG_DATA_HIGH = 0x05
    const TSL4531_WRITE_CMD = 0x80
    const TSL4531_CONF_PWR_DOWN = 0x00
    const TSL4531_CONF_ONE_RUN = 0x02
    const TSL4531_CONF_START = 0x03
    const TSL4531_CONF_IT_100 = 0x02
    const TSL4531_CONF_IT_200 = 0x01
    const TSL4531_CONF_IT_400 = 0x00
    const TSL4531_CONF_PSAVE = 0x02

    // SL01 variables end

    // SW07 Variables start

    let ADC_I2C_ADDRESS = 0x59
    let ADC_REG_CONF = 0x02
    let ADC_CONF_CYC_TIME_256 = 0x80
    let ADC_REG_RESULT = 0x00
    let voltage = 0.0

    // SW07 Variables end

    // SG33 Variables start

    let SG33_ADDR = 0x5A
    let eCO2_ = 0
    let TVOC_ = 0

    // SG33 Variables end
	
	// IM01 variables start
	let sdFlag=false
	// IM01 variables end

    // SW01 function call start

        setreg(0xF2, 0x04, SW01_ADDR) // set Humidity oversampling to x8
        setreg(0xF4, 0x2F, SW01_ADDR) // set Pressure oversampling to x1
        setreg(0xF5, 0x0C, SW01_ADDR) // set time constant of the IIR filter to 250 ms

    // SW01 function call end

    // SH01 function call start
    _readkey()
    // SH01 function call end

    // SW07 function call start

    setreg(ADC_REG_CONF, ADC_CONF_CYC_TIME_256, ADC_I2C_ADDRESS)

    // SW07 function call end

    // SG33 function call start

     writereg(0xF4)
     disableInterrupt();
     setDriveMode(Measuremode.MODE_1SEC);

    // SG33 function call end

    // CW01 function call start

    serial.redirect(SerialPin.P1, SerialPin.P0, 115200)
    serial.setRxBufferSize(200)

    basic.showIcon(IconNames.Chessboard)
    basic.pause(2000)
    serial.writeString("ATE0" + cw01_vars.NEWLINE)
    basic.pause(300)
    serial.readString()
    serial.writeString("AT+CWMODE_DEF=3" + cw01_vars.NEWLINE)
    basic.pause(300)
    serial.writeString("AT+CIPRECVMODE=1" + cw01_vars.NEWLINE)
    basic.pause(300)
    serial.writeString("AT+TEST" + cw01_vars.NEWLINE)
    basic.pause(300)
    serial.readString();
    serial.writeString("AT+CWHOSTNAME?" + cw01_vars.NEWLINE);
    basic.pause(1000)

    read_and_set_name();

    // CW01 function call end

    // OD01 function call start

    init_od01()

    // OD01 function call end

     /**
     * draw / refresh screen
     */
    function draw(d: number) {
        if (d > 0) {
            set_pos()
            pins.i2cWriteBuffer(_I2CAddr, _screen)
        }
    }

    function cmd1(d: number) {
        let n = d % 256;
        pins.i2cWriteNumber(_I2CAddr, n, NumberFormat.UInt16BE);
    }

    function cmd2(d1: number, d2: number) {
        _buf3[0] = 0;
        _buf3[1] = d1;
        _buf3[2] = d2;
        pins.i2cWriteBuffer(_I2CAddr, _buf3);
    }

    function cmd3(d1: number, d2: number, d3: number) {
        _buf4[0] = 0;
        _buf4[1] = d1;
        _buf4[2] = d2;
        _buf4[3] = d3;
        pins.i2cWriteBuffer(_I2CAddr, _buf4);
    }

    function set_pos(col: number = 0, page: number = 0) {
        cmd1(0xb0 | page) // page number
        cmd1(0x00 | (col % 16)) // lower start column address
        cmd1(0x10 | (col >> 4)) // upper start column address    
    }

    function char(c: string, col: number, row: number, color: number = 1) {
        let p = (Math.min(127, Math.max(c.charCodeAt(0), 32)) - 32) * 5
        let ind = col + row * 128 + 1

        for (let i = 0; i < 5; i++) {
            _screen[ind + i] = (color > 0) ? Font_5x7[p + i] : Font_5x7[p + i] ^ 0xFF
            _buf7[i + 1] = _screen[ind + i]
        }
        _screen[ind + 5] = (color > 0) ? 0 : 0xFF
        _buf7[6] = _screen[ind + 5]
        set_pos(col, row)
        pins.i2cWriteBuffer(_I2CAddr, _buf7)
    }

    function scroll() {
        _cx = 0
        _cy++
        if (_cy > 7) {
            _cy = 7
            _screen.shift(128)
            _screen[0] = 0x40
            draw(1)
        }
    }

    /**
     * clear screen
     */
    //% blockId="OLED12864_I2C_CLEAR" block="OD01 clear display"
    //% weight=85 blockGap=8
    //% group="OD01"
    export function clear() {
        _cx = _cy = 0
        _screen.fill(0)
        _screen[0] = 0x40
        draw(1)
    }

    /**
     * power up the OD01. OD01 is initialised by default on startup. 
     */
    // % blockId="OLED12864_I2C_init" block="start OD01"
    // % weight=5 blockGap=8
    function init_od01() {
        cmd1(0xAE)       // SSD1306_DISPLAYOFF
        cmd1(0xA4)       // SSD1306_DISPLAYALLON_RESUME
        cmd2(0xD5, 0xF0) // SSD1306_SETDISPLAYCLOCKDIV
        cmd2(0xA8, 0x3F) // SSD1306_SETMULTIPLEX
        cmd2(0xD3, 0x00) // SSD1306_SETDISPLAYOFFSET
        cmd1(0 | 0x0)    // line #SSD1306_SETSTARTLINE
        cmd2(0x8D, 0x14) // SSD1306_CHARGEPUMP
        cmd2(0x20, 0x00) // SSD1306_MEMORYMODE
        cmd3(0x21, 0, 127) // SSD1306_COLUMNADDR
        cmd3(0x22, 0, 63)  // SSD1306_PAGEADDR
        cmd1(0xa0 | 0x1) // SSD1306_SEGREMAP
        cmd1(0xc8)       // SSD1306_COMSCANDEC
        cmd2(0xDA, 0x12) // SSD1306_SETCOMPINS
        cmd2(0x81, 0xCF) // SSD1306_SETCONTRAST
        cmd2(0xd9, 0xF1) // SSD1306_SETPRECHARGE
        cmd2(0xDB, 0x40) // SSD1306_SETVCOMDETECT
        cmd1(0xA6)       // SSD1306_NORMALDISPLAY
        cmd2(0xD6, 0)    // zoom off
        cmd1(0xAF)       // SSD1306_DISPLAYON
        clear()
    }

    /**
     * print text to screen
     */
    //% block="OD01 print %s|newline %newline"
    //% s.defl="string"
    //% newline.defl=true
    //% weight=88 blockGap=8 inlineInputMode=inline
    //% group="OD01"
    export function printString(s: string, newline: boolean = true) {
        for (let n = 0; n < s.length; n++) {
            char(s.charAt(n), _cx, _cy, 1)
            _cx += 6
            if (_cx > 120) {
                scroll()
            }
        }
        if (newline) {
            scroll()
        }
    }

    /**
    * print a number to screen 
    */
    //% block="OD01 print number %num|newline %newline"
    //% s.defl="0"
    //% newline.defl=true
    //% weight=86 blockGap=8 inlineInputMode=inline
    //% group="OD01"
    export function printNumber(num: number, newline: boolean = true) {
        printString(num.toString(), newline)
    }

        function getSW01(): void {
        let adc_T = (getreg(0xFA, SW01_ADDR) << 12) + (getreg(0xFB, SW01_ADDR) << 4) + (getreg(0xFC, SW01_ADDR) >> 4)
        let var1 = (((adc_T >> 3) - (dig_T1 << 1)) * dig_T2) >> 11
        let var2 = (((((adc_T >> 4) - dig_T1) * ((adc_T >> 4) - dig_T1)) >> 12) * dig_T3) >> 14
        let t = var1 + var2
        //T = Math.idiv((t * 5 + 128) >> 8, 100)
        T = ((t * 5 + 128) >> 8) / 100
        var1 = (t >> 1) - 64000
        var2 = (((var1 >> 2) * (var1 >> 2)) >> 11) * dig_P6
        var2 = var2 + ((var1 * dig_P5) << 1)
        var2 = (var2 >> 2) + (dig_P4 << 16)
        var1 = (((dig_P3 * ((var1 >> 2) * (var1 >> 2)) >> 13) >> 3) + (((dig_P2) * var1) >> 1)) >> 18
        var1 = ((32768 + var1) * dig_P1) >> 15
        if (var1 == 0)
            return; // avoid exception caused by division by zero
        let adc_P = (getreg(0xF7, SW01_ADDR) << 12) + (getreg(0xF8, SW01_ADDR) << 4) + (getreg(0xF9, SW01_ADDR) >> 4)
        let _p = ((1048576 - adc_P) - (var2 >> 12)) * 3125
        //_p = Math.idiv(_p, var1) * 2;
        _p = _p/ var1 * 2;
        var1 = (dig_P9 * (((_p >> 3) * (_p >> 3)) >> 13)) >> 12
        var2 = (((_p >> 2)) * dig_P8) >> 13
        P = _p + ((var1 + var2 + dig_P7) >> 4)
        let adc_H = (getreg(0xFD, SW01_ADDR) << 8) + getreg(0xFE, SW01_ADDR)
        var1 = t - 76800
        var2 = (((adc_H << 14) - (dig_H4 << 20) - (dig_H5 * var1)) + 16384) >> 15
        var1 = var2 * (((((((var1 * dig_H6) >> 10) * (((var1 * dig_H3) >> 11) + 32768)) >> 10) + 2097152) * dig_H2 + 8192) >> 14)
        var2 = var1 - (((((var1 >> 15) * (var1 >> 15)) >> 7) * dig_H1) >> 4)
        if (var2 < 0) var2 = 0
        if (var2 > 419430400) var2 = 419430400
        H = (var2 >> 12) >> 10
    }

    /**
     * The atmospheric pressure in hPa or mbar
     * https://en.wikipedia.org/wiki/Atmospheric_pressure
     * @param u the pressure unit
     */
    //% blockId="SW01_GET_PRESSURE" block="SW01 pressure %u"
    //% group="SW01"
    //% weight=84 blockGap=8
    export function pressure(u: Pressure): number {
        getSW01();
        return fix(P / 100);
    }

    /**
     * The temperature in degrees Celcius or Fahrenheit
     * https://en.wikipedia.org/wiki/Temperature
     * @param u the temperature unit
     */
    //% blockId="SW01_GET_TEMPERATURE" block="SW01 temperature %u"
    //% group="SW01"
    //% weight=88 blockGap=8
    export function temperature(u: Temperature): number {
        getSW01();
        if (u == Temperature.Celcius) return fix(T);
        else return fix(32 + T * 9 / 5);
    }

    /**
     * The relative humidity in percent
     * https://en.wikipedia.org/wiki/Relative_humidity
     * @param u the relative humidity unit
     */
    //% blockId="SW01_GET_HUMIDITY" block="SW01 humidity %u"
    //% group="SW01"
    //% weight=86 blockGap=8
    export function humidity(u: Humidity): number {
        getSW01();
        return fix(H);
    }

    function fix(x: number) {
        return Math.round(x * 100) / 100
    }

    function setreg(reg: number, dat: number, addr: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(addr, buf);
    }

    function getreg(reg: number, addr: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    function getInt8LE(reg: number, addr: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }

    function getUInt16LE(reg: number, addr: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    function getInt16LE(reg: number, addr: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);
    }

    function getUInt16BE(reg: number, addr: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16BE);
    }

    function readBlock(reg: number, count: number, addr: number): number[] {
        let buf: Buffer = pins.createBuffer(count);
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        buf = pins.i2cReadBuffer(addr, count);

        let tempbuf: number[] = [];
        for (let i: number = 0; i < count; i++) {
            tempbuf[i] = buf[i];
        }
        return tempbuf;
    }

    function readVoltage()
    {
        let data: NumberFormat.UInt16LE;
        let a: NumberFormat.UInt8LE
        let b: NumberFormat.UInt8LE

	    data = getUInt16BE(ADC_REG_RESULT, ADC_I2C_ADDRESS)

	    a = (data & 0xFF00) >> 8
	    b = (data & 0x00FF) >> 0

	    voltage = ((((a & 0x0F)*256) + (b & 0xF0))/0x10)*(3.3/256);
    }

    function getVoltage()
    {
        readVoltage()
        return voltage
    }

    //% blockId=getMoisture 
    //% block="SW07 get moisture"
    //% group="SW07"
    export function getMoisture(): number
    {
        let value = getVoltage()
        return pins.map(value, 0, 2.63, 0, 100)
    }

    // checks if the SG33 has new data available
    function dataAvailable(): boolean {
        let status = getreg(0x00, SG33_ADDR);
        let ready = (status & 1 << 3);
        if (!ready) {
            return false;
        }
        return true;
    }

    // get new data from registers
    function getAlgorithmResults(): void {
        //let buf = pins.createBuffer(8);
        let buf: number[]= readBlock(0X02, 8, SG33_ADDR);
        //buf = pins.i2cReadBuffer(SG33_ADDR, 8, false);

        eCO2_ = (buf[0] << 8) | (buf[1]);
        TVOC_ = (buf[2] << 8) | (buf[3]);
    }

    /**
     * Volatile organic compounds (VOCs)
     * https://en.wikipedia.org/wiki/Volatile_organic_compound
     * @param u the pressure unit
     */
    //% block="SG33 TVOC"
    //% group="SG33"
    //% weight=84 blockGap=8
    export function TVOC(): number {
        getSG33();
        return TVOC_;
    }

    /**
     * The temperature in degrees Celcius or Fahrenheit
     * https://en.wikipedia.org/wiki/Carbon_dioxide
     * https://en.wikipedia.org/wiki/Carbon_dioxide_sensor#Estimated_CO2_sensor
     */
    //% block="SG33 eCO2"
    //% group="SG33"
    //% weight=88 blockGap=8
    export function eCO2(): number {
        getSG33();
        return eCO2_;
    }

    // get new sensor data from SG33
    function getSG33(): void {
        if (dataAvailable()) {
            getAlgorithmResults();
        }
    }

    function writereg(dat: number): void {
        pins.i2cWriteNumber(SG33_ADDR, dat, NumberFormat.UInt8BE);
    }

   function disableInterrupt() {
        let meas_mode = getreg(0x01, SG33_ADDR);
        meas_mode &= ~(1 << 3);
        setreg(0x01, meas_mode, SG33_ADDR);
    }

    function setDriveMode(u: Measuremode): void {
        let meas_mode = getreg(0x01, SG33_ADDR);
        meas_mode &= 0x0C;
        setreg(0x01, meas_mode | u, SG33_ADDR);
    }

        // read touch key interval
    function _readkey(): void {
        startParallel(function () {
            while (true) {
                rk = getreg(REG_InputStatus, CAP1296_I2C_ADDRESS )
                if (rk > 0) {
                    setreg(REG_MainControl, 0, CAP1296_I2C_ADDRESS )
                }
                basic.pause(_interval)
            }
        })
    }

    /**
     * Key Pressed Event
     */
    //% block="on %key Key Pressed"
    //% group="SH01"
    export function onKeyPressed(key: SH01_KEY, body: () => void): void {
        startParallel(function () {
            while (true) {
                if (rk <= 32) {
                    if (rk == key) {
                        if (KeyPressed[key >> 3] == false) {
                            KeyPressed[key >> 3] = true
                            body()
                        }
                    }
                    else KeyPressed[key >> 3] = false
                }
                basic.pause(_interval)
            }
        })
    }

    /**
     * Key Released Event
     */
    //% block="on %key Key Released"
    //% group="SH01"
    export function onKeyReleased(key: SH01_KEY, body: () => void): void {
        startParallel(function () {
            while (true) {
                if (rk <= 32) {
                    if (rk == key) {
                        KeyReleased[key >> 3] = false
                    }
                    else {
                        if (KeyReleased[key >> 3] == false) {
                            KeyReleased[key >> 3] = true
                            body()
                        }
                    }
                }
                basic.pause(_interval)
            }
        })
    }

    /**
     * If one key has been pressed.
     */
    //% block="%key has been pressed"
    //% group="SH01"
    export function keypressed(key: SH01_KEY): boolean {
        return rk == key
    }

    function writeTSL(addr: number, cmd: number) {
        let buf: Buffer = pins.createBuffer(2);
        buf[0] = addr;
        buf[1] = cmd;
        pins.i2cWriteBuffer(0x29, buf, false);
    }

    function readTSL(addr: number): number {
        let buf: Buffer = pins.createBuffer(1);
        buf[0] = addr;
        pins.i2cWriteBuffer(0x29, buf, false);
        buf = pins.i2cReadBuffer(0x29, 1, false);
        return buf[0];
    }

    function writeVEML(addr: number, cmd_L: number, cmd_H: number) {
        let buf: Buffer = pins.createBuffer(3);
        buf[0] = addr;
        buf[1] = cmd_L;
        buf[2] = cmd_H;
        pins.i2cWriteBuffer(0x10, buf, false);
    }

    function readVEML(addr: number): number {
        pins.i2cWriteNumber(0x10, addr, NumberFormat.UInt8LE, true)
        let rawData = pins.i2cReadNumber(0x10, NumberFormat.UInt16LE, false);
        return rawData;
    }

    /* reads raw uva data and calculates uva */
    function getUVAdata(): number {
        let rawUVA = readVEML(VEML6075_REG_UVA);
        let UVcomp1 = readVEML(VEML6075_REG_UVCOMP1);
        let UVcomp2 = readVEML(VEML6075_REG_UVCOMP2);
        let uva = rawUVA - ((VEML6075_UVA_VIS_COEFF * UVcomp1) - (VEML6075_UVA_IR_COEFF * UVcomp2));
        return uva;
    }

    /* reads raw uvb data and calculates uvb */
    function getUVBdata(): number {
        let rawUVB = readVEML(VEML6075_REG_UVB);
        let UVcomp1 = readVEML(VEML6075_REG_UVCOMP1);
        let UVcomp2 = readVEML(VEML6075_REG_UVCOMP2);
        let uvb = rawUVB - ((VEML6075_UVB_VIS_COEFF * UVcomp1) - (VEML6075_UVB_IR_COEFF * UVcomp2));
        return uvb;
    }

    /* calculates uvi */
    function getUVIdata(): number {
        let UVAComp = 0;
        let UVBComp = 0;
        UVAComp = (getUVAdata() * VEML6075_UVA_RESP);
        UVBComp = (getUVBdata() * VEML6075_UVB_RESP);
        let uvi = (UVAComp + UVBComp) / 2;
        return uvi;
    }

    function init(): void {
        if (initialized) return
        initialized = true
        writeVEML(VEML6075_REG_CONF, VEML6075_CONF_IT_100, 0x00);
        writeTSL((TSL4531_WRITE_CMD | TSL4531_REG_CONTROL), TSL4531_CONF_START);
        writeTSL((TSL4531_WRITE_CMD | TSL4531_REG_CONF), (TSL4531_CONF_IT_100 | TSL4531_CONF_PSAVE));
        getLUX(SL01_L.LX);
        getUVIdata();
    }


    /**
    * The ultraviolet index
    * https://en.wikipedia.org/wiki/Ultraviolet_index
    */
    //% blockId="UVIndex" block="SL01 Ultraviolet index"
    //% group="SL01"
    //% weight=90 blockGap=8
    export function getUVI(): number {
        let val = 0;
        init();
        val = fix(getUVIdata());

        return val;
    }

    	/**
  	* Illuminance in lux or foot-candle
    * https://en.wikipedia.org/wiki/Illuminance
    * @param u the illuminance unit
  	*/
    //% blockId="Lux" block="SL01 illuminance %u"
    //% group="SL01"
    //% weight=90 blockGap=8
    //% Lux.min=4 Lux.max=220000
    export function getLUX(u: SL01_L): number {
        let val = 0;
        init()
        let byteH = readTSL(0x85);
        let byteL = readTSL(0x84);
        let lux = (4 * ((byteH << 8) | byteL));
        if (u == SL01_L.LX) val = lux;
        else val = (lux / 10.764);
        
        return val;
    }



    /**
    * Connect to AllThingsTalk IoT platform
    */
    //% weight=100
    //% group="ATT"
    //% blockId="connectToATT" block="CW01 connect to ATT with token %TKN and device-id %ID"
    export function connectToATT(TKN: string, ID: string): void {
        cw01_vars.DEVICE_ID = ID
        cw01_vars.TOKEN = TKN
        en_doubleLink =  true
        basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)
        serial.writeString("AT+CIPMUX=1" + cw01_vars.NEWLINE)
        basic.pause(100)
        serial.writeString("AT+CIPSTART=0,\"TCP\",\"api.allthingstalk.io\",80" + cw01_vars.NEWLINE)
        basic.pause(1000)
        IoTMQTTConnect("api.allthingstalk.io", cw01_vars.TOKEN, "xinabox")
    }


    /**
    * Send string data to AllThingsTalk IoT platform
    */
    //% weight=99
    //% group="ATT"
    //% blockId="IoTSendStringToATT" block="CW01 send string %value to ATT asset %asset"
    export function IoTSendStringToATT(value: string, asset: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }

        cw01_button_object.sending_data = true

        do {

            cw01_vars.asset_name = asset
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": " + value + "}"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=0," + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false

    }

    /**
    * Send numerical data to AllThingsTalk IoT platform
    */
    //% weight=99
    //% group="ATT"
    //% blockId="IoTSendValueToATT" block="CW01 send value %value to ATT asset %asset"
    export function IoTSendValueToATT(value: number, asset: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }

        cw01_button_object.sending_data = true

        do {

            cw01_vars.asset_name = asset
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": " + value.toString() + "}"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=0," + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false
    }

    /**
    * Send boolean data to AllThingsTalk IoT platform
    */
    //% weight=99
    //% group="ATT"
    //% blockId="IoTSendStateToATT" block="CW01 send state %state to ATT asset %asset_name"
    export function IoTSendStateToATT(state: boolean, asset: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }


        cw01_button_object.sending_data = true

        do {

            let stateStr: string

            if (state == true) {
                stateStr = "true"
            } else {
                stateStr = "false"
            }

            cw01_vars.asset_name = asset
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": " + stateStr + "}"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=0," + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false


    }

    /**
    * Send boolean data to AllThingsTalk IoT platform
    */
    //% weight=99
    //% group="ATT"
    //% blockId="IoTSendGPSToATT" block="CW01 send GPS latitude %lat and lonitude %lon to ATT asset %asset_name"
    export function IoTSendGPSToATT(lat: string, lon: string, asset_name: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }


        cw01_button_object.sending_data = true

        do {

            cw01_vars.asset_name = asset_name
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": {\"latitude\":" + lat +", \"longitude\":" + lon + "} }"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=0," + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false


    }

    /**
    * Get latest value of asset from AllThingsTalk IoT platform. Asset can be string, numerical and boolean
    */
    //% weight=98
    //% group="ATT"
    //% blockId="IoTgetATTAssetValue" block="CW01 get ATT asset %asset state"
    export function IoTgetATTAssetValue(asset: string): string {
        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }

        cw01_button_object.sending_data = true


        cw01_vars.res = ""
        let index1: number
        let index2: number
        let value: string

        do {

            cw01_vars.asset_name = asset
            basic.pause(100)
            let request: string = "GET /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=0," + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1200)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            if (!att_connected.includes("link is not valid")) {
                serial.writeString("AT+CIPRECVDATA=200" + cw01_vars.NEWLINE)
                basic.pause(100)
                serial.readString()
                basic.pause(400)
                serial.writeString("AT+CIPRECVDATA=200" + cw01_vars.NEWLINE)
                basic.pause(400)
                cw01_vars.res += serial.readString()
                index1 = cw01_vars.res.indexOf("\"value\":") + "\"value\":".length
                index2 = cw01_vars.res.indexOf("}", index1)
                value = cw01_vars.res.substr(index1, index2 - index1)
            }

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false

        return value

    }

    
        /**
    * The function is a callback function. It executes block inside the function whenever commands from subscribed topic is received
    */
    //% weight=97
    //% group="ATT"
    //% block="CW01 on command received"
    //% blockId =onCommandReceived
    //% draggableParameters=reporter
    export function onCommandReceived(handler: (value: string, asset_name: string) => void) {

        control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_AB, EventBusValue.MICROBIT_BUTTON_EVT_CLICK, function () {

            basic.pause(20000)

            basic.showString("#")

            if(cmd_rcvd_count == 0)
            {
                cmd_rcvd_count = 1

                serial.writeString("AT+CIPRECVDATA=1,2000" + cw01_vars.NEWLINE)
                basic.pause(100)
                serial.readString()

            }

            serial.onDataReceived("\n", function () {

                while (cw01_mqtt_vars.sending_payload || cw01_mqtt_vars.sending_pingreq) {
                    basic.pause(100)
                }

                cw01_mqtt_vars.mqtt_busy = true

                let serial_res: string = serial.readString()
                let ctrl_pkt: number
                ctrl_pkt = 0

                if (serial_res.includes("IPD")) {
                    serial.readString()

                    let byte: number = 0

                    serial.writeString("AT+CIPRECVDATA=1,1" + cw01_vars.NEWLINE)
                    basic.pause(100)

                    let count = 0
                    let buf = pins.createBuffer(1)

                    while(byte != 58)
                    {
                        buf.setNumber(NumberFormat.UInt8LE, 0, serial.readBuffer(1)[0])
                        if(buf)
                        {
                            byte = buf.getNumber(NumberFormat.Int8LE, 0)
                        }else{
                            break
                        }
                    }

                    ctrl_pkt = (pins.unpackBuffer("!B", serial.readBuffer(1)))[0]

                    if (ctrl_pkt == 48) {
                        IoTMQTTGetData()
                        handler(IoTATTGetValue(), IoTATTGetAssetName())
                    } else if (ctrl_pkt == 208) {
                        ctrl_pkt = 0
                        serial.writeString("AT+CIPRECVDATA=1,200" + cw01_vars.NEWLINE)
                        basic.pause(100)
                    }
                }

                cw01_mqtt_vars.mqtt_busy = false

            })
        })
    }

    
    /**
    * Connect to MQTT broker through port number 1883
    */
    function IoTMQTTConnect(broker: string, Username: string, Password: string): void {

        if(en_doubleLink)
        {
            serial.writeString("AT+CIPSTART=1,\"TCP\",\"" + broker + "\",1883" + cw01_vars.NEWLINE)
        }else{
            serial.writeString("AT+CIPSTART=\"TCP\",\"" + broker + "\",1883" + cw01_vars.NEWLINE)
        }
        basic.pause(7000)

        let protocol_name_prior: Buffer = pins.packBuffer("!H", [4])
        let protocol_name: string = "MQTT"
        let protocol_lvl: Buffer = pins.packBuffer("!B", [4])
        //let msg_part_one: string = protocol_name + protocol_lvl
        let connect_flags: Buffer = (pins.packBuffer("!B", [(1 << 7) | (1 << 6) | (1 << 1)]))
        let keep_alive: Buffer = pins.packBuffer("!H", [3600])
        let client_id: string

        if (cw01_mqtt_vars.id_enable) {
            client_id = cw01_mqtt_vars.id
        } else {
            client_id = cw01_mqtt_vars.mac_addr
        }

        let client_id_len: Buffer = pins.packBuffer("!H", [client_id.length])
        let username: string = Username
        let username_len: Buffer = pins.packBuffer("!H", [username.length])
        let password: string = Password
        let password_len: Buffer = pins.packBuffer("!H", [password.length])
        //let msg_part_two = client_id_len + client_id + username_len + username + password_len + password

        if(en_doubleLink)
        {
            serial.writeString("AT+CIPSEND=1," + (1 + 1 + protocol_name_prior.length + protocol_name.length + protocol_lvl.length + connect_flags.length + keep_alive.length + client_id_len.length + client_id.length + username_len.length + username.length + password_len.length + password.length) + cw01_vars.NEWLINE)
        }else{
            serial.writeString("AT+CIPSEND=" + (1 + 1 + protocol_name_prior.length + protocol_name.length + protocol_lvl.length + connect_flags.length + keep_alive.length + client_id_len.length + client_id.length + username_len.length + username.length + password_len.length + password.length) + cw01_vars.NEWLINE)
        }
        basic.pause(1000)

        //Msg part one
        serial.writeBuffer(pins.packBuffer("!B", [1 << 4]))
        serial.writeBuffer(pins.packBuffer("!B", [protocol_name_prior.length + protocol_name.length + protocol_lvl.length + connect_flags.length + keep_alive.length + client_id_len.length + client_id.length + username_len.length + username.length + password_len.length + password.length]))

        //Msg part two
        serial.writeBuffer(protocol_name_prior)
        serial.writeString(protocol_name)
        serial.writeBuffer(protocol_lvl)
        serial.writeBuffer(connect_flags)
        serial.writeBuffer(keep_alive)
        serial.writeBuffer(client_id_len)
        serial.writeString(client_id)
        serial.writeBuffer(username_len)
        serial.writeString(username)
        serial.writeBuffer(password_len)
        serial.writeString(password)

        basic.pause(3000)

        cw01_vars.timer = input.runningTime()

        if(en_doubleLink)
        {
            serial.writeString("AT+CIPRECVDATA=1,200" + cw01_vars.NEWLINE)
        }else{
            serial.writeString("AT+CIPRECVDATA=200" + cw01_vars.NEWLINE)
        }
        basic.pause(100)
        serial.readString()

        control.inBackground(function () {
            while (true) {
                basic.pause(30000)
                if (((input.runningTime() - cw01_vars.timer) > 180000) && !cw01_mqtt_vars.sending_payload && !cw01_mqtt_vars.receiving_msg) {
                    cw01_mqtt_vars.sending_pingreq = true
                    cw01_vars.timer = input.runningTime()
                    let header_one: Buffer = pins.packBuffer("!B", [0xC0])
                    let header_two: Buffer = pins.packBuffer("!B", [0x00])

                    if(en_doubleLink)
                    {
                        serial.writeString("AT+CIPSEND=1," + (header_one.length + header_two.length) + cw01_vars.NEWLINE)
                    }else{
                        serial.writeString("AT+CIPSEND=" + (header_one.length + header_two.length) + cw01_vars.NEWLINE)
                    }
                    basic.pause(100)

                    serial.writeBuffer(header_one)
                    serial.writeBuffer(header_two)

                    cw01_mqtt_vars.sending_pingreq = false
                }


            }
        })

        control.raiseEvent(EventBusSource.MICROBIT_ID_BUTTON_AB, EventBusValue.MICROBIT_BUTTON_EVT_CLICK)


    }

        /**
    * Subscribe to ATT asset
    */
    //% weight=97
    //% group="ATT"
    //% blockId="IoTATTSubscribe" block="CW01 subscribe to ATT asset command %asset"
    export function IoTATTSubscribe(asset: string): void {

        while (cw01_mqtt_vars.sending_pingreq || cw01_mqtt_vars.receiving_msg || cw01_mqtt_vars.mqtt_busy) {
            basic.pause(100)
        }

        //Msg part two
        let pid: Buffer = pins.packBuffer("!H", [0xDEAD])
        let qos: Buffer = pins.packBuffer("!B", [0x00])
        let topic: string = "device/" + cw01_vars.DEVICE_ID + "/asset/" + asset + "/command"
        let topic_len: Buffer = pins.packBuffer("!H", [topic.length])

        //Msg part one
        let ctrl_pkt: Buffer = pins.packBuffer("!B", [0x82])
        let remain_len: Buffer = pins.packBuffer("!B", [pid.length + topic_len.length + topic.length + qos.length])

        serial.writeString("AT+CIPSEND=1," + (ctrl_pkt.length + remain_len.length + pid.length + topic_len.length + topic.length + qos.length) + cw01_vars.NEWLINE)

        basic.pause(1000)

        serial.writeBuffer(ctrl_pkt)
        serial.writeBuffer(remain_len)
        serial.writeBuffer(pid)
        serial.writeBuffer(topic_len)
        serial.writeString(topic)
        serial.writeBuffer(qos)

        basic.pause(2000)

        serial.readString()

        /*serial.writeString("AT+CIPRECVDATA=1" + cw01_vars.NEWLINE)
        basic.pause(100)
        serial.readBuffer(17)
        basic.showNumber((pins.unpackBuffer("!B", serial.readBuffer(1)))[0])*/

        serial.writeString("AT+CIPRECVDATA=1,200" + cw01_vars.NEWLINE)
        basic.pause(100)
        serial.readString()

        basic.pause(100)

    }
    
    function IoTMQTTGetData(): void {
        let topic_len_MSB: number[]
        let topic_len_LSB: number[]
        let topic_len: number = 0

        let payload: string

        cw01_mqtt_vars.sending_payload.toString()
        while (cw01_mqtt_vars.sending_payload || cw01_mqtt_vars.sending_pingreq) {
            basic.pause(100)
        }

        cw01_mqtt_vars.receiving_msg = true

        serial.writeString("AT+CIPRECVDATA=1,1" + cw01_vars.NEWLINE)
        basic.pause(200)
        serial.readString()
        serial.writeString("AT+CIPRECVDATA=1,1" + cw01_vars.NEWLINE)
        basic.pause(200)
        serial.readBuffer(17)
        topic_len_MSB = pins.unpackBuffer("!B", serial.readBuffer(1))
        serial.readString()
        serial.writeString("AT+CIPRECVDATA=1,1" + cw01_vars.NEWLINE)
        basic.pause(200)
        serial.readBuffer(17)
        topic_len_LSB = pins.unpackBuffer("!B", serial.readBuffer(1))
        serial.readString()

        topic_len = (topic_len_MSB[0] << 8) + topic_len_LSB[0]

        serial.writeString("AT+CIPRECVDATA=1,200" + cw01_vars.NEWLINE)
        basic.pause(200)

        cw01_vars.mqtt_message = serial.readString()

        cw01_mqtt_vars.new_topic = cw01_vars.mqtt_message.substr(cw01_vars.mqtt_message.indexOf(":") + 1, topic_len)
        cw01_mqtt_vars.new_payload = cw01_vars.mqtt_message.substr(cw01_vars.mqtt_message.indexOf(":") + 1 + cw01_mqtt_vars.new_topic.length, cw01_vars.mqtt_message.length - (cw01_vars.mqtt_message.indexOf(":") + cw01_mqtt_vars.new_topic.length + 6))

        cw01_mqtt_vars.receiving_msg = false
    }

    function IoTATTGetValue(): string {

        let index1 = cw01_mqtt_vars.new_payload.indexOf("\"value\":") + "\"value\":".length
        let index2 = cw01_mqtt_vars.new_payload.indexOf(",", index1)
        let value = cw01_mqtt_vars.new_payload.substr(index1, index2 - index1)
        return value
    }

    function IoTATTGetAssetName(): string {

        let index1 = cw01_mqtt_vars.new_topic.indexOf("/asset/") + "/asset/".length
        let index2 = cw01_mqtt_vars.new_topic.indexOf("/", index1)
        let asset = cw01_mqtt_vars.new_topic.substr(index1, index2 - index1)

        return asset

    }

    /**
    * Enable feedback through microbit Matrix LEDs
    */
    //% weight=91
    //% group="Wifi-Common"
    //% blockId="enableFeedback" block="CW01 enable feedback LEDs %u"
    export function enableFeedback(u: boolean): void
    {
        en_Feedback = u
    }

        /**
    * Connect to W-Fi 
    */
    //% weight=91
    //% group="Wifi-Common"
    //% blockId="connectToWifi" block="CW01 connect to WiFi SSID %SSID password %PSK"
    export function connectToWifi(SSID: string, PSK: string): void {
        serial.writeString("AT+CWMODE=1" + cw01_vars.NEWLINE)
        basic.pause(100)
        serial.readString()
        serial.writeString("AT+CWJAP=\"" + SSID + "\",\"" + PSK + "\"" + cw01_vars.NEWLINE)
        basic.pause(200)
        serial.readString()

        do {
            cw01_vars.res = serial.readString()
            basic.pause(1000)
        } while (!cw01_vars.res.includes("WIFI CONNECTED"));

        if (cw01_vars.res.includes("WIFI CONNECTED")) {
            basic.showString("C")
            basic.pause(2000)
            basic.showString("")
            cw01_vars.res = ""
        } else {
            basic.showString("D")
        }
    }

    function get_status(): boolean {

        basic.pause(1000)
        serial.writeString("AT+CIPRECVDATA=0,200" + cw01_vars.NEWLINE)
        basic.pause(300)
        cw01_vars.res = serial.readString()

        if(en_Feedback)
        {
            if (cw01_vars.res.includes("HTTP/1.1 200") || cw01_vars.res.includes("HTTP/1.0 200") || cw01_vars.res.includes("HTTP/1.1 201") || cw01_vars.res.includes("HTTP/1.0 202")) {
                basic.showIcon(IconNames.Yes, 50)
                basic.showString("", 50)
                return true
            } else {
                basic.showIcon(IconNames.No, 50)
                basic.showString("", 50)
                return false
            }
        }else {
            if (cw01_vars.res.includes("HTTP/1.1 200") || cw01_vars.res.includes("HTTP/1.0 200") || cw01_vars.res.includes("HTTP/1.1 201") || cw01_vars.res.includes("HTTP/1.0 202"))
            {
                basic.pause(200)
                return true
            }else{
                basic.pause(200)
                return false
            }
        }
    }

    function read_and_set_name(): void {
        let name: string = "";
        name = serial.readString()

        if (!(name.includes("CW01"))) {
            serial.writeString("AT+CWHOSTNAME=\"CW01\"" + cw01_vars.NEWLINE)

            if(name.includes("ESP") || name.includes("CW01"))
            {

                if (!(name.includes("CW01"))) {
                    serial.writeString("AT+CWHOSTNAME=\"CW01\"" + cw01_vars.NEWLINE)
                    basic.pause(1000)
                    control.reset()
                }

            }
        }
    }
	
	//%block="IM01 overwrite file %u with %v"
    //%u.defl="log.txt"
    //%group="SD CARD"
    export function overwriteFile(u: string, v: string): void {
        file("/sd/im01/" + u, v, "w")
        return
    }

    //%block="IM01 append file %u with %v"
    //%u.defl="log.txt"
    //%group="SD CARD"
    export function appendFile(u: string, v: string): void {
        file("/sd/im01/" + u, v, "a")
        return
    }

    //%block="IM01 append file %u with line %v"
    //%u.defl="log.txt"
    //%group="SD CARD"
    export function appendFileLine(u: string, v: string): void {
        file("/sd/im01/" + u, v + "\n", "a")
        return
    }


    //%shim=im01::_file
    function file(u: string, v: string, x: string): boolean {
        return true
    }

    //% shim=parall::startParallel
    export function startParallel(u: () => void) {
        return 1;
    }

}