import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario : UsuarioModel = new UsuarioModel();
  formulario: any;
  recordarme = false;
  loading = false;

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private rutas: Router,
    private app: AppComponent,
    private navCtlr: NavController,
  ) {
    if ( localStorage.getItem('token') ) {
      //console.log('hay token');
      this.navCtlr.navigateRoot(['/pedido']);
    }
  }

  ngOnInit() {
    if ( localStorage.getItem('username') ) {
      //console.log("hey");
      this.usuario.username =  localStorage.getItem('username');
      this.recordarme = true;
    }
  }

  doRefresh( event ) {
    setTimeout(() => {
      if ( localStorage.getItem('token') ) {
        //console.log('hay token');
        this.navCtlr.navigateRoot(['/pedido']);
      }
      event.target.complete();
    }, 1000)
  } 

  onSubmit(formulario: NgForm) {
    //console.log('formulario');
    //console.log(this.usuario);
    // console.log(formulario);
    this.formulario = formulario;
    // console.log(this.formulario);
  }

  ingresar(formulario: boolean) {
    this.loading = true;
    //console.log(formulario);
    //console.log(this.usuario.username);
    //console.log(this.usuario.password);
    if ( !formulario ) {
      this.loading = false;
      if (this.usuario.username == undefined || this.usuario.username == '') {this.presentEmail()}
      else {this.presentPass()}
      return;
     }

    //console.log(this.usuario);

    this.auth.login(this.usuario).subscribe( resp => {
      if ( this.recordarme ) {
        localStorage.setItem('username', this.usuario.username);
      } else { localStorage.removeItem('username'); }
      this.loading = false;
      this.navCtlr.navigateRoot(['/pedido']);
      this.app.mostrarMenu();
      //console.log(resp);
    }, (err) => {
      //console.log(err.status);
      this.loading = false;
      if (err.status === 401) {
        this.presentIncorrecto();
      } else if (err.status === 0) {
        this.presentDesconectado();
      }
      
    })
  }

  async presentDesconectado() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error Server',
      message: 'Servidor fuera de servicio.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentIncorrecto() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error',
      message: 'Correo y/o contraseña son incorrectos.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentEmail() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      message: 'No ingresó correo electrónico.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentPass() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error',
      message: 'No ingresó contraseña.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
