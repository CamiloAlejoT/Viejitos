import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HistorialMedicoPage } from "../historial-medico/historial-medico";
import { MedicoHomePage } from '../../medico/medico-home/medico-home';
import { HomePage } from '../../paciente/home/home';

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase'

// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider, iUser } from "../../../providers/comun/comun";
import { MbulanciaPage } from '../../mbulancia/mbulancia';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // -----------------------------------------------------------------
  // Attributes
  // -----------------------------------------------------------------
  option: string = "login";
  formLogin: FormGroup
  formRegistration: FormGroup
  email: string = ''
  password: string = ''

  singInForm: object = {
    email: null,
    password: null
  }

  registerForm: object = {
    name: null,
    lastname: null,
    email: null,
    password: null,
    terms: false,
    rol: 'paciente',
    numCelular: null
  }

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public comun: ComunProvider
  ) {
    this.menuCtrl.enable(false, 'side-menu')

    // formgroup de login 
    this.formLogin = new FormGroup({
      'email': new FormControl(this.singInForm['email'], [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(this.singInForm['password'], [
        Validators.required,
        Validators.minLength(6)
      ])
    })

    // formgroup de registro
    this.formRegistration = new FormGroup({
      'name': new FormControl(this.registerForm['name'], Validators.required),
      'lastname': new FormControl(this.registerForm['lastname'], Validators.required),
      'email': new FormControl(this.registerForm['email'], [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(this.registerForm['password'], [
        Validators.required,
        Validators.minLength(6)
      ]),
      'terms': new FormControl(this.registerForm['terms'], [
        Validators.required,
        Validators.requiredTrue
      ]),
      'rol': new FormControl(this.registerForm['rol'], Validators.required),
      'numCelular': new FormControl(this.registerForm['numCelular'])
    })
  }


  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login() {
    const loader = this.comun.showLoading('Iniciando Sesión')
    loader.present()
    this.comun.loginFirebase(this.formLogin.value['email'], this.formLogin.value['password'])
      .then(user => {
        if (user) {
          this.comun.loadUser(user.user.uid).then(temp => {
            let u: iUser = temp
            localStorage.setItem('uInfo', JSON.stringify(u))
            loader.dismiss()
            switch (u.role) {
              case 'paciente':
                if (u.antecedentesFam && u.antecedentesMed && u.infoGeneral && u.medicamentos) this.navCtrl.setRoot(HomePage)
                else this.navCtrl.setRoot(HistorialMedicoPage)
                break;
              case 'medico':
                this.navCtrl.setRoot(MedicoHomePage)
                break;
              case 'ambulancia':
                this.navCtrl.setRoot(MbulanciaPage)
                break;
              case 'familiar':
                break;
            }
          })
        }
      }).catch(error => {
        loader.dismiss()
        this.comun.showAlert('Error', error)
      })
  }


  async registration() {
    let loader = this.comun.showLoading('Creando tu usuario')
    loader.present()
    let resultComp = await this.verifyUser()
    if (resultComp) {
      firebase.auth().createUserWithEmailAndPassword(this.formRegistration.value.email, this.formRegistration.value.password)
        .then((resp) => {
          let User: iUser = {
            email: this.formRegistration.value['email'],
            key: resp.user.uid,
            role: this.formRegistration.value['rol'],
            lastName: this.formRegistration.value['lastname'],
            name: this.formRegistration.value['name'],
            token: this.comun.initToken,
            numCelular: this.formRegistration.value['numCelular'],
          }

          this.comun.user = User
          localStorage.setItem('uInfo', JSON.stringify(User))

          firebase.database().ref('usuarios').child(resp.user.uid).set(User).then(() => {
            firebase.database().ref('observer').child(resp.user.uid).set({
              start: false
            })
            loader.dismiss()
            switch (this.formRegistration.value['rol']) {
              case 'paciente':
                this.navCtrl.setRoot(HistorialMedicoPage)
                break;
              case 'medico':
                this.navCtrl.setRoot(MedicoHomePage)
                break;
              case 'ambulancia':
                this.navCtrl.setRoot(MbulanciaPage)
                break;
              case 'familiar':
                break;
            }
          })
        })
    } else {
      loader.dismiss()
      this.comun.showAlert('Error', 'El número ya se encuentra en uso')
    }
  }

  forgotPassword() {
    this.formLogin.value['email'] ?
      firebase.auth().sendPasswordResetEmail(this.formLogin.value['email']).then(() => {
        this.comun.showAlert('Envío éxitoso', 'Se ha enviado un correo para que puedas cambiar tu contraseña')
      }).catch((error) => {
        this.comun.showAlert('Error', error)
      })
      :
      this.comun.showAlert('Error', 'Ingresa un correo para que te llegue un email de validación')
  }

  async verifyUser() {
    let result = await firebase.database().ref('usuarios').orderByChild('numCelular').equalTo(this.formRegistration.value['numCelular']).once('value')
    if (result.val()) return false
    else return true
  }

}

