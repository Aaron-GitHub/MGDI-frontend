import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { ResponceI } from 'src/app/modelos/response.interface';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  app : AppComponent;
  menu : Array<any> = new Array();

  constructor(private msalService: MsalService, public router: Router,public apiService: ApiService) {
    this.app = new AppComponent(msalService, router);
  }

  ngOnInit(): void {
    let faena_cargo = localStorage.getItem("faena_cargo").split("_");
    let faena_id = faena_cargo[0].split("-")[1];
    let usuario_id = localStorage.getItem("UID");

    console.log(faena_id, usuario_id);

    this.apiService.getDatos('menu/' + usuario_id + '/' + faena_id).subscribe(
      (resp : ResponceI) => {
        resp.data.forEach(element => {
          console.log(element["vista"]["nombre"]);
          this.menu.push({"name": element["vista"]["nombre"], "componente": element["vista"]["controller"]});
        });
      }
    );

  }


}
