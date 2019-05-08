import { Component, AfterViewInit } from '@angular/core';
import { Oferta } from '../../shared/oferta.model';
import { OfertasService } from '../../services/ofertas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [OfertasService]
})
export class CategoriasComponent implements AfterViewInit {

  public ofertas: Oferta[] = null

  public mainHeader: string = ''
  public subHeader: string = ''

  constructor(private ofertaService: OfertasService, private router: Router) { }

  ngAfterViewInit() {

    let categoria = this.router.url.replace('/', '')

    this.ofertaService.getPageHeaders(categoria)
      .then((headers: any) => {
        this.mainHeader = headers['main']
        this.subHeader = headers['sub']
      })

    this.ofertaService.getOfertasPorCategoria(categoria)
      .then((ofertas: Oferta[]) => {
        this.ofertas = ofertas
        if (this.ofertas.length == 0) {
          $('.secao').hide()
          $('footer').addClass('fixed-bottom')
        } else {
          $('.secao').show()
          $('footer').removeClass('fixed-bottom')
        }
      })
      .catch(() => {
        console.log('erro')
      })
  }

}
