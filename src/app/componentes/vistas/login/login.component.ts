import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ResponceI } from 'src/app/modelos/response.interface';
import jwt_decode  from "jwt-decode"
import { HeaderComponent } from '../../compartidos/header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent extends AppComponent implements OnInit {
  isError: boolean = false;
  isSuccess: boolean = false;
  header: HeaderComponent = new HeaderComponent(this.msalService, this.router, this.apiService);

  constructor(public msalService: MsalService, public router: Router, public apiService: ApiService) {
    super(msalService, router);
    this.compruebaUsuario();
  }

  ngOnInit(): void {
    if(this.isLogin()){
      location.href = 'inicio';
    }
  }

  compruebaUsuario() {
    console.log('comprobando usuario');
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if (res != null && res.account != null) {
          var email = this.msalService.instance.getActiveAccount().username;
          //Obtengo el token
          this.apiService.getTokens(email).subscribe(
            (resp: ResponceI) => {
              this.apiService.access_token = resp.data["access_token"];

              //Decodifica token
              let token_decode = jwt_decode(resp.data["access_token"]);
              let roles:String[] = token_decode["roles"];
              
              //obtengo faenas y permisos del usuario
              for(var i = 0; i < roles.length; i++)
              {
                let faen_rol:String[] = roles[i].split("_");
                let faena:String[] = faen_rol[0].split("-");
                let rol:String[] = faen_rol[1].split("-");
               
                if(i == 0){
                  localStorage.setItem("faena", faena[0].toString()+" ("+ rol[0] +")");
                }
              }

              //se guarda el token en localStorage
              localStorage.setItem('JWT_AT', resp.data["access_token"]);
              localStorage.setItem('JWT_RT', resp.data["refresh_token"]);
              
              //verifico si existe el usuario
              this.apiService.getDatos('usuario/existeusuario/' + email)
                .subscribe(
                  (resp: ResponceI) => {
                    if (resp.data['correo_electronico'] == email) {
                      this.isError = false;
                      this.isSuccess = true;
                      location.href = 'inicio';
                      localStorage.setItem("faena_cargo", roles[0].toString());
                      localStorage.setItem("UID", resp.data['id']);
                      console.log('INICIO');
                    } else{
                      console.log('No INICIO ' + email + " - " + resp.data['correo_electronico']);
                    }
                  },
                  (err: HttpErrorResponse) => {
                    this.isError = true;
                    this.isSuccess = false;
                    this.msalService.instance.setActiveAccount(null);
                    console.log('LOGIN 2', err.message);
                  });
            });
        }else{
          console.log('comprobando usuario no res');
        }
      });

  }

}

