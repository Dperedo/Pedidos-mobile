import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClienteModel } from '../../models/cliente.model';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AlertController, IonInfiniteScroll, LoadingController, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PopoverInfoComponent } from 'src/app/components/popover-info/popover-info.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  forma: FormGroup;
  listado: ClienteModel[] = [];
  data: ClienteModel[] = [];
  formulario = false;
  buscar = '';
  page = '1';
  total = 0;
  paginas = 1;
  orden = '';
  loading = false;
  cliente: ClienteModel = new ClienteModel();
  @ViewChild( IonInfiniteScroll ) inifiteScroll: IonInfiniteScroll;
  

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
    public loadingController: LoadingController,
    private popoverCtrl: PopoverController,
    ) {
      this.loading = true;
      this.listadoCliente();
      localStorage.removeItem('id');
      localStorage.removeItem('orden');
     }

    
  ngOnInit() {
    console.log('fin');
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
      this.listadoCliente();
      this.inifiteScroll.complete();
      /*console.log('despues del complete');
      if ( this.listado.length == this.total ) {
        console.log('todos los elementos2');
        //this.inifiteScroll.complete();
        this.inifiteScroll.disabled = true;
        return;
      }*/
    }, 1500);
  }

  async presentPopover(ev: any) {
    
    const popover = await this.popoverCtrl.create({
      component: PopoverInfoComponent,
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
    this.listadoCliente();

  }

  doRefresh( event ) {
    setTimeout(() => {
      this.listadoCliente();
      event.target.complete();
    }, 1000)
  }  

  listadoCliente() {
    //this.presentLoading();
    console.log('listadoCliente');
    this.auth.getDato('Clientes', this.buscar, this.page, this.orden).subscribe(
      resp => {
        if(this.page != '1'){
          this.listado.push( ...resp['list'] )
        } else {
          this.listado = resp['list'];
        }
        //this.listado = resp['list'];
        this.total = resp['total'];
        console.log(this.total);
        this.paginas = resp['numpages'];
        console.log(this.listado);
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

  cancelarBuscar() {
    this.buscar = '';
    this.listadoCliente();
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

  eliminarCliente(id: string, i: number) {
    this.auth.deleteDato('Clientes', id).subscribe( resp => {
      console.log(resp);
      console.log('ok');
      this.listado.splice(i,1);
      this.total = this.total-1;
      //console.log(this.total);
    });
  }

  async presentAlertVigente(cliente: any) {
    const alert = await this.alertCtrl.create({
      header: '¿Está seguro de completar esta accción?',
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
