import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HistorialMedicoPage } from "../historial-medico/historial-medico";
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase'
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider, iUser } from "../../../providers/comun/comun";



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
    rol: 'paciente'
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
      'rol': new FormControl(this.registerForm['rol'], Validators.required)
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

    let user = await this.comun.loginFirebase(this.formLogin.value['email'], this.formLogin.value['password'])
    // .then(user => {
    if (user) {
      loader.dismiss()
      let infoUser = await this.comun.loadUser(user.user.uid)
      this.navCtrl.push(HistorialMedicoPage)
    }
    // }).catch(error => {
    //   loader.dismiss()
    //   this.comun.showAlert('Error', error)
    // })<
  }


  registration() {
    let loader = this.comun.showLoading('Creando tu usuario')
    loader.present()
    firebase.auth().createUserWithEmailAndPassword(this.formRegistration.value.email, this.formRegistration.value.password)
      .then((resp) => {
        let User: iUser = {
          email: this.formRegistration.value['email'],
          key: resp.user.uid,
          role: this.formRegistration.value['rol'],
          lastName: this.formRegistration.value['lastname'],
          name: this.formRegistration.value['name']
        }
        firebase.database().ref('usuarios').child(resp.user.uid).set(User).then(() => {
          loader.dismiss()
          this.navCtrl.setRoot(HistorialMedicoPage)

        })
      })
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

}

