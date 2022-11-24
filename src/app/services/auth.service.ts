import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private url = 'https://localhost:5001/api';
  private url = 'https://back-appwebsite.azurewebsites.net/api';

  url2: any;
  userToken = '';
  page = '';
  buscar = '';
  respuesta = true;
  usuario: UsuarioModel = { username: 'test@test.com' , password: '1234'}

  constructor(private http: HttpClient, 
              private rutas: Router,
              private alertCtrl: AlertController,
              private navCtlr: NavController, ) {
              }

  getMenuOpts() {
    return this.http.get<any>('/assets/data/configure-url.json');
  }

  getDato(controlador: string, buscar: string, page: string, orden: string) {
    this.userToken = this.leerToken();

    if ( !page ) {
      page = '';
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    this.PuedeActivarse();

    return this.http.get(`${ this.url }/${ controlador }/query?texto=${ buscar }&page=${ page }&order=${ orden }&take=${ 15 }`, { headers })
      .pipe(map((res: any) => res ));
  }

  getDatoId(controlador: string, ID: string) {
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    this.PuedeActivarse();

    return this.http.get(`${ this.url }/${ controlador }/${ ID }`, { headers }).pipe(map((res: any) => res ));
  }

  postDato(Datos: any, controlador: string){
    const Data = {
      ...Datos,
    };
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    this.PuedeActivarse();

    return this.http.post(`${ this.url }/${ controlador }`, Data, { headers }).pipe(map((res: any) => res));
  }

  putDato(controlador: string, Datos: any){
    const Data = {
      ...Datos,
    };
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    this.PuedeActivarse();

    return this.http.put(`${ this.url }/${ controlador }/${ Data.id }`, Data, { headers }).pipe(map((res: any) => res));
  }

  deleteDato(controlador: string, id: string){
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    this.PuedeActivarse();

    return this.http.delete(`${ this.url }/${ controlador }/${ id }`, { headers }).pipe(map((res: any) => res));
  }

  getSelector(controlador: string){
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    return this.http.get(`${ this.url }/${ controlador }/vigente`, { headers }).pipe(map((res: any) => res));
  }

  getSelectorEstado(controlador: string){
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    return this.http.get(`${ this.url }/${ controlador }`, { headers }).pipe(map((res: any) => res));
  }

  login( usuario: UsuarioModel ) {
    const authData = {
      ...usuario,
    };
    return this.http.post(
      `${ this.url }/Usuarios/auth`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken( resp['token'] );
        return resp;
      }));
  }

  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
  }

  estaAutenticado(): boolean {
    this.leerToken();
    if ( this.userToken.length < 2 ) {
      return false;
    }
    this.estadoDelToken()
    if ( this.respuesta === false ) {
      return false;
    }
    const expira = Number(localStorage.getItem('expira'));

    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }

  estadoDelToken() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    this.http.get(`${ this.url }/usuarios`, { headers, observe: 'response' })
    .subscribe(response => {
    },
    (err) => {
      this.logout();
      if (err.status === 0) {
        this.presentDesconectado();
      }
    });
    
  }

  leerToken() {

    if ( localStorage.getItem('token') ) {

      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  PuedeActivarse(): boolean {
    if ( this.estaAutenticado() ) {
      return true;
    } else {
      this.navCtlr.navigateRoot(['/login']);
      this.logout();
      return false;
    }
  }

  async presentDesconectado() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Error Server',
      message: 'Servidor fuera de servicio.',
      buttons: [
        {
          text: 'Ok',
          handler: ( data:any ) => {
            this.navCtlr.navigateRoot(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

}
