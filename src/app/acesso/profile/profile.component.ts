import { Component, OnInit } from '@angular/core';
import { Authenticator } from '../../services/auth.service';
import { OfertasService } from '../../services/ofertas.service'
import { Usuario } from '../../shared/usuario.model';

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

  public getUserIsVendor(): boolean {

    if (this.userInfo.isVendor === null || this.userInfo.isVendor === null) {

      this.updateIsVendorStatus()
    }
    return this.userInfo.isVendor
  }

  ngOnInit() {
    this.updateIsVendorStatus()
  }

  private updateIsVendorStatus() {
    this.userInfo = this.authenticator.getUserInfo()[1]
  }

  public test() {
    this.ofertaService.getOfertasPorAnunciante(btoa(this.userInfo.email))
  }


}
