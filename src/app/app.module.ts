import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// -----------------------------------------------------------------
// Nativos
// -----------------------------------------------------------------
import { Gyroscope } from '@ionic-native/gyroscope';
import { DeviceMotion } from '@ionic-native/device-motion';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { OneSignal } from '@ionic-native/onesignal';

// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { MyApp } from './app.component';
import { HomePage } from '../pages/paciente/home/home';
import { LoginPage } from "../pages/comun/login/login";
import { HistorialMedicoPage } from "../pages/comun/historial-medico/historial-medico";
import { MedicoHomePage } from '../pages/medico/medico-home/medico-home';


// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider } from '../providers/comun/comun';


// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MbulanciaPage } from '../pages/mbulancia/mbulancia';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    HistorialMedicoPage,
    MedicoHomePage,
    MbulanciaPage
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    HistorialMedicoPage,
    MedicoHomePage,
    MbulanciaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ComunProvider,
    Gyroscope,
    DeviceMotion,
    TextToSpeech,
    OneSignal
  ]
})
export class AppModule { }
