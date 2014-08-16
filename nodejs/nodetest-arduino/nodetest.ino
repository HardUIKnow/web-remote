void setup(){
  Serial.begin(9600);
}

void loop(){

  if (Serial.available() >0){
    char data = Serial.read();
    switch(data){
        case 'H':
            Serial.println("led on");
            break;
        case 'L':
            Serial.println("led off");
            break;
        default:
            Serial.println("Idle");
            break;
    }
  } else {
    Serial.println("ready");
  }
  delay(1000);
}
