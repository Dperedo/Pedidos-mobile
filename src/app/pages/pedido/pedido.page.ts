import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidoModel } from '../../models/pedido.model';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EstadoModel } from '../../models/estado.model';
import { ClienteModel } from '../../models/cliente.model';
import { ProductoModel } from '../../models/producto.model';
import { AlertController, IonList, LoadingController, PopoverController, IonInfiniteScroll } from '@ionic/angular';
import { PopoverPedidoComponent } from 'src/app/components/popover-pedido/popover-pedido.component';

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
  estado: EstadoModel = new EstadoModel();

  @ViewChild(IonList) ionList: IonList;
  @ViewChild( IonInfiniteScroll ) inifiteScroll: IonInfiniteScroll;

  constructor(private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingController: LoadingController,
              private popoverCtrl: PopoverController,) 
  {
    this.loading = true;
    this.listadoPedido();
    localStorage.removeItem('id');
    localStorage.removeItem('orden');
    // this.doRefresh( event );
   }

  ngOnInit() {
  }

  loadData( event ) {
    console.log(event);

    setTimeout(() => {

      if ( this.listado.length >= this.total ) {
        console.log('todos los elementos');
        this.inifiteScroll.complete();
        this.inifiteScroll.disabled = true;
        return;
      }
      const dato = parseInt(this.page) + 1;
      this.page = dato.toString();
      console.log(this.page);
      this.listadoPedido();
      this.inifiteScroll.complete();
    }, 1500);
  }

  async presentPopover(ev: any) {
    
    const popover = await this.popoverCtrl.create({
      component: PopoverPedidoComponent,
      event: ev,
      translucent: true,
      backdropDismiss: false
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();
    if ( data != undefined) {
      this.orden = data.item;
    }
    this.loading = true;
    localStorage.setItem('orden', this.orden);
    console.log(data.item);
    this.listadoPedido();

  }

  doRefresh( event ) {
    setTimeout(() => {
      this.listadoPedido();
      event.target.complete();
    }, 1000)
  }  

  getEstadoCancelado(pedido: any) {
    this.auth.getDatoId('Estados','23d381c6-2718-4540-b409-95c713eb75e3').subscribe(
      resp => {
        pedido.estado = resp;
        console.log('estado cancelado');
        this.guardar(pedido);
        this.ionList.closeSlidingItems();
      }
    );
  }

  listadoPedido() {

    console.log('listadoPedido');
    this.auth.getDato('Pedidos', this.buscar, this.page, this.orden).subscribe(
      resp => {
        if(this.page != '1'){
          this.listado.push( ...resp['list'] )
        } else {
          this.listado = resp['list'];
        }
        this.total = resp['total'];
        this.paginas = resp['numpages'];
        console.log(resp);
        this.loading = false;
      }
    );
  }

  guardar(pedido: any) {
    console.log('guardar');
    console.log(pedido);
    this.auth.putDato('Pedidos', pedido).subscribe( resp => {
      console.log(resp);
      console.log('ok');
    });
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

  eliminarPedido(id: string, i: number) {
    this.auth.deleteDato('Pedidos', id).subscribe( resp => {
      console.log(resp);
      console.log('ok');
      this.listado.splice(i,1);
      this.total = this.total-1;
    });
  }

  /*cambiarEstadoPedido(id: string) {
    this.auth.putDato('Pedidos', id).subscribe( resp => {
      console.log('cancelado');
      this.ionList.closeSlidingItems();
    });
  }*/

}
