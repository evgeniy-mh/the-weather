#pragma once

#include <U8g2lib.h>

#ifdef U8X8_HAVE_HW_SPI
#include <SPI.h>
#endif
#ifdef U8X8_HAVE_HW_I2C
#include <Wire.h>
#endif

#define LCD_CLOCK D5
#define LCD_CS D6
#define LCD_DATA D7

class LCD128x64{
    public:
        LCD128x64();
        void printData(String IP, int co2, int temp, int humid);
};