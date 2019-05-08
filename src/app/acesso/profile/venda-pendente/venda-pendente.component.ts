import { Component, OnInit, Input } from '@angular/core';

import { OrdemCompraService } from '../../../services/ordem-compra.service';

@Component({
  selector: 'app-venda-pendente',
  templateUrl: './venda-pendente.component.html',
  styleUrls: ['./venda-pendente.component.css'],
  providers: [OrdemCompraService]
})
export class VendaPendenteComponent implements OnInit {

  constructor(private ordemCompraService: OrdemCompraService) { }

  @Input() public vendaPendente: any

  ngOnInit() {
  }

  public aceitarVenda(vendaPendente: any) {
    this.ordemCompraService.aceitarVenda(vendaPendente.key)
      .then(
        () => {
          let elementId = '#' + vendaPendente.key
          let element = $(elementId)
          element.fadeOut(
            () => {
              element.remove()
            }
          )
        }
      )
  }

  public rejeitarVenda(vendaPendente: any) {
    this.ordemCompraService.rejeitarVenda(vendaPendente.key)
      .then(
        () => {
          let elementId = '#' + vendaPendente.key
          let element = $(elementId)
          element.fadeOut(
            () => {
              element.remove()
            }
          )
        }
      )
  }

}
