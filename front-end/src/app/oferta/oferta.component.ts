import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


import { Oferta } from '../shared/oferta.model';
import { OfertasService } from '../services/ofertas.service';
import { CarrinhoService } from '../services/carrinho.service';


@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrls: ['./oferta.component.css'],
  providers: [OfertasService]
})
export class OfertaComponent implements OnInit, AfterViewChecked {
  
  private route: ActivatedRoute

  public indexImagemSelecionada: number = 0

  private ofertasService: OfertasService
  private carrinhoService: CarrinhoService
  
  public oferta: Oferta = new Oferta()
  
  constructor(
      route: ActivatedRoute, 
      ofertasService: OfertasService,
      carrinhoService: CarrinhoService) { 
    this.route = route
    this.ofertasService = ofertasService
    this.carrinhoService = carrinhoService
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
    this.carrinhoService.incluirItem(this.oferta)
  }
  
  ngOnInit() {
    this.route.params.subscribe(
      (p: Params) => {
        this.ofertasService.getOfertaById(p.id).then(
          (oferta: Oferta) => {
            this.oferta = oferta
          }
          )
        })
      }

      ngAfterViewChecked() {
        let primitivo = $('.bt-img-galeria-selecionada').length == 0
        if (primitivo) {
          $('.bt-img-galeria:first').click()
        }
      }

    }
    