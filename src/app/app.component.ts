import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';
import * as Env from '../enviroments/enviroment';

// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider, iUser } from "../providers/comun/comun";

// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
// import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/comun/login/login";
import { HistorialMedicoPage } from '../pages/comun/historial-medico/historial-medico';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    comun: ComunProvider
  ) {
    platform.ready().then(() => {
      firebase.initializeApp(Env.environment.config)

      let status = localStorage.getItem('uInfo')
      console.log('inicia');
      if (status) {
        let us: iUser = JSON.parse(status)
        if (us.role === 'paciente') {
          comun.user = us
          if (us.antecedentesFam && us.antecedentesMed && us.exploracionFisica && us.infoGeneral && us.medicamentos) {
            this.rootPage = HomePage 
          } else this.rootPage = HistorialMedicoPage

        }
      } else {
        this.rootPage = LoginPage
      }


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

