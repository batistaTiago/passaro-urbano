import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { TopoComponent } from './main/topo/topo.component';
import { HomeComponent } from './main/home/home.component';
import { RodapeComponent } from './main/rodape/rodape.component';
import { CategoriasComponent } from './main/categorias/categorias.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { OfertaComponent } from './main/oferta/oferta.component';
import { ComoUsarComponent } from './main/oferta/como-usar/como-usar.component';
import { OndeFicaComponent } from './main/oferta/onde-fica/onde-fica.component';
import { OrdemCompraComponent } from './main/ordem-compra/ordem-compra.component';
import { OrdemCompraSucessoComponent } from './main/ordem-compra-sucesso/ordem-compra-sucesso.component';
import { CarrinhoService } from './services/carrinho.service';
import { AdminComponent } from './admin/admin.component';
import { CadastroComponent } from './admin/cadastro/cadastro.component';
import { LoginComponent } from './admin/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TopoComponent,
    HomeComponent,
    RodapeComponent,
    CategoriasComponent,
    OfertaComponent,
    ComoUsarComponent,
    OndeFicaComponent,
    OrdemCompraComponent,
    OrdemCompraSucessoComponent,
    AdminComponent,
    CadastroComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    FormsModule
  ],
  providers: [
    { provide:LOCALE_ID, useValue: 'pt' },
    CarrinhoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localePt);