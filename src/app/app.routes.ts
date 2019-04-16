import { Routes } from '@angular/router'

import { HomeComponent } from "./main/home/home.component";

import { AdminComponent } from "./admin/admin.component";
import { LoginComponent } from "./admin/login/login.component";
import { CadastroComponent } from "./admin/cadastro/cadastro.component";
import { CadastrarOfertaComponent } from "./admin/cadastrar-oferta/cadastrar-oferta.component"

import { OfertaComponent } from './main/oferta/oferta.component';
import { ComoUsarComponent } from './main/oferta/como-usar/como-usar.component';
import { OndeFicaComponent } from './main/oferta/onde-fica/onde-fica.component';
import { OrdemCompraComponent } from './main/ordem-compra/ordem-compra.component';
import { CategoriasComponent } from './main/categorias/categorias.component';
import { AuthGuard } from './services/auth-guard.service';


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
    path: 'admin', component: AdminComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: CadastroComponent },
      {
        path: 'cadastrar-oferta',
        component: CadastrarOfertaComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
]