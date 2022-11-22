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
                // this.login(this.usuario).subscribe( resp => console.log(resp));
                //this.url2 = this.getMenuOpts().subscribe(resp => resp);
                console.log(this.url2);
                console.log('url');
              }

  getMenuOpts() {
    return this.http.get<any>('/assets/data/configure-url.json');
  }

  getDato(controlador: string, buscar: string, page: string, orden: string) {
    this.userToken = this.leerToken();

    if ( !page ) {
      page = '';
    }

    // tslint:disable-next-line: radix
    console.log('Primer paso');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });  
    console.log('page=' + page, 'buscar=' + buscar, 'orden=' + orden);
    console.log('Dentro de getDatoBuscar');

    this.PuedeActivarse();

    return this.http.get(`${ this.url }/${ controlador }/query?texto=${ buscar }&page=${ page }&order=${ orden }&take=${ 15 }`, { headers })
      .pipe(map((res: any) => res ));
  }

  getDatoId(controlador: string, ID: string) {
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });
    console.log('ID=' + ID);
    console.log('Dentro de getDatoId');

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
    console.log('Dentro de postDato');
    console.log(Data);

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
    console.log('Dentro de putDato');
    console.log(Data);

    this.PuedeActivarse();

    return this.http.put(`${ this.url }/${ controlador }/${ Data.id }`, Data, { headers }).pipe(map((res: any) => res));
  }

  deleteDato(controlador: string, id: string){
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });
    console.log('Dentro de deleteDato');
    console.log(id);

    this.PuedeActivarse();

    return this.http.delete(`${ this.url }/${ controlador }/${ id }`, { headers }).pipe(map((res: any) => res));
  }

  getSelector(controlador: string){
    // const url = 'https://localhost:5001/api/Usuarios';
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    // console.log('Dentro de Selector');
    return this.http.get(`${ this.url }/${ controlador }/vigente`, { headers }).pipe(map((res: any) => res));
  }

  getSelectorEstado(controlador: string){
    // const url = 'https://localhost:5001/api/Usuarios';
    this.userToken = this.leerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    // console.log('Dentro de Selector');
    return this.http.get(`${ this.url }/${ controlador }`, { headers }).pipe(map((res: any) => res));
  }

  login( usuario: UsuarioModel ) {
    const authData = {
      ...usuario,
      //returnSecureToken: true
    };
    console.log(authData);
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
    // console.log('hola');
    // console.log(this.userToken);
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
    console.log('estaAutenticado');
    if ( this.userToken.length < 2 ) {
      return false;
    }
    this.estadoDelToken()
    //--
    
    //--
    if ( this.respuesta === false ) {
      console.log('respuesta: '+ this.respuesta);
      return false;
    }
    console.log(this.respuesta);
    console.log('estaAutenticado2');
    const expira = Number(localStorage.getItem('expira'));

    // console.log('Expira: ' + expira);

    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
    // return this.userToken.length > 2;
  }

  estadoDelToken() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${ this.userToken }`
    });

    console.log('estado Del Token');
    this.http.get(`${ this.url }/usuarios`, { headers, observe: 'response' })
    .subscribe(response => {
      console.log('suscrito');
      console.log(response.status);
    },
    (err) => {
      console.log('HTTP Error', err.status);
      // this.ruta.navigateByUrl('/login');
      this.logout();
      if (err.status === 0) {
        this.presentDesconectado();
      }
    });
    console.log('fuera del suscrito ' + this.respuesta);
    
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
      console.log('ok');
      return true;
    } else {
      console.log('no ok');
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
            console.log(data);
            this.navCtlr.navigateRoot(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

}
