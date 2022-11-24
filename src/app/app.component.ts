import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Pedido', url: '/pedido', icon: 'bag' },
    { title: 'Cliente', url: '/cliente', icon: 'person-circle' },
    { title: 'Producto', url: '/producto', icon: 'cube' },
  ];

  login = false;

  constructor(
    private rutas: Router,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private navCtlr: NavController,
    ) {
      this.mostrarMenu();
    }
  
  mostrarMenu() {
    if ( this.auth.PuedeActivarse() ) {
      this.login = true;
    } else {
      this.login = false;
    }
  }

  mostrarM() {
    if ( this.auth.PuedeActivarse() ) {
      return false;
    } else {
      return true;
    }
  }

  async presentAlertSalir() {
    const alert = await this.alertCtrl.create({
      header: 'Seguro que quiere cerrar sesión?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Salir',
          handler: ( data:any ) => {
            this.auth.logout();
            this.mostrarMenu();
            this.navCtlr.navigateRoot(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

}
