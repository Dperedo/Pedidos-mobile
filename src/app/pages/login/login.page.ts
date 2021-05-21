import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario : UsuarioModel = new UsuarioModel();
  formulario: any;
  recordarme = false;

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private rutas: Router,
  ) {
    if ( localStorage.getItem('token') ) {
      console.log('hay token');
      this.rutas.navigate(['/pedido']);
    }
  }

  ngOnInit() {
    if ( localStorage.getItem('username') ) {
      console.log("hey");
      this.usuario.username =  localStorage.getItem('username');
      this.recordarme = true;
    }
  }

  onSubmit(formulario: NgForm) {
    console.log('formulario');
    console.log(this.usuario);
    // console.log(formulario);
    this.formulario = formulario;
    // console.log(this.formulario);
  }

  ingresar(formulario: boolean) {
    console.log(formulario);
    if ( !formulario ) { return; }

    console.log(this.usuario);

    this.auth.login(this.usuario).subscribe( resp => {
      if ( this.recordarme ) {
        localStorage.setItem('username', this.usuario.username);
      } else { localStorage.removeItem('username'); }
      this.rutas.navigate(['/pedido']);
      console.log(resp);
    }, (err) => {
      this.presentIncorrecto();
    })
  }

  async presentIncorrecto() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error',
      message: 'Usuario y/o contraseña son incorrectos.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
