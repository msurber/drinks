#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_PWMServoDriver.h"

// Create the motor shield object with the default I2C address
Adafruit_MotorShield AFMS0 = Adafruit_MotorShield(0x60); 
Adafruit_MotorShield AFMS1 = Adafruit_MotorShield(0x61); 
// Or, create it with a different I2C address (say for stacking)
// Adafruit_MotorShield AFMS = Adafruit_MotorShield(0x61); 

// Select which 'port' M1, M2, M3 or M4. In this case, M1
Adafruit_DCMotor *myMotor[8] = {AFMS0.getMotor(1),AFMS0.getMotor(2),AFMS0.getMotor(3),AFMS0.getMotor(4),AFMS1.getMotor(1),AFMS1.getMotor(2),AFMS1.getMotor(4),AFMS1.getMotor(3)};
int directions[8] = {FORWARD,BACKWARD,FORWARD,BACKWARD,FORWARD,BACKWARD,FORWARD,BACKWARD};
// You can also make another motor on port M2
//Adafruit_DCMotor *myOtherMotor = AFMS.getMotor(2);

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps
  Serial.println("Adafruit Motorshield v2 - DC Motor test!");

  AFMS0.begin();  // create with the default frequency 1.6KHz
  AFMS1.begin();  // create with the default frequency 1.6KHz
}

int duration[8]={0,0,0,0,0,0,0,0};
String readString;
int counter = 0;
int glassSizeFactor = 90; // 10 seconds

void loop()                     // run over and over again
{
 while (Serial.available()) {
    char c = Serial.read();  //gets one byte from serial buffer
    readString += c; //makes the string readString
    delay(2);  //slow looping to allow buffer to fill with next character
  }

  if (readString.length() >0) {
    int n = readString.toInt();  //convert readString into a number
    readString = "";
    int selectedDuration = n % 10;
    int selectedMotor = n / 10;
    if (selectedDuration == 8) {
        // set The glassSizeFactor by sending 8x where x is the number of seconds that a pump runs when p1 is sent 
        glassSizeFactor = selectedDuration * 10;
    } else {
        // stop all the motors by sending 90
        if (selectedDuration == 9) {
            for (int i=0; i < 8; i++){
                duration[i] = 0;
            }
        } else {
            duration[selectedMotor] = selectedDuration * glassSizeFactor;
            Serial.println(duration[selectedMotor]);
        }
    }
  }    
    /*ECHO the value that was read, back to the serial port. */
      //myMotor->run(FORWARD);
      //myMotor->setSpeed(255); 
  for (int i=0; i < 8; i++){
    if (duration[i] > 0) {
      myMotor[i]->setSpeed(255);  
      myMotor[i]->run(directions[i]);
      
      duration[i]--;
    } else {
      myMotor[i]->run(RELEASE);
    }
  }
  counter++;
  if (counter > 9) {
    Serial.print("'");
    Serial.print(duration[0]);
    Serial.print("','");
    Serial.print(duration[1]);
    Serial.print("','");
    Serial.print(duration[2]);
    Serial.print("','");
    Serial.print(duration[3]);
    Serial.print("','");
    Serial.print(duration[4]);
    Serial.print("','");
    Serial.print(duration[5]);
    Serial.print("','");
    Serial.print(duration[6]);
    Serial.print("','");
    Serial.print(duration[7]);
    Serial.println("'");
    counter = 0;
  } 

  delay(100);
}
