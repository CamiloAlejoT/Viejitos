import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider } from "../../providers/comun/comun";

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase'

@IonicPage()
@Component({
  selector: 'page-mbulancia',
  templateUrl: 'mbulancia.html',
})
export class MbulanciaPage {

  // -----------------------------------------------------------------
  // Attributes
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public comun: ComunProvider
  ) {
    

  }


  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------
  ionViewDidLoad() {

  }

}
