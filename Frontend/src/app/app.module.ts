import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './components/logout/logout.component';
import { ApiService } from './services/api.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component'; // Importa tu servicio API


// import { AuthService } from './auth.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NotfoundComponent,
    LogoutComponent,
    NavbarComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Asegúrate de tener un AppRoutingModule o nombre similar
    RouterModule, // Agrega RouterModule aquí
    FormsModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
