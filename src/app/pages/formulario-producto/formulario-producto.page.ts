import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductoModel } from '../../models/producto.model';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.page.html',
  styleUrls: ['./formulario-producto.page.scss'],
})
export class FormularioProductoPage implements OnInit {
  
  formulario: any;
  titulo: string;
  producto : ProductoModel = new ProductoModel();
  id = '';
  data = false;

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private rutas: Router,
    private navCtlr: NavController,
  ) {
    if( localStorage.getItem('id') ) {
      this.getProducto(localStorage.getItem('id'));
    } else {this.data = true;}
    }

  ngOnInit() {
  }

  onSubmit(formulario: NgForm) {
    console.log('formulario');
    console.log(this.producto);
    console.log(formulario);
    this.formulario = formulario;
    console.log(this.formulario);
  }

  getProducto(Id: string) {
    this.auth.getDatoId('Productos', Id).subscribe( resp => {
      this.producto = resp;
      this.titulo = this.producto.nombre;
      console.log(this.producto);
      this.data = true;
    });
  }

  guardar(forma: boolean) {
    console.log('guardar producto');
    console.log(this.producto);
    console.log(forma);
    if ( !forma ) {
      // this.cli.idCliente;
      this.presentAlert();
      console.log('no');
    } else 
    {
      console.log('guarda');
      if ( this.producto.id ) {
        console.log('Modificando: ' + this.producto.id);
        this.auth.putDato('Productos', this.producto).subscribe( resp => {
          console.log(resp);
          console.log('ok');
          this.navCtlr.navigateRoot(['/producto']);
        });
      } else {
        console.log('Nuevo Producto');
        this.auth.postDato(this.producto, 'Productos').subscribe( resp => {
          console.log(resp);
          this.navCtlr.navigateRoot(['/producto']);
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
