import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { OfertasService } from '../../services/ofertas.service';
import { Oferta } from '../../shared/oferta.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // ao usar providers, este componente e seus filhos podem usar os serviços passados 
  // (como singleton)
  providers: [OfertasService] 
})
export class HomeComponent implements OnInit, AfterViewChecked {
  
  private ofertasService: OfertasService
  
  public ofertas: Array<Oferta> = []
  public ofertasEmDestaque: Oferta[] = []
  
  constructor(ofertasService: OfertasService) {
    this.ofertasService = ofertasService
  }
  
  public limparOfertas() {
    this.ofertas = []
  }
  
  ngOnInit() {
    this.ofertasService.getOfertas()
      .then(
        (ofertas: Oferta[]) => {
          let ofertasEmDestaque: Oferta[] = []
          
          for (let oferta of ofertas) {
            if (oferta.destaque) {
              ofertasEmDestaque.push(oferta)
            }
            this.ofertas.push(oferta)
          }
          this.ofertasEmDestaque = ofertasEmDestaque
        }
      )
  }

  ngAfterViewChecked() {
    if ($('.carousel-item.active').length == 0) {
      $('.carousel-item:first').addClass('active')
    }
  }

  public debug() {
    console.log(this.ofertasEmDestaque.length)
  }
}