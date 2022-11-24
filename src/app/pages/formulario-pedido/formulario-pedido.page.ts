import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ClienteModel } from 'src/app/models/cliente.model';
import { EstadoModel } from 'src/app/models/estado.model';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoModel } from '../../models/pedido.model';
import { ProductoModel } from '../../models/producto.model';
import { DetallePedidoModel } from '../../models/detallePedido.model';

@Component({
  selector: 'app-formulario-pedido',
  templateUrl: './formulario-pedido.page.html',
  styleUrls: ['./formulario-pedido.page.scss'],
})
export class FormularioPedidoPage implements OnInit {

  formulario: any;
  form = false;
  titulo : any;
  total = 0;
  pedido : PedidoModel = new PedidoModel();
  producto : ProductoModel = new ProductoModel();
  detalle : DetallePedidoModel = new DetallePedidoModel();
  cantidad: number;
  clientePedido : ClienteModel[] = [];
  productoPedido : ProductoModel[] = [];
  estadoPedido : EstadoModel[] = [];
  id = '';
  subtotal = [];
  neto = 0;
  iva = 0;
  totalvalor = 0;
  dT = -1;
  data = false;
  agregar = false;


  constructor( 
    private alertCtrl: AlertController,
    private auth: AuthService,
    private rutas: Router,
    private navCtlr: NavController,
    ) 
    {
      this.allCliente();
      this.allEstado();
      this.allProducto();
      if( localStorage.getItem('id') ) {
        this.getPedido(localStorage.getItem('id'));
      } else {
        this.data = true;
        this.agregar = true;
      }
    }

  ngOnInit() {
  }

  editarCerrar() {
    this.dT = -1;
  }

  onSubmit(formulario: NgForm) {
    this.formulario = formulario;
  }

  editarProducto(i: number) {
    this.dT = i;

  }

  validador() {
    this.form = true;
  }

  calcularTotal()
  {
    this.neto = 0;
    this.pedido.detallePedidos.forEach( linea => {
      if ( !isNaN(linea.producto.precio) && !isNaN(linea.cantidad) ) {
        this.neto = this.neto + (linea.producto.precio * linea.cantidad);
    }
    });
    this.iva = this.neto * 0.19;
    this.totalvalor = this.neto + this.iva;
  }

  tablaSubtotal(i: number) {
    if (this.pedido.detallePedidos[i].producto.precio === undefined)
    {
      this.subtotal[i] = 0;
    } else {
      this.subtotal[i] = this.pedido.detallePedidos[i].producto.precio * this.pedido.detallePedidos[i].cantidad;
    }
    if (this.subtotal[i] === isNaN) { this.subtotal[i] = 0; }
    return this.subtotal[i];
  }

  getPedido(Id: string) {
    this.auth.getDatoId('Pedidos', Id).subscribe( resp => {
      this.pedido = resp;
      this.titulo = this.pedido.secuencial;
      this.calcularTotal();
      setTimeout(() => {
        this.data = true;
      }, 500)
    });
  }

  allCliente() {
    this.auth.getSelector('Clientes').subscribe( resp => {
      this.clientePedido = resp;
    });
  }

  allProducto() {
    this.auth.getSelector('Productos').subscribe( resp => {
      this.productoPedido = resp;
    });
  }

  allEstado() {
    this.auth.getSelectorEstado('Estados').subscribe( resp => {
      this.estadoPedido = resp;
      this.pedido.estado = this.estadoPedido[2];
    });
  }

  guardar(forma: boolean) {
    if ( !forma ) {
      this.presentAlert();
    } else 
    {
      this.pedido.total = this.totalvalor;
      if ( this.pedido.id ) {
        this.auth.putDato('Pedidos', this.pedido).subscribe( resp => {
          this.navCtlr.navigateRoot(['/pedido']);
        });
      } else {
        this.auth.postDato(this.pedido, 'Pedidos').subscribe( resp => {
          this.navCtlr.navigateRoot(['/pedido']);
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

  agregarDetalle() {
    this.agregar = true;
  }

  guardarDetalle() {
    if ( !this.detalle.producto || !this.detalle.cantidad ) {
      this.presentAlert();
      return;
    }
    if( !this.pedido.detallePedidos ) {
      this.pedido.detallePedidos = [];  
    }
    let num = this.pedido.detallePedidos.length;
    this.pedido.detallePedidos.push();
    this.pedido.detallePedidos[num] = this.detalle;
    this.detalle = new DetallePedidoModel();
    this.agregar = false;
  }

  cancelarDetalle() {
    this.detalle = new DetallePedidoModel();
    this.agregar = false;
  }

  eliminarDetalle(i: number) {
    this.pedido.detallePedidos.splice(i,1);
  }
  // ------------------------

  clienteOptions: any = {
    header: 'Seleccione un Cliente',
  };

  estadoOptions: any = {
    header: 'Seleccione un Estado',
  };

  productoOptions: any = {
    header: 'Seleccione un Producto',
  };

  compareCliente(c1: ClienteModel, c2: ClienteModel) {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareEstado(e1: EstadoModel, e2: EstadoModel) {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  compareProducto(p1: ProductoModel, p2: ProductoModel) {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

}
