import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteModel } from '../../models/cliente.model';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { ClientePage } from '../cliente/cliente.page';
import { validateRut } from '@fdograph/rut-utilities';
//import { RutService } from 'rut-chileno';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.page.html',
  styleUrls: ['./formulario-cliente.page.scss'],
})
export class FormularioClientePage implements OnInit {

  formulario: any;
  titulo : string;
  cliente : ClienteModel = new ClienteModel();
  id = '';
  ClientePage: ClientePage;
  data = false;
  validarRut: boolean;

  constructor(private alertCtrl: AlertController,
              private auth: AuthService,
              private rutas: Router,
              private navCtlr: NavController,
              ) {
              if( localStorage.getItem('id') ) {
                this.getCliente(localStorage.getItem('id'));
              } else { this.data = true; }
              }

  ngOnInit() {
  }

  onSubmit(formulario: NgForm) {
    //console.log('formulario');
    //console.log(this.cliente);
    //console.log(formulario);
    this.formulario = formulario;
    //console.log(this.formulario);
  }

  getCliente(Id: string) {
    this.auth.getDatoId('Clientes', Id).subscribe( resp => {
      this.cliente = resp;
      // console.log(this.cliente);
      this.titulo = this.cliente.razonSocial;
      // console.log(this.titulo);
      this.data = true;
    });
  }

  guardar(forma: boolean) {
    //console.log('guardar cliente');
    //console.log(this.cliente);
    //console.log(forma);
    this.validarRut = validateRut(this.cliente.rut);
    //this.validarRut = this.rutService.validaRUT(this.cliente.rut);
    //console.log(this.validarRut);
    if ( !forma || !this.validarRut ) {
      // this.cli.idCliente;
      if(!forma) {
        this.presentAlertFormulario();
      } else {
        this.presentAlertRut();
      }
      
      //console.log('no');
    } else 
    {
      //console.log('guarda');
      if ( this.cliente.id ) {
        //console.log('Modificando: ' + this.cliente.id);
        this.auth.putDato('Clientes', this.cliente).subscribe( resp => {
          //console.log(resp);
          //console.log('ok');
          this.navCtlr.navigateRoot(['/cliente']);
          //this.rutas.navigate(['/cliente']);
          //this.cliente = new ClienteModel();
        });
      } else {
        //console.log('Nuevo Cliente');
        this.auth.postDato(this.cliente, 'Clientes').subscribe( resp => {
          //console.log(resp);
          this.navCtlr.navigateRoot(['/cliente']);
        });
      }
    }
  }

  async presentAlertFormulario() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error',
      message: 'Completar campos Vacíos.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertRut() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error',
      message: 'Rut invalido.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
