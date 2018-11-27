import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorialMedicoPage } from './historial-medico';

@NgModule({
  declarations: [
    HistorialMedicoPage,
  ],
  imports: [
    IonicPageModule.forChild(HistorialMedicoPage),
  ],
})
export class HistorialMedicoPageModule {}
