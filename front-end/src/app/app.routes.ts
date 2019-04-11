import { Routes } from '@angular/router'

import { HomeComponent } from "./home/home.component";

import { OfertaComponent } from './oferta/oferta.component';
import { ComoUsarComponent } from './oferta/como-usar/como-usar.component';
import { OndeFicaComponent } from './oferta/onde-fica/onde-fica.component';
import { OrdemCompraComponent } from './ordem-compra/ordem-compra.component';
import { CategoriasComponent } from './categorias/categorias.component';


export const ROUTES: Routes = [
    { path: "", component: HomeComponent },
    { path: "restaurantes", component: CategoriasComponent },
    { path: "diversao", component: CategoriasComponent },
    { path: "festas", component: CategoriasComponent },
    { path: "oferta", component: OfertaComponent },
    { path: 'oferta/:id', component: OfertaComponent,
        children:  [
            { path: 'como-usar', component: ComoUsarComponent },
            { path: 'onde-fica', component: OndeFicaComponent }
        ]
    },
    { path: 'ordem-compra', component: OrdemCompraComponent }
]