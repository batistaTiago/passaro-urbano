import { Component, OnInit } from '@angular/core';
import { Oferta } from '../../shared/oferta.model';
import { Authenticator } from '../../services/auth.service'
import { OfertasService } from '../../services/ofertas.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as $ from 'jquery';

@Component({
  selector: 'app-cadastrar-oferta',
  templateUrl: './cadastrar-oferta.component.html',
  styleUrls: ['./cadastrar-oferta.component.css'],
  providers: [OfertasService]
})
export class CadastrarOfertaComponent implements OnInit {

  constructor(
    private ofertasService: OfertasService,
    private authenticator: Authenticator) { }

  ngOnInit() {
  }

  public formNovaOferta: FormGroup = new FormGroup(
    {
      'titulo': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(20)]),
      'descricao': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(256)]),
      'preco': new FormControl(null, [Validators.required, Validators.min(0.01)]),
      'categoria': new FormControl(null, [Validators.required])
    }
  )

  public imagens: Array<File> = null

  public atualizarImagens(files: FileList) {
    let images = Array.from(files)

    if (images.length > 0) {

      this.imagens = []
      $('form #images').html('')

      images.forEach(
        (image: File) => {
          let reader = new FileReader()
          let img = new Image()

          img.onload = () => {
            let ratio = img.width / img.height

            if (ratio >= 1.5 && ratio <= 1.8) {
              img.className = 'img-fluid col-md-4 mb-3'
              $('form #images').append(img)
              this.imagens.push(image)
            }
            else {
              alert('O arquivo ' + image.name + ' não tem dimensões compatíveis (aspect ratio entre 1.5 e 1.8) e está sendo ignorado')
            }

          }

          reader.onload = (event: any) => {
            img.src = event.target.result
          }

          reader.readAsDataURL(image)

        }
      )
    }

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
        [this.authenticator.getUserInfo()[1].nome, btoa(this.authenticator.getUserInfo()[1].email)],
        this.formNovaOferta.value.preco
      )

      this.ofertasService.cadastrarOferta(oferta, this.imagens)
        .then(
          (novaOferta: Oferta) => {
            console.log(novaOferta)
          }
        )
    }
  }



  public test() {
    console.log(this.imagens.length)
  }

}
