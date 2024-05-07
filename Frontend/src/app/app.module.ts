import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './components/logout/logout.component';
import { ApiService } from './services/api.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { MisAnunciosComponent } from './components/mis-anuncios/mis-anuncios.component';
import { CrearAnuncioComponent } from './components/crear-anuncio/crear-anuncio.component';
import { ModificarAnuncioComponent } from './components/modificar-anuncio/modificar-anuncio.component';
import { CommentManagementComponent } from './components/comment-management/comment-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdvertisementManagementComponent } from './components/advertisement-management/advertisement-management.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { EditAdvertisementComponent } from './components/edit-advertisement/edit-advertisement.component';
import { AddRatingComponent } from './components/add-rating/add-rating.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { ReciboComponent } from './components/recibo/recibo.component';
import { ApplicationComponent } from './components/application/application.component';
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
    AboutusComponent,
    ContactComponent,
    MisAnunciosComponent,
    CrearAnuncioComponent,
    ModificarAnuncioComponent,
    ProfileComponent,
    AdvertisementComponent,
    UserManagementComponent,
    CommentManagementComponent,
    AdvertisementManagementComponent,
    EditUserComponent,
    EditAdvertisementComponent,
    AddRatingComponent,
    PaymentComponent,
    FavouriteListComponent,
    ReciboComponent,
    ApplicationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Asegúrate de tener un AppRoutingModule o nombre similar
    RouterModule, // Agrega RouterModule aquí
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
