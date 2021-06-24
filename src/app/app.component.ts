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
    // { title: 'Cerrar Sesion', url: '/login', icon: 'backspace' },
    /*{ title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'backspace' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },*/
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
      //this.menuCtrl.isOpen();
      //this.menuCtrl.enable(true, 'authenticated');
    } else {
      this.login = false;
      //this.menuCtrl.close();
      //this.menuCtrl.isEnabled();
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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Salir',
          handler: ( data:any ) => {
            console.log(data);
            this.auth.logout();
            this.mostrarMenu();
            this.navCtlr.navigateRoot(['/login']);
            //this.mostrarMenu();
          }
        }
      ]
    });

    await alert.present();
  }

}
