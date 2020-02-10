#include "LCD128x64.h"

U8G2_ST7920_128X64_F_SW_SPI u8g2(U8G2_R2, LCD_CLOCK, LCD_DATA, LCD_CS, /* reset=*/ 16); 

LCD128x64::LCD128x64(){
    u8g2.begin();
    u8g2.enableUTF8Print();
}

void LCD128x64::printData(String IP, int co2, int temp, int humid){  
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB08_tr);
    u8g2.setCursor(0, 10);
    u8g2.print(IP);
    u8g2.setCursor(0, 30);
    u8g2.print(co2);
    u8g2.setCursor(0, 40);
    u8g2.print(temp);
    u8g2.setCursor(0, 50);
    u8g2.print(humid);  
    u8g2.setCursor(0, 60);
    u8g2.print(millis());  
    u8g2.sendBuffer();
}