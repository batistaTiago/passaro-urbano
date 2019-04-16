import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { Oferta } from '../../shared/oferta.model';
import { OfertasService } from '../../services/ofertas.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Authenticator } from '../../services/auth.service';


@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrls: ['./oferta.component.css'],
  providers: [OfertasService]
})
export class OfertaComponent implements OnInit, AfterViewChecked {


  public indexImagemSelecionada: number = 0

  public oferta: Oferta = new Oferta()

  constructor(
    private route: ActivatedRoute,
    private ofertasService: OfertasService,
    private carrinhoService: CarrinhoService,
    private authenticator: Authenticator,
    private router: Router) {

  }

  public imageClicked(event: Event) {
    $('.bt-img-galeria-selecionada').removeClass('bt-img-galeria-selecionada')
    let url = event.target['attributes']['src'].value
    let previousIndex = this.indexImagemSelecionada
    for (let att in this.oferta.imagens) {
      if (this.oferta.imagens[att]['url'] == url) {

        let clickedElement = $('.bt-img-galeria')[att]
        clickedElement.id = 'clicked'

        $('#clicked').toggleClass('bt-img-galeria-selecionada')

        clickedElement.id = ''

        this.indexImagemSelecionada = parseInt(att)
        break
      }
    }

    if (previousIndex != this.indexImagemSelecionada) {
      $('#featured-image').fadeToggle(() => {
        $('#featured-image').attr('src', this.oferta.imagens[this.indexImagemSelecionada]['url'])
        $('#featured-image').fadeToggle()
      })
    }
  }

  public adicionarAoCarrinho() {
    if (this.authenticator.usuarioAutenticado()) {
      this.carrinhoService.incluirItem(this.oferta)
    } else {
      this.router.navigate(['/login'])
    }
    
  }

  ngOnInit() {
    this.route.params.subscribe(
      (p: Params) => {
        this.ofertasService.getOfertaById(p.id).then(
          (oferta: Oferta) => {
            this.oferta = oferta
          }
        )
      }
    )
  }

  ngAfterViewChecked() {
    let primitivo = $('.bt-img-galeria-selecionada').length == 0
    if (primitivo) {
      $('.bt-img-galeria:first').click()
    }
  }

}
