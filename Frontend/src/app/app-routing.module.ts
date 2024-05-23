import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { AdvertisementManagementComponent } from './components/advertisement-management/advertisement-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MisAnunciosComponent } from './components/mis-anuncios/mis-anuncios.component';
import { CrearAnuncioComponent } from './components/crear-anuncio/crear-anuncio.component';
import { ModificarAnuncioComponent } from './components/modificar-anuncio/modificar-anuncio.component';
import { CommentManagementComponent } from './components/comment-management/comment-management.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { EditAdvertisementComponent } from './components/edit-advertisement/edit-advertisement.component';
import { AddRatingComponent } from './components/add-rating/add-rating.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { loginGuard } from './components/guards/login.guard';
import { MessagesComponent } from './components/messages/messages.component';
import { CondicionesComponent } from './components/condiciones/condiciones.component';
import { ProgramingLanguageManagementComponent } from './components/programing-language-management/programing-language-management.component';
import { AddProgramingLanguageComponent } from './components/add-programing-language/add-programing-language.component';
import { PaymentcreateAdvertisementComponent } from './components/payment-crear-anuncio/payment-crear-anuncio.component';

const routes: Routes = [

  // Routing del login registro y logout.
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },

  //Parte que puede visualizar cliente sin registrar
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'condiciones', component: CondicionesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'advertisement/:advertisementId', component: AdvertisementComponent },

  //Parte del cliente ya registrado que puede visualizar
  { path: 'userManagement', component: UserManagementComponent, canActivate: [loginGuard] },
  { path: 'adManagement', component: AdvertisementManagementComponent, canActivate: [loginGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [loginGuard] },
  { path: 'paymentcreateAdvertisement', component: PaymentcreateAdvertisementComponent, canActivate: [loginGuard] },

  { path: 'lista-favoritos/:userId', component: FavouriteListComponent, canActivate: [loginGuard] },
  { path: 'addRating', component: AddRatingComponent, canActivate: [loginGuard] },
  { path: 'commentManagement', component: CommentManagementComponent, canActivate: [loginGuard] },
  { path: 'editUser', component: EditUserComponent, canActivate: [loginGuard] },
  { path: 'editAdd', component: EditAdvertisementComponent, canActivate: [loginGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [loginGuard] },
  { path: 'mis-anuncios/:userId', component: MisAnunciosComponent, canActivate: [loginGuard] },
  { path: 'crear-anuncio', component: CrearAnuncioComponent, canActivate: [loginGuard] },
  { path: 'modificar-anuncio/:advertisementId', component: ModificarAnuncioComponent, canActivate: [loginGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [loginGuard] },
  { path: 'addProgramingLanguages', component: AddProgramingLanguageComponent, canActivate: [loginGuard] },
  { path: 'programingLanguagesManagement', component: ProgramingLanguageManagementComponent, canActivate: [loginGuard] },


  //En caso de una ruta erronea te redirige al home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent } //la darrera!!!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
