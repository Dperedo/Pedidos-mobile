import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClienteModel } from '../../models/cliente.model';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  forma: FormGroup;
  listado: ClienteModel[] = [];
  formulario = false;
  buscar = '';
  page = '1';
  total = 0;
  paginas = 1;
  orden = '';
  loading: boolean;
  // tslint:disable-next-line: new-parens
  cliente: ClienteModel = new ClienteModel();
  

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController
    // private fb: FormBuilder,    private router: ActivatedRoute, private routers: Router
    ) {
      // console.log('control');
      this.listadoCliente();
      localStorage.removeItem('id');
     }

    
  ngOnInit() {
    console.log('inicio');
  }

  listadoCliente() {

    console.log('listadoCliente');
    this.auth.getDato('Clientes', this.buscar, this.page, this.orden).subscribe(
      resp => {
        // tslint:disable-next-line: no-string-literal
        this.listado = resp['list'];
        // tslint:disable-next-line: no-string-literal
        this.total = resp['total'];
        // tslint:disable-next-line: no-string-literal
        this.paginas = resp['numpages'];
        console.log(this.listado);
        //console.log(this.total);
        //console.log(this.paginas);
        this.loading = false;
      }
    );
  }

  async presentAlertBuscar() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Buscador',
      inputs: [
        {
          name: 'Buscar',
          type: 'text',
          value: this.buscar
          //placeholder: this.buscar
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: ( data:any ) => {
            console.log(data)
            this.buscar = data.Buscar;
            console.log(this.buscar);
            this.listadoCliente();
          }
        }
      ]
    });

    await alert.present();
  }

  editarCliente(id: string) {
    localStorage.setItem('id', id );
  }

  agregarCliente() {
    localStorage.removeItem('id');
  }

  vigenteFalse(cliente: any) {
    cliente.vigente = false;
    this.guardar(cliente);
  }

  vigenteTrue(cliente: any) {
    cliente.vigente = true;
    this.guardar(cliente);
  }

  guardar(cliente: any) {
    console.log('guardar');
    console.log(cliente);
    this.auth.putDato('Clientes', cliente).subscribe( resp => {
      console.log(resp);
      console.log('ok');
    });

  }

  async presentAlertVigente(cliente: any) {
    const alert = await this.alertCtrl.create({
      header: 'Esta seguro de completar esta accion',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: ( data:any ) => {
            console.log(data);
            if(cliente.vigente) {
              this.vigenteFalse(cliente);
            } else {
              this.vigenteTrue(cliente);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
