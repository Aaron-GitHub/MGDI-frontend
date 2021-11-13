import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ApiService } from './servicios/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  title = 'MGDI-frontend';

  constructor(public msalService: MsalService, public router: Router){}

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if(res != null && res.account != null){
          this.msalService.instance.setActiveAccount(res.account);
        }
      }
    );
  }

  login(){
    this.msalService.loginRedirect();
  }

  isLogin(): boolean{
    return this.msalService.instance.getActiveAccount() != null;
  }

  logOut(){
    this.msalService.instance.setActiveAccount(null);
    console.log(this.isLogin());
    this.router.navigateByUrl('/');
  }
  
  
}
