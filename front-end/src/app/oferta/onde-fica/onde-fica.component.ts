import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OfertasService } from '../../services/ofertas.service';


@Component({
  selector: 'app-onde-fica',
  templateUrl: './onde-fica.component.html',
  styleUrls: ['./onde-fica.component.css'],
  providers: [ OfertasService ]
})
export class OndeFicaComponent implements OnInit {

  private ofertasService: OfertasService
  private route: ActivatedRoute

  public ondeFica: string = ''

  constructor(route: ActivatedRoute, ofertasService: OfertasService) { 
    this.ofertasService = ofertasService
    this.route = route
  }

  ngOnInit() {
    this.route.parent.params.subscribe((p: Params) => {
      this.ofertasService.getOndeFicaOfertaById(p.id)
      .then(
        ((ondeFica: string) => {
          this.ondeFica = ondeFica
        })
      )
    })
  }
}
