import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Pedido', url: '/pedido', icon: 'mail' },
    { title: 'Cliente', url: '/cliente', icon: 'paper-plane' },
    { title: 'Producto', url: '/producto', icon: 'archive' },
    // { title: 'Cerrar Sesion', url: '/login', icon: 'backspace' },
    /*{ title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'backspace' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },*/
  ];

  constructor(
    private rutas: Router,
    private auth: AuthService,
    private alertCtrl: AlertController
    ) {}

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
            this.rutas.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

}
