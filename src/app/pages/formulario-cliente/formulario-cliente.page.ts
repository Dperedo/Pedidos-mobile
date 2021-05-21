import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteModel } from '../../models/cliente.model';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { ClientePage } from '../cliente/cliente.page';

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
  link = {url: '/cliente'}

  constructor(private alertCtrl: AlertController,
              private auth: AuthService,
              private rutas: Router,
              // private pagCliente: ClientePage
              // public navCtrl: NavController
              ) {
              if( localStorage.getItem('id') ) {
                this.getCliente(localStorage.getItem('id'));
              }
              }

  ngOnInit() {
  }

  onSubmit(formulario: NgForm) {
    console.log('formulario');
    console.log(this.cliente);
    console.log(formulario);
    this.formulario = formulario;
    console.log(this.formulario);
  }

  getCliente(Id: string) {
    this.auth.getDatoId('Clientes', Id).subscribe( resp => {
      this.cliente = resp;
      // console.log(this.cliente);
      this.titulo = this.cliente.razonSocial;
      // console.log(this.titulo);
    });
  }

  guardar(forma: boolean) {
    console.log('guardar cliente');
    console.log(this.cliente);
    console.log(forma);
    if ( !forma ) {
      // this.cli.idCliente;
      this.presentAlert();
      console.log('no');
    } else 
    {
      console.log('guarda');
      if ( this.cliente.id ) {
        console.log('Modificando: ' + this.cliente.id);
        this.auth.putDato('Clientes', this.cliente).subscribe( resp => {
          console.log(resp);
          console.log('ok');
          this.rutas.navigate(['/cliente']);
        });
      } else {
        console.log('Nuevo Cliente');
        this.auth.postDato(this.cliente, 'Clientes').subscribe( resp => {
          console.log(resp);
          this.rutas.navigate(['/cliente']);
        });
      }
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error',
      message: 'Completar campos Vacíos.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
