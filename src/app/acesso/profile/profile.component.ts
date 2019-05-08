import { Component, OnInit, OnDestroy } from '@angular/core';
import { Authenticator } from '../../services/auth.service';
import { OfertasService } from '../../services/ofertas.service'
import { Usuario } from '../../shared/usuario.model';
import { Oferta } from '../../shared/oferta.model';
import { OrdemCompraService } from '../../services/ordem-compra.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [OfertasService, OrdemCompraService]
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(private authenticator: Authenticator,
    private ofertaService: OfertasService,
    private ordemCompraService: OrdemCompraService) { }

  private userInfo: Usuario
  public ofertas: Oferta[] = null
  public vendasPendentes: Array<any> = []


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

      this.ordemCompraService.getVendasPendentes(this.authenticator.getUserInfo()[1].id).then(
        (vendasPendentes: Array<any>) => {
          this.vendasPendentes = vendasPendentes
        }
      )
    }
  }

  ngOnDestroy() {
    $('footer').removeClass('fixed-bottom')
  }

  private updateIsVendorStatus() {
    this.userInfo = this.authenticator.getUserInfo()[1]
  }

  public test() {
    console.log(this.vendasPendentes)
  }

  public editarOfertaButtonClick(event: Event, oferta: Oferta) {
    (<HTMLElement>event.target).blur()
    console.log(oferta)
  }

  public apagarOfertaButtonClick(oferta: Oferta) {
    (<HTMLElement>event.target).blur()
    if (confirm('Realmente deseja apagar a oferta ' + oferta.titulo + '? Esta ação NÃO PODE SER DESFEITA.')) {
      console.log(oferta.id)
      this.ofertaService.removerOferta(oferta)
    }
  }

}
