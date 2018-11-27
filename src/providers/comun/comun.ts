import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';


@Injectable()
export class ComunProvider {


  // -----------------------------------------------------------------
  // Attributes
  // -----------------------------------------------------------------
  user = {} as iUser
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
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
  async loadUser() {
    if (this.user != undefined) {
      if (this.user.key == undefined) {
        // console.log('making the call for user information')
        const response = await firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).get()
        if (response) {
          this.user = <iUser>response.data()
        }
        return this.user
      } else {
        return this.user
      }
    } else {
      this.user = <iUser>{}
    }
  }


}

export interface iUser {
  key: string
  name: string
  lastName: string
  role: string
  email: string
  infoGeneral?: infoGeneral
  antecedentesMed?: antecedentesMed
  antecedentesFam?: antecedentesFam
  medicamentos?: string
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
  genero: string
  edad: number
  numFijo: number
  numCelular: number
  numFamiliar: number
  nombreFamiliar: string
  numMedico: number
  nombreMedico: string
  grupoSanguineo: string
  rh: string
  ocupacion: string
  ubicacion: string

}
