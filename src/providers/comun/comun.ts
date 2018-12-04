import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';
import * as _ from 'lodash'
import { OneSignal } from '@ionic-native/onesignal';

@Injectable()
export class ComunProvider {


  // -----------------------------------------------------------------
  // Attributes
  // -----------------------------------------------------------------
  user = {} as iUser

  initToken: string = ''

  idPaciente: string
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private oneSignal: OneSignal
  ) {
    console.log('Hello ComunProvider Provider');
  }


  // -----------------------------------------------------------------
  // Nativos
  // -----------------------------------------------------------------
  showLoading(msg: string) {
    let loader = this.loadingCtrl.create({
      content: msg,
    });
    return loader
  }

  showAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ["Listo"]
    })
    alert.present()
  }


  // -----------------------------------------------------------------
  // FIREBASE
  // -----------------------------------------------------------------
  loginFirebase(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(data => {
          resolve(data)
        }).catch(error => {
          reject(this.getErrorLogin(error))
        })
    });
  }

  getErrorLogin(error: firebase.FirebaseError): string {
    let mensaje: string
    if (error.code === 'auth/user-not-found')
      mensaje = 'Email or invalid password.'
    else if (error.code === 'auth/argument-error')
      mensaje = 'Insert email and password'
    else if (error.code === 'auth/weak-password')
      mensaje = 'Password must have at least 6 characters'
    else if (error.code === 'auth/email-already-in-use')
      mensaje = 'Email is already in use'
    else if (error.code === 'auth/invalid-email') {
      mensaje = 'Invalid email'
    } else if (error.code === 'auth/wrong-password')
      mensaje = 'Invalid password'
    else {
      mensaje = error.message
    }
    return mensaje
  }


  // -----------------------------------------------------------------
  // usuario
  // -----------------------------------------------------------------
  async loadUser(key: string): Promise<any> {
    return new Promise((user) => {
      let temp = _.isEmpty(this.user)
      if (temp) {
        firebase.database().ref('usuarios').child(key).once('value', data => {
          let u: iUser = data.val()
          this.user = u
          return user(this.user)
        })
      } else {
        return user(this.user)
      }
    })
  }

  async saveUserbyFirsTime(userInfo): Promise<any> {
    this.user.exploracionFisica = {
      peso: userInfo['peso'],
      talla: userInfo['talla'],
      imc: userInfo['imc'],
      temperatura: userInfo['temperatura'],
      freCardiaca: userInfo['freCardiaca'],
      frecRespiratoria: userInfo['frecRespiratoria']
    }

    this.user.antecedentesMed = {
      presionArterial: userInfo['presionArterial'],
      diabetes: userInfo['diabetesMed'],
      alergias: userInfo['alergias'],
      cirugias: userInfo['cirugias'],
      otros: userInfo['otrosMed']
    }

    this.user.antecedentesFam = {
      cancer: userInfo['cancer'],
      hipertencion: userInfo['hipertencion'],
      enferCardiacas: userInfo['enferCardiacas'],
      diabetes: userInfo['diabetesFam'],
      otros: userInfo['otrosFam']
    }

    this.user.infoGeneral = {
      genero: userInfo['genero'],
      edad: userInfo['edad'],
      numFijo: userInfo['numFijo'],
      nombreFamiliar: userInfo['nombreFamiliar'],
      numFamiliar: userInfo['numFamiliar'],
      numMedico: userInfo['numMedico'],
      nombreMedico: userInfo['nombreMedico'],
      grupoSanguineo: userInfo['grupoSanguineo'],
      rh: userInfo['rh'],
      ocupacion: userInfo['ocupacion'],
      tipoDoc: userInfo['tipoDoc'],
      doc: userInfo['documento'],
      fechaReg: new Date().getTime(),
      ubicacion: ''
    }

    this.user.medicamentos = userInfo['medicamentos']

    return new Promise((ok, err) => {
      firebase.database().ref('usuarios').child(this.user.key).update(this.user).then(() => {
        ok('ok')
      }).catch(() => {
        err('error')
      })
    })
  }


  // -----------------------------------------------------------------
  // one Signal start
  // -----------------------------------------------------------------
  oneSognalInit(): Promise<any> {
    return new Promise((result) => {
      this.oneSignal.startInit('b8582ab1-a1dc-4747-90d1-2e5c922c00b0', '175526358336')
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe((data) => {
        console.log('display notification recivida');
      });

      this.oneSignal.handleNotificationOpened().subscribe((data) => {
        this.idPaciente = data.notification.payload.body.split(" ").splice(-1)[0]
        console.log(this.idPaciente);
        firebase.database().ref('usuarios').child(this.idPaciente).once('value', data =>{
          this.user = data.val()
        })
        
      });
      this.oneSignal.endInit();
      result()
    })
  }

  oneSignalToken() {
    this.oneSignal.getIds().then(data => {
      this.initToken = data.userId
    })
  }

  sendPush(title, message, tokens) {
    let temp
    if (typeof tokens == "string") temp = [tokens]
    else temp = tokens

    this.oneSignal.postNotification({
      isAppInFocus: true,
      shown: true,

      payload: {
        notificationID: 'b8582ab1-a1dc-4747-90d1-2e5c922c00b0',
        title: title,
        body: message,
        sound: "",
        actionButtons: [],
        rawPayload: "",
      },
      displayType: this.oneSignal.OSInFocusDisplayOption.Notification,
      contents: { en: message },
      headings: { en: title },
      include_player_ids: temp
    }).then(
      info => {
        console.log(info)
      },
      err => {
        console.log(err)
      }
    )
  }


}

export interface iUser {
  key: string
  token: string
  name: string
  lastName: string
  role: string
  email: string
  numCelular: number
  infoGeneral?: infoGeneral
  antecedentesMed?: antecedentesMed
  antecedentesFam?: antecedentesFam
  exploracionFisica?: exploracionFisica
  medicamentos?: string
}

export interface exploracionFisica {
  peso: number
  talla: number
  imc: number
  temperatura: number
  freCardiaca: number
  frecRespiratoria: number
}

export interface antecedentesFam {
  cancer: string
  hipertencion: boolean
  enferCardiacas: string
  diabetes: boolean
  otros: string
}
export interface antecedentesMed {
  presionArterial: number
  diabetes: boolean
  alergias: string
  cirugias: string
  otros: string
}

export interface infoGeneral {
  tipoDoc: string
  doc: number
  fechaReg: number
  genero: string
  edad: number
  numFijo: number
  numFamiliar: number
  nombreFamiliar: string
  numMedico: number
  nombreMedico: string
  grupoSanguineo: string
  rh: string
  ocupacion: string
  ubicacion: string
}
