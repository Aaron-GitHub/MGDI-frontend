import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http'
import { VarialesGlobales } from 'src/app/variablesGlobales';
import { RequestOptions } from 'http';
import { ResponceI } from 'src/app/modelos/response.interface';
import jwtDecode from 'jwt-decode';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { timeStamp } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  app : AppComponent;
  urlapi:string = VarialesGlobales.API_URL;

  headers:HttpHeaders;
  options:RequestOptions;
  params:HttpParams;

  access_token:String;
  refresh_token:String;

  faenas: Map<String, String>;
  permisos:Map<String, String>;

  constructor(private http: HttpClient ,private msalService: MsalService, public router: Router) { 
    this.app = new AppComponent(msalService, router);
  }

  //Obtiene el tocken
  getTokens(username){
    let parametros = new HttpParams();
    parametros = parametros.append('username', username);
    parametros = parametros.append('password', username + "ANZR_SZ_CP");

    var body = {"username": username,   "password": username + "ANZR_SZ_CP"};

    const opciones = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': "*",
        'Accept': 'application/json',
        'Content-Type':'application/x-www-form-urlencoded',
      }),
      params: parametros
    };

    return this.http.post(this.urlapi + 'login', body, opciones);
  }


  //Refresh tocken
  refreshToken():boolean {
    let SW = false;
    const opciones = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': "*",
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("JWT_RT"),
      }),
    };
    this.http.post(this.urlapi + 'usuario/refrescatoken', '' , opciones).subscribe(
      (resp : ResponceI) => {
        localStorage.setItem('JWT_AT', resp.data["access_token"]);
        localStorage.setItem('JWT_RT', resp.data["refresh_token"]);
        SW = true;
      },
      (err: HttpErrorResponse) => {
        SW = false;
      }
    );
    return SW;
  }

  //VALIDA SI LOS TOKENS AUN NO EXPIRAN
  validaTokens():boolean{
    let a_tkn = jwtDecode(localStorage.getItem('JWT_AT'));
    let r_tkn = jwtDecode(localStorage.getItem('JWT_RT'));
    let f_a_tkn = a_tkn['exp'];
    let f_r_tkn = r_tkn['exp'];
    
    let date = new Date();

    console.log(f_a_tkn, date);

    //SI LA FECHA DE TOCKEN ES MAYOR A LA ACTUAL RETORNO VERDADER
    if(f_a_tkn > Date.now()){
      console.log("OK");
      return true;
    }else{
      //SI LA FECHA DE REFRESHTOCKEN ES MAYOR A LA ACTUAL REFRESO LOS TOKENS, SI NO, RETORNO FALSO
      if(f_r_tkn > Date.now()){
        console.log("refresca");
        return this.refreshToken();
      }else{
        console.log("MAL");
        return false;
      }
    }

  }


  getDatos(url:string){
    const opciones = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': "*",
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("JWT_AT"),
      }),
    };

    if(this.validaTokens()){
      return this.http.get(this.urlapi + url, opciones);
    }else{
      this.app.logOut();
    }    
  }

  
}
