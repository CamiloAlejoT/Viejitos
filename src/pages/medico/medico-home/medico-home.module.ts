import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicoHomePage } from './medico-home';

@NgModule({
  declarations: [
    MedicoHomePage,
  ],
  imports: [
    IonicPageModule.forChild(MedicoHomePage),
  ],
})
export class MedicoHomePageModule {}
