import { Component, OnInit } from '@angular/core';
import { Oferta } from '../shared/oferta.model';
import { OfertasService } from '../services/ofertas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [OfertasService]
})
export class CategoriasComponent implements OnInit {
  
  public ofertas: Oferta[] = []
  
  public mainHeader: string = ''
  public subHeader: string = ''
  
  constructor(private ofertaService: OfertasService, private router: Router) { }
  
  ngOnInit() {
    
    let categoria = this.router.url.replace('/', '')
    
    this.ofertaService.getPageHeaders(categoria)
    .then((headers: any) => {
        this.mainHeader = headers[0]['main']
        this.subHeader = headers[0]['sub']
      })
      
    this.ofertaService.getOfertasPorCategoria(categoria)
      .then((ofertas: Oferta[]) => {
        this.ofertas = ofertas
      })
      .catch(() => {
        console.log('erro')
      })
  }
    
}
  