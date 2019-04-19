import { Component, OnInit } from '@angular/core';
import { Authenticator } from '../../services/auth.service';
import { OfertasService } from '../../services/ofertas.service'
import { Usuario } from '../../shared/usuario.model';
import { Oferta } from '../../shared/oferta.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ OfertasService ]
})
export class ProfileComponent implements OnInit {

  constructor(private authenticator: Authenticator,
    private ofertaService: OfertasService) { }

  private userInfo: Usuario
  private ofertas: Oferta[] = []

  public getUserIsVendor(): boolean {

    if (this.userInfo.isVendor === null || this.userInfo.isVendor === null) {

      this.updateIsVendorStatus()
    }
    return this.userInfo.isVendor
  }

  ngOnInit() {
    this.updateIsVendorStatus()
    if (this.userInfo.isVendor) {
      this.ofertaService.getOfertasPorAnunciante(btoa(this.userInfo.email))
      .then(
        (ofertas: Oferta[]) => {
          this.ofertas = ofertas
        }
      )
    }
  }

  private updateIsVendorStatus() {
    this.userInfo = this.authenticator.getUserInfo()[1]
  }

  public test() {
    for (let oferta of this.ofertas) {
      console.log(oferta)
    }
  }

  public editarOfertaButtonClick(event: Event, oferta: Oferta) {
    (<HTMLElement>event.target).blur()
    console.log(oferta)
  }

}
