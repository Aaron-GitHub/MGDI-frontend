import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: [
  ]
})
export class InicioComponent implements OnInit {

  constructor(public msalService:MsalService, public router:Router, public apiService: ApiService) { 

  }

  ngOnInit(): void {
    let app : AppComponent = new AppComponent(this.msalService, this.router);
    if (!app.isLogin()){
      this.router.navigateByUrl('login');
    }
  }

}
