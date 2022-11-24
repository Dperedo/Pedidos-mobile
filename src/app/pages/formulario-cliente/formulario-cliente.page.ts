import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteModel } from '../../models/cliente.model';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { ClientePage } from '../cliente/cliente.page';
import { validateRut } from '@fdograph/rut-utilities';

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
    this.formulario = formulario;
  }

  getCliente(Id: string) {
    this.auth.getDatoId('Clientes', Id).subscribe( resp => {
      this.cliente = resp;
      this.titulo = this.cliente.razonSocial;
      this.data = true;
    });
  }

  guardar(forma: boolean) {
    this.validarRut = validateRut(this.cliente.rut);
    if ( !forma || !this.validarRut ) {
      if(!forma) {
        this.presentAlertFormulario();
      } else {
        this.presentAlertRut();
      }
      
    } else 
    {
      if ( this.cliente.id ) {
        this.auth.putDato('Clientes', this.cliente).subscribe( resp => {
          this.navCtlr.navigateRoot(['/cliente']);
        });
      } else {
        this.auth.postDato(this.cliente, 'Clientes').subscribe( resp => {
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
