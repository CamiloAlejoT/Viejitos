import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase'
import { BaseChartDirective } from 'ng2-charts';

// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunProvider } from "../../../providers/comun/comun";
import { HistorialMedicoPage } from '../../comun/historial-medico/historial-medico';


// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------



@IonicPage()
@Component({
  selector: 'page-medico-home',
  templateUrl: 'medico-home.html',
})
export class MedicoHomePage {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective

  // -----------------------------------------------------------------
  // Attributes
  // -----------------------------------------------------------------
  // lineChart
  lineChartData: Array<any> = [
    { data: [], label: 'Eje X' },
    { data: [], label: 'Eje y' },
    { data: [], label: 'Eje Z' }
  ];
  lineChartLabels: Array<any> = [];
  lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  lineChartLegend: boolean = true;
  lineChartType: string = 'line';

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public comun: ComunProvider,
  ) {
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------
  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicoHomePage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter')
    firebase.database().ref('events').child(this.comun.idPaciente).on('child_added', (data) => {
      console.log(data.val());
      if (this.lineChartData[0].data.length > 50) {
        this.lineChartData[0].data.shift()
        this.lineChartData[1].data.shift()
        this.lineChartData[2].data.shift()
      }
      this.lineChartData[0].data.push(data.val()['x'])
      this.lineChartData[1].data.push(data.val()['y'])
      this.lineChartData[2].data.push(data.val()['z'])
      this.lineChartLabels.push(' ')
      this.chart.ngOnChanges({})
    })
  }

  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

  goToMedicHistory() {
    this.navCtrl.push(HistorialMedicoPage)
  }


}
