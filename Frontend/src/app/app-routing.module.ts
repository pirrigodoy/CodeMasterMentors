import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdvertisementManagementComponent } from './components/advertisement-management/advertisement-management.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentcreateAdvertisementComponent } from './components/payment-crear-anuncio/payment-crear-anuncio.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { AddRatingComponent } from './components/add-rating/add-rating.component';
import { CommentManagementComponent } from './components/comment-management/comment-management.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { EditAdvertisementComponent } from './components/edit-advertisement/edit-advertisement.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MisAnunciosComponent } from './components/mis-anuncios/mis-anuncios.component';
import { CrearAnuncioComponent } from './components/crear-anuncio/crear-anuncio.component';
import { ModificarAnuncioComponent } from './components/modificar-anuncio/modificar-anuncio.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AddProgramingLanguageComponent } from './components/add-programing-language/add-programing-language.component';
import { ProgramingLanguageManagementComponent } from './components/programing-language-management/programing-language-management.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { CondicionesComponent } from './components/condiciones/condiciones.component';
import { loginGuard } from './components/guards/login.guard';
import { OwnProfileGuard } from './components/guards/OwnProfileGuard.guard';
import { RoleGuard } from './components/guards/role.guard';
import { OwnAdvertisementGuard } from './components/guards/OwnAdvertisementGuard.guard';
import { PagoAnuncioGuard } from './components/guards/PagoAnuncio.guard';

const routes: Routes = [
  // Rutas públicas
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'advertisement/:advertisementId', component: AdvertisementComponent, canActivate: [OwnAdvertisementGuard] },

  // Rutas protegidas por loginGuard (usuario registrado)
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [loginGuard, OwnProfileGuard] },
  { path: 'mis-anuncios/:userId', component: MisAnunciosComponent, canActivate: [RoleGuard], data: { expectedRole: '2' } },
  { path: 'crear-anuncio', component: CrearAnuncioComponent, canActivate: [RoleGuard, PagoAnuncioGuard], data: { expectedRole: '2' } },
  { path: 'modificar-anuncio/:advertisementId', component: ModificarAnuncioComponent, canActivate: [RoleGuard], data: { expectedRole: '2' } },
  { path: 'messages', component: MessagesComponent, canActivate: [loginGuard] },

  // Rutas protegidas por roleGuard (administrador)
  { path: 'userManagement', component: UserManagementComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },
  { path: 'adManagement', component: AdvertisementManagementComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },
  { path: 'payment', component: PaymentComponent, canActivate: [RoleGuard], data: { expectedRole: '1' } },
  { path: 'paymentcreateAdvertisement', component: PaymentcreateAdvertisementComponent, canActivate: [RoleGuard], data: { expectedRole: '2' } },
  { path: 'lista-favoritos/:userId', component: FavouriteListComponent, canActivate: [RoleGuard], data: { expectedRole: '1' } },
  { path: 'addRating', component: AddRatingComponent, canActivate: [RoleGuard], data: { expectedRole: '1' } },
  { path: 'commentManagement', component: CommentManagementComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },
  { path: 'editUser', component: EditUserComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },
  { path: 'editAdd', component: EditAdvertisementComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },
  { path: 'addProgramingLanguages', component: AddProgramingLanguageComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },
  { path: 'programingLanguagesManagement', component: ProgramingLanguageManagementComponent, canActivate: [RoleGuard], data: { expectedRole: '3' } },

  // Rutas de autenticación
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },

  // Ruta de condiciones
  { path: 'condiciones', component: CondicionesComponent },

  // Rutas de redireccionamiento y página no encontrada
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent } // La última ruta para cualquier otra ruta no encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
