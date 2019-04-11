import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OfertasService } from '../../services/ofertas.service';

@Component({
  selector: 'app-como-usar',
  templateUrl: './como-usar.component.html',
  styleUrls: ['./como-usar.component.css'],
  providers: [OfertasService]
})
export class ComoUsarComponent implements OnInit {

  private ofertasService: OfertasService
  private route: ActivatedRoute

  public comoUsar: string = ''

  constructor(route: ActivatedRoute, ofertasService: OfertasService) { 
    this.ofertasService = ofertasService
    this.route = route
  }

  ngOnInit() {
    this.route.parent.params.subscribe((p: Params) => {
      this.ofertasService.getComoUsarOfertaById(p.id)
      .then(
        ((comoUsar: string) => {
          this.comoUsar = comoUsar
        })
      )
    })
  }
}
