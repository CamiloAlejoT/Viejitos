import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  freq: DeviceMotionAccelerometerOptions = {
    frequency: 10
  }

  controler: number = 1

  segs: number = 5

  historic: any[] = []
  register: any[] = []

  motion = this.deviceMotion.watchAcceleration(this.freq).subscribe((acceleration: DeviceMotionAccelerationData) => {
    console.log(acceleration.z);
    
    this.register.push(acceleration.z)
  })

  x: number = 0
  y: number = 0
  z: number = 0

  constructor(
    public navCtrl: NavController,
    private deviceMotion: DeviceMotion
  ) {
  }
  
  ngOnInit() {
    // this.motion.unsubscribe()
    this.register = []
  }

  ngAfterViewInit() {
  }


  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------
  startConf() {
    let d = new Date
    console.log(d.getTime());
    this.motion
  }

  startRep() {
    let inter = setInterval(() => {
      this.segs--
      if (this.segs == 0) {
        clearInterval(inter)
        this.controler = 2
        this.motion.unsubscribe()
        this.getAvg()
      }
    }, 1000)
  }

  getAvg() {
    let temp = 0
    for (let i of this.register) {
      temp += i
    }
    this.historic.push((temp) / this.register.length)
    // this.register = []
    console.log(this.historic);

  }

  startCaida() {
    this.startConf()
    setTimeout(() => {
      this.motion.unsubscribe()
      this.getAvg()
    }, 5000);
  }


  startRegister() {
    if (this.register.length > 0) {
      this.historic.push()
    }
  }



}
