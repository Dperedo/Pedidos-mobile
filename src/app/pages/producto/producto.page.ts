import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoModel } from '../../models/producto.model';
import { AlertController, LoadingController, PopoverController, IonInfiniteScroll } from '@ionic/angular';
import { PopoverProductoComponent } from 'src/app/components/popover-producto/popover-producto.component';

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
  @ViewChild( IonInfiniteScroll ) inifiteScroll: IonInfiniteScroll;

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private popoverCtrl: PopoverController,
    ) 
    {
      this.loading = true;
      this.listadoProducto();
      localStorage.removeItem('id');
      localStorage.removeItem('orden');
     }

  ngOnInit() {
  }

  loadData( event ) {

    setTimeout(() => {

      if ( this.listado.length >= this.total ) {
        this.inifiteScroll.complete();
        this.inifiteScroll.disabled = true;
        return;
      }
      const dato = parseInt(this.page) + 1;
      this.page = dato.toString();
      this.listadoProducto();
      this.inifiteScroll.complete();
    }, 1500);
  }

  async presentPopover(ev: any) {
    
    const popover = await this.popoverCtrl.create({
      component: PopoverProductoComponent,
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
    this.listadoProducto();

  }

  doRefresh( event ) {
    setTimeout(() => {
      this.listadoProducto();
      event.target.complete();
    }, 1000)
  }  

  listadoProducto() {
    this.loading = true;
    this.auth.getDato('Productos', this.buscar, this.page, this.orden).subscribe(
      resp => {
        if(this.page != '1'){
          this.listado.push( ...resp['list'] )
        } else {
          this.listado = resp['list'];
        }
        this.total = resp['total'];
        this.paginas = resp['numpages'];
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
            this.buscar = data.Buscar;
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
    this.auth.putDato('Productos', producto).subscribe( resp => {
    });

  }

  eliminarProducto(id: string, i: number) {
    this.auth.deleteDato('Productos', id).subscribe( resp => {
      this.listado.splice(i,1);
      this.total = this.total-1;
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
          }
        }, {
          text: 'Ok',
          handler: ( data:any ) => {
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
