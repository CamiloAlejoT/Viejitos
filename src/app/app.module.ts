import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Gyroscope } from '@ionic-native/gyroscope';
import { DeviceMotion } from '@ionic-native/device-motion';


// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/comun/login/login";
import { HistorialMedicoPage } from "../pages/comun/historial-medico/historial-medico";

// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider } from '../providers/comun/comun';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    HistorialMedicoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    HistorialMedicoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ComunProvider,
    // Gyroscope,
    // DeviceMotion
  ]
})
export class AppModule {}
