import { Component, OnInit } from '@angular/core';
import { PedidoModel } from '../../models/pedido.model';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EstadoModel } from '../../models/estado.model';
import { ClienteModel } from '../../models/cliente.model';
import { ProductoModel } from '../../models/producto.model';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  forma: FormGroup;
  detallePedidos: FormArray;
  listado: PedidoModel[] = [];
  formulario = false;
  editar = false;
  fechaMax = '';
  fechaMin = '';
  buscar = '';
  page = '1';
  total = 0;
  paginas = 1;
  orden = '';
  neto = 0;
  iva = 0;
  totalvalor = 0;
  subtotal = [];
  loading = false;
  pedido: PedidoModel = new PedidoModel();

  constructor(private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingController: LoadingController,) 
  {
    this.loading = true;
    this.listadoPedido();
    localStorage.removeItem('id');
    // this.doRefresh( event );
   }

  ngOnInit() {
  }

  doRefresh( event ) {
    setTimeout(() => {
      this.listadoPedido();
      event.target.complete();
    }, 1000)
  }  

  listadoPedido() {

    console.log('listadoPedido');
    this.auth.getDato('Pedidos', this.buscar, this.page, this.orden).subscribe(
      resp => {
        this.listado = resp['list'];
        this.total = resp['total'];
        this.paginas = resp['numpages'];
        console.log(resp);
        this.loading = false;
      }
    );
  }

  cancelarBuscar() {
    this.buscar = '';
    this.listadoPedido();
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
            this.listadoPedido();
          }
        }
      ]
    });

    await alert.present();
  }

  editarPedido(id: string) {
    localStorage.setItem('id', id );
  }

  agregarPedido() {
    localStorage.removeItem('id');
  }

}
