import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';


// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HistorialMedicoPage } from '../../comun/historial-medico/historial-medico';

// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider, iUser } from "../../../providers/comun/comun";
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';


// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase'
import * as _ from 'lodash'




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {



  controler: number = 1

  segs: number = 5

  historic: any[] = []
  register: any[] = []

  counterSeg: number = 30
  counterMil: number = 99

  counterRef: number = 0
  validatorStart: boolean = true
  validatorSecond: boolean = true



  x: number = 0
  y: number = 0
  z: number = 0

  constructor(
    public navCtrl: NavController,
    private gyroscope: Gyroscope,
    private tts: TextToSpeech,
    private comun: ComunProvider
  ) {
  }

  ngOnInit() {
    // this.motion.unsubscribe()
    this.register = []
  }

  ngAfterViewInit() {
    firebase.database().ref('observer').child(this.comun.user.key).on('child_changed', (temp) => {
      this.startProces()
    })
  }


  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------


  goToHistorialMedico() {
    this.navCtrl.push(HistorialMedicoPage)
  }

  stopCounter() {
    if (this.counterRef === 0)
      this.validatorStart = false
    else if (this.counterRef === 1)
      this.validatorSecond = false
    this.counterRef = 0
  }


  startProces() {
    document.getElementById('bigBtn').classList.add('showBtn')
    document.getElementById('counter').classList.add('showBtn')

    var inter = setInterval(() => {
      if (this.validatorStart) {
        if (this.counterMil > 0) {
          this.counterMil--
        }
        if (this.counterMil === 0) {
          this.counterMil = 99
          this.counterSeg--
        }

        if (this.counterSeg === 0) {
          clearInterval(inter)
          this.secondStep()
        }
      } else {
        clearInterval(inter)
        this.counterMil = 99
        this.counterSeg = 30
        this.validatorStart = true
        document.getElementById('bigBtn').classList.remove('showBtn')
        document.getElementById('counter').classList.remove('showBtn')
      }
    }, 10);


  }

  secondStep() {
    document.getElementById('bigBtn').classList.add('redBtn')

    this.counterRef = 1
    this.counterSeg = 10
    this.tts.speak({
      text: 'Toque el botón rojo si se encuentra bien, tiene 10 segundos',
      rate: 0.8,
      locale: 'es-LA'
    })
      .then(() => {

    var inter = setInterval(() => {
      if (this.validatorSecond) {
        if (this.counterMil > 0) {
          this.counterMil--
        }
        if (this.counterMil === 0) {
          this.counterMil = 99
          this.counterSeg--
        }

        if (this.counterSeg === 0) {
          clearInterval(inter)
          this.thirthStep()
        }
      } else {
        clearInterval(inter)
        this.validatorSecond = true
        document.getElementById('bigBtn').classList.remove('redBtn')
        document.getElementById('bigBtn').classList.remove('showBtn')
        document.getElementById('counter').classList.remove('showBtn')
        this.counterMil = 99
        this.counterSeg = 30
      }
    }, 10);
    })
    .catch((reason: any) => console.log(reason));
  }

  async thirthStep() {
    let number = this.comun.user.infoGeneral.numMedico
    let docInfo = await firebase.database().ref('usuarios').orderByChild('numCelular').equalTo(number).once('value')
    let ambulancias = await firebase.database().ref('usuarios').orderByChild('role').equalTo('ambulancia').once('value')
    let temp = docInfo.val()
    let docToken = _.values(temp)

    let ambTokens: Array<any> = []
    let tempAmbulancias = ambulancias.val()
    for (let i in tempAmbulancias) {
      ambTokens.push(tempAmbulancias[i]['token'])
    }




    let tile: string = 'Alerta de Caida'
    let boddy: string = 'El usuario ' + this.comun.user.name + ' ' + this.comun.user.lastName + ' se ha caido, entra all app para ver su información. El usuario se identifica con el ID ' + this.comun.user.key
    this.startSaveInfo()
    this.comun.sendPush(tile, boddy, ambTokens)
    this.comun.sendPush(tile, boddy, docToken[0]['token'])





    document.getElementById('bigBtn').classList.remove('redBtn')
    document.getElementById('bigBtn').classList.remove('showBtn')
    document.getElementById('counter').classList.remove('showBtn')
    this.counterMil = 99
    this.counterSeg = 30
  }


  startSaveInfo() {
    let options: GyroscopeOptions = {
      frequency: 3000
    };

    let t = setInterval(() => {
      this.gyroscope.getCurrent(options)
        .then((orientation: GyroscopeOrientation) => {
          firebase.database().ref('events').child(this.comun.user.key).push({
            x: orientation.x,
            y: orientation.y,
            z: orientation.z
          })
        })
        .catch()
    }, 3000);
  }


}
