import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/servicios/api/api.service';
import jwt_decode  from "jwt-decode"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  nombre = 'Perfil';
  faena = "prueba";
  faenas:Array<any> = new Array();
  http : HttpClient;
  app : AppComponent;
  //apiService : ApiService;

  constructor(private msalService: MsalService, public router: Router,public apiService: ApiService) { 
    this.app = new AppComponent(msalService, router);
    this.apiService = new ApiService(this.http, msalService, router);
  }

  ngOnInit(): void {
    if (this.app.isLogin()){
      if(this.msalService.instance.getActiveAccount().name != '' && this.msalService.instance.getActiveAccount().name != undefined){
        this.nombre = this.msalService.instance.getActiveAccount().name;
      }

      this.faena = localStorage.getItem("faena");

      let token_decode = jwt_decode(localStorage.getItem("JWT_AT"));
      let roles:String[] = token_decode["roles"];
      let permisos:Map<String, String> = new Map();

      //obtengo faenas y permisos del usuario
      for(var i = 0; i < roles.length; i++)
      {
        let faen_rol:String[] = roles[i].split("_");
        let faena:String[] = faen_rol[0].split("-");
        let rol:String[] = faen_rol[1].split("-");
        this.faenas.push({"id": faena[1], "faena": faena[0], "rol_id": rol[1], "rol": rol[0]});
        permisos.set(rol[1], rol[0]);
      }
    }
  }

  logOut(){
    this.app.logOut();
  }

  //cambia de faena
  setFaena(faena){
    this.faenas.forEach(element=>{
      if(element["id"] == faena){
        localStorage.setItem("faena", element["faena"]+" ("+ element["rol"]+")");
        localStorage.setItem("faena_cargo", element["faena"]+"-"+element["id"]+"_"+element["rol"]+"-"+element["rol_id"]);//Andina-1_Técnico-1)
      }
    });

    location.reload();
  }

}

