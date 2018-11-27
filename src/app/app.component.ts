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
// Pages
// -----------------------------------------------------------------
// import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/comun/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      firebase.initializeApp(Env.environment.config)
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

