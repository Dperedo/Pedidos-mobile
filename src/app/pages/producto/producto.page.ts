import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoModel } from '../../models/producto.model';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  
  forma: FormGroup;
  listado: ProductoModel[] = [];
  formulario = false;
  buscar = '';
  page = '1';
  total = 0;
  paginas = 1;
  orden = '';
  loading = false;
  producto: ProductoModel = new ProductoModel();

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,) 
    {
      this.loading = true;
      this.listadoProducto();
      localStorage.removeItem('id');
     }

  ngOnInit() {
  }

  doRefresh( event ) {
    setTimeout(() => {
      this.listadoProducto();
      event.target.complete();
    }, 1000)
  }  

  listadoProducto() {
    this.loading = true;
    console.log('listadoProducto');
    this.auth.getDato('Productos', this.buscar, this.page, this.orden).subscribe(
      resp => {
        this.listado = resp['list'];
        this.total = resp['total'];
        this.paginas = resp['numpages'];
        console.log(resp);
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
            this.listadoProducto();
          }
        }
      ]
    });

    await alert.present();
  }

  cancelarBuscar() {
    this.buscar = '';
    this.listadoProducto();
  }

  editarProducto(id: string) {
    localStorage.setItem('id', id );
  }

  agregarProducto() {
    localStorage.removeItem('id');
  }

  vigenteFalse(producto: any) {
    producto.vigente = false;
    this.guardar(producto);
  }

  vigenteTrue(producto: any) {
    producto.vigente = true;
    this.guardar(producto);
  }

  guardar(producto: any) {
    console.log('guardar');
    console.log(producto);
    this.auth.putDato('Productos', producto).subscribe( resp => {
      console.log(resp);
      console.log('ok');
    });

  }

  async presentAlertVigente(producto: any) {
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
            if(producto.vigente) {
              this.vigenteFalse(producto);
            } else {
              this.vigenteTrue(producto);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
