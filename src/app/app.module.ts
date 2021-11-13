import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './componentes/compartidos/menu/menu.component';
import { HeaderComponent } from './componentes/compartidos/header/header.component';
import { ContentComponent } from './componentes/compartidos/content/content.component';

import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';

export function MsalServiceInstance(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: "ccc305dd-80d0-46b2-a760-bcc082319e22",
      redirectUri: "http://localhost:4200/login"
    },
    cache:{
      cacheLocation: 'localStorage'
    }
  })
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    ContentComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
    MsalModule
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MsalServiceInstance
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
