import { Component, OnInit } from '@angular/core';
import { Oferta } from '../../shared/oferta.model';
import { OfertasService } from '../../services/ofertas.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-oferta',
  templateUrl: './cadastrar-oferta.component.html',
  styleUrls: ['./cadastrar-oferta.component.css'],
  providers: [OfertasService]
})
export class CadastrarOfertaComponent implements OnInit {

  constructor(private ofertasService: OfertasService) { }

  ngOnInit() {
  }

  public formNovaOferta: FormGroup = new FormGroup(
    {
      'titulo': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(20)]),
      'anunciante': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(20)]),
      'descricao': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(256)]),
      'preco': new FormControl(null, [Validators.required, Validators.min(0.01)]),
      'categoria': new FormControl(null, [Validators.required])
    }
  )

  public imagens: Array<File> = null

  public atualizarImagens(files: FileList) {
    this.imagens = Array.from(files)
    $('#custom-file-label').html(`${this.imagens.length} arquivo(s) selecionado(s)`)
  }

  public imagensValidas(): boolean {
    if (this.imagens) {
      return this.imagens.length > 0
    }
    return false
  }

  public cadastrarOfertaButtonClick(sender: HTMLElement) {
    sender.blur()

    if (this.formNovaOferta.valid && this.imagensValidas()) {
      let oferta = new Oferta(
        this.formNovaOferta.value.categoria,
        this.formNovaOferta.value.titulo,
        this.formNovaOferta.value.descricao,
        this.formNovaOferta.value.anunciante,
        this.formNovaOferta.value.preco
      )

      this.ofertasService.cadastrarOferta(oferta, this.imagens)
    }
  }

}
