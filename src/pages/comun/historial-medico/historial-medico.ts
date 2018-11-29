import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, AbstractControl, FormControlName } from '@angular/forms';
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HomePage } from "../../home/home";


// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider, iUser } from "../../../providers/comun/comun";


@IonicPage()
@Component({
  selector: 'page-historial-medico',
  templateUrl: 'historial-medico.html',
})
export class HistorialMedicoPage {

  // -----------------------------------------------------------------
  // Attributes
  // -----------------------------------------------------------------
  user: iUser

  formMedic: FormGroup


  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public comun: ComunProvider
  ) {
    this.user = this.comun.user

    this.formMedic = new FormGroup({

      // informacion basica
      'name': new FormControl(this.user.name, Validators.required),
      'lastName': new FormControl(this.user.lastName, Validators.required),
      'E-mail': new FormControl(this.user.email, [
        Validators.required,
        Validators.email
      ]),

      // información general
      'genero': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.genero : null, Validators.required),
      'edad': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.edad : null, [Validators.required]),
      'numFijo': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.numFijo : null, Validators.required),
      'numCelular': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.numCelular : null, Validators.required),
      'nombreFamiliar': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.nombreFamiliar : null, Validators.required),
      'numFamiliar': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.numFamiliar : null, Validators.required),
      'numMedico': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.numMedico : null, Validators.required),
      'nombreMedico': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.nombreMedico : null, Validators.required),
      'grupoSanguineo': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.grupoSanguineo : null, Validators.required),
      'rh': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.rh : null, Validators.required),
      'ocupacion': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.ocupacion : null, Validators.required),
      'tipoDoc': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.tipoDoc : null, Validators.required),
      'documento': new FormControl(this.user.infoGeneral ? this.user.infoGeneral.doc : null, Validators.required),

      // antecendentes familiares
      'cancer': new FormControl(this.user.antecedentesFam ? this.user.antecedentesFam.cancer : null, Validators.required),
      'hipertencion': new FormControl(this.user.antecedentesFam ? this.user.antecedentesFam.hipertencion : false),
      'enferCardiacas': new FormControl(this.user.antecedentesFam ? this.user.antecedentesFam.enferCardiacas : null, Validators.required),
      'diabetesFam': new FormControl(this.user.antecedentesFam ? this.user.antecedentesFam.diabetes : false),
      'otrosFam': new FormControl(this.user.antecedentesFam ? this.user.antecedentesFam.otros : null, Validators.required),

      // antecedentes Medicos
      'presionArterial': new FormControl(this.user.antecedentesMed ? this.user.antecedentesMed.presionArterial : null, Validators.required),
      'diabetesMed': new FormControl(this.user.antecedentesMed ? this.user.antecedentesMed.diabetes : false),
      'alergias': new FormControl(this.user.antecedentesMed ? this.user.antecedentesMed.alergias : null, Validators.required),
      'cirugias': new FormControl(this.user.antecedentesMed ? this.user.antecedentesMed.cirugias : null, Validators.required),
      'otrosMed': new FormControl(this.user.antecedentesMed ? this.user.antecedentesMed.otros : null, Validators.required),

      // Exploración fisica
      'peso': new FormControl(this.user.exploracionFisica ? this.user.exploracionFisica.peso : null, Validators.required),
      'talla': new FormControl(this.user.exploracionFisica ? this.user.exploracionFisica.talla : null, Validators.required),
      'imc': new FormControl(this.user.exploracionFisica ? this.user.exploracionFisica.imc : null, Validators.required),
      'temperatura': new FormControl(this.user.exploracionFisica ? this.user.exploracionFisica.temperatura : null, Validators.required),
      'freCardiaca': new FormControl(this.user.exploracionFisica ? this.user.exploracionFisica.freCardiaca : null, Validators.required),
      'frecRespiratoria': new FormControl(this.user.exploracionFisica ? this.user.exploracionFisica.frecRespiratoria : null, Validators.required),

      // medicamentos
      'medicamentos': new FormControl(this.user.medicamentos ? this.user.medicamentos : null, Validators.required)
    })
  }


  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialMedicoPage');
  }


  async onSubmit() {
    let loader = this.comun.showLoading('Guardando tu información...')
    loader.present()
    this.comun.saveUserbyFirsTime(this.formMedic.value).then(() => {
      localStorage.setItem('uInfo', JSON.stringify(this.comun.user))
      loader.dismiss()
      this.comun.showAlert('Éxito', 'Tu información ha sido guardada correctament')
      this.navCtrl.setRoot(HomePage)
    }).catch(() => {
      loader.dismiss()
      this.comun.showAlert('Error', 'Verifica tu información')
    })
  }


  showinfo() {
    console.log(this.formMedic);

  }

}
