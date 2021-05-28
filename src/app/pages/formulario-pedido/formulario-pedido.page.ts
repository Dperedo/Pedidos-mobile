import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClienteModel } from 'src/app/models/cliente.model';
import { EstadoModel } from 'src/app/models/estado.model';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoModel } from '../../models/pedido.model';
import { ProductoModel } from '../../models/producto.model';

@Component({
  selector: 'app-formulario-pedido',
  templateUrl: './formulario-pedido.page.html',
  styleUrls: ['./formulario-pedido.page.scss'],
})
export class FormularioPedidoPage implements OnInit {

  formulario: any;
  form = false;
  titulo : string;
  total = 0;
  pedido : PedidoModel = new PedidoModel();
  clientePedido : ClienteModel[] = [];
  productoPedido : ProductoModel[] = [];
  estadoPedido : EstadoModel[] = [];
  id = '';
  subtotal = [];
  neto = 0;
  iva = 0;
  totalvalor = 0;
  data = false;


  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private rutas: Router,) 
    {
      if( localStorage.getItem('id') ) {
        this.getPedido(localStorage.getItem('id'));
      } else {this.data = true;}
      this.allCliente();
      this.allEstado();
      this.allProducto();
      // this.calcularTotal();
    }

  ngOnInit() {
  }

  onSubmit(formulario: NgForm) {
    console.log('formulario');
    console.log(this.pedido);
    console.log(formulario);
    this.formulario = formulario;
    console.log(this.formulario);
  }

  validador() {
    console.log(this.pedido.detallePedidos.length);
    this.form = true;
  }

  calcularTotal()
  {
    // this.extraerProducto(i);
    console.log('calcularTotal');
    this.neto = 0;
    this.pedido.detallePedidos.forEach( linea => {
      if ( !isNaN(linea.producto.precio) && !isNaN(linea.cantidad) ) {
        // console.log(linea.producto.precio);
        // console.log(linea.cantidad);
        this.neto = this.neto + (linea.producto.precio * linea.cantidad);
    }
      // console.log(linea.producto.precio);
      // console.log(linea.cantidad);
      // console.log('neto:  ' + this.neto);
    });
    this.iva = this.neto * 0.19;
    this.totalvalor = this.neto + this.iva;
  }

  tablaSubtotal(i: number) {
    // console.log(this.forma.value.productosForm[i].producto.precio);
    // console.log(this.forma.value.productosForm[i].cantidad);
    if (this.pedido.detallePedidos[i].producto.precio === undefined)// ||
    // this.pedido.detallePedidos[i].cantidad === '')
    {
      this.subtotal[i] = 0;
      // console.log('true');
    } else {
      this.subtotal[i] = this.pedido.detallePedidos[i].producto.precio * this.pedido.detallePedidos[i].cantidad;
      // console.log('false');
    }
    if (this.subtotal[i] === isNaN) { this.subtotal[i] = 0; }
    // console.log('valor es: ' + this.subtotal[i]);
    return this.subtotal[i];
  }

  getPedido(Id: string) {
    this.auth.getDatoId('Pedidos', Id).subscribe( resp => {
      this.pedido = resp;
      // console.log(this.cliente);
      this.titulo = this.pedido.cliente.razonSocial;
      // console.log(this.titulo);
      this.calcularTotal();
      this.data = true;
    });
  }

  allCliente() {
    this.auth.getSelector('Clientes').subscribe( resp => {
      this.clientePedido = resp;
      // console.log(this.clientePedido);
    });
  }

  allProducto() {
    this.auth.getSelector('Productos').subscribe( resp => {
      this.productoPedido = resp;
      // console.log(this.productoPedido);
    });
  }

  allEstado() {
    this.auth.getSelector('Estados').subscribe( resp => {
      this.estadoPedido = resp;
      // console.log(this.estadoPedido);
    });
  }

  guardar(forma: boolean) {
    console.log('guardar pedido');
    console.log(this.pedido);
    console.log(forma);
    if ( !forma ) {
      // this.cli.idCliente;
      this.presentAlert();
      console.log('no');
    } else 
    {
      this.pedido.total = this.totalvalor
      console.log('guarda');
      if ( this.pedido.id ) {
        console.log('Modificando: ' + this.pedido.id);
        this.auth.putDato('Pedidos', this.pedido).subscribe( resp => {
          console.log(resp);
          console.log('ok');
          this.rutas.navigate(['/pedido']);
        });
      } else {
        console.log('Nuevo Pedido');
        this.auth.postDato(this.pedido, 'Pedidos').subscribe( resp => {
          console.log(resp);
          this.rutas.navigate(['/pedido']);
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

  /*agregarDetalle() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');
// setTitle
    alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',
      checked: true
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        // this.testRadioOpen = false;
        // this.testRadioResult = data;
      }
    });
    alert.present();
  }*/

  // ------------------------

  clienteOptions: any = {
    header: 'Seleccione un Cliente',
    // subHeader: 'Select your hair color',
    // message: 'Only select your dominant hair color'
  };

  estadoOptions: any = {
    header: 'Seleccione un Estado',
    // subHeader: 'Select your hair color',
    // message: 'Only select your dominant hair color'
  };

  compareCliente(c1: ClienteModel, c2: ClienteModel) {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareEstado(e1: EstadoModel, e2: EstadoModel) {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

}
