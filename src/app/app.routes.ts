import { Routes } from '@angular/router'

import { HomeComponent } from "./main/home/home.component";

import { ProfileComponent } from "./acesso/profile/profile.component";
import { LoginComponent } from "./acesso/login/login.component";
import { CadastroComponent } from "./acesso/cadastro/cadastro.component";
import { EditarOfertaComponent } from './acesso/editar-oferta/editar-oferta.component';

import { OfertaComponent } from './main/oferta/oferta.component';
import { ComoUsarComponent } from './main/oferta/como-usar/como-usar.component';
import { OndeFicaComponent } from './main/oferta/onde-fica/onde-fica.component';
import { OrdemCompraComponent } from './main/ordem-compra/ordem-compra.component';
import { CategoriasComponent } from './main/categorias/categorias.component';
import { AuthGuard } from './services/auth-guard.service';
import { UnloggedAuthGuard } from './services/auth-guard-unlogged.service';
import { VendorAuthGuard } from './services/auth-guard-vendor.service';



export const ROUTES: Routes = [
  { path: "", component: HomeComponent },
  { path: "restaurantes", component: CategoriasComponent },
  { path: "diversao", component: CategoriasComponent },
  { path: "festas", component: CategoriasComponent },
  { path: "oferta", component: OfertaComponent },
  {
    path: 'oferta/:id', component: OfertaComponent,
    children: [
      { path: 'como-usar', component: ComoUsarComponent },
      { path: 'onde-fica', component: OndeFicaComponent }
    ]
  },
  {
    path: 'ordem-compra',
    component: OrdemCompraComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnloggedAuthGuard]
  },
  {
    path: 'cadastro',
    component: CadastroComponent,
    canActivate: [UnloggedAuthGuard]
  },
  {
    path: 'perfil',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cadastrar-oferta',
    component: EditarOfertaComponent,
    canActivate: [ VendorAuthGuard ]
  },
  {
    path: 'editar-oferta/:id',
    component: EditarOfertaComponent,
    canActivate: [ VendorAuthGuard ]
  }

  /*{
    path: 'admin', component: AcessoComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: CadastroComponent },
      {
        path: 'cadastrar-oferta',
        component: CadastrarOfertaComponent,
        canActivate: [AuthGuard]
      }
    ]
  }*/
]