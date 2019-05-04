import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { OfertasService } from '../../services/ofertas.service';
import { Oferta } from '../../shared/oferta.model';

import * as firebase from 'firebase'

@Component({
  selector: 'app-editar-oferta',
  templateUrl: './editar-oferta.component.html',
  styleUrls: ['./editar-oferta.component.css'],
  providers: [OfertasService]
})
export class EditarOfertaComponent implements OnInit {

  public formEditarOferta: FormGroup = new FormGroup(
    {
      'titulo': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(20)]),
      'descricao': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.max(256)]),
      'preco': new FormControl(null, [Validators.required, Validators.min(0.01)]),
      'categoria': new FormControl(null, [Validators.required])
    }
  )

  public oferta: Oferta = null

  private imagens: Array<File>

  constructor(
    private ofertasService: OfertasService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (p: Params) => {
        this.ofertasService.getOfertaById(p.id).then(
          (oferta: Oferta) => {
            this.oferta = oferta
          }
        )
      }
    )
  }

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

  public editarOfertaButtonClick(sender: HTMLElement) {
    sender.blur()

    let oferta = this.oferta

    oferta.titulo = this.formEditarOferta.get('titulo').pristine ? oferta.titulo : this.formEditarOferta.value.titulo
    oferta.descricao = this.formEditarOferta.get('descricao').pristine ? oferta.descricao : this.formEditarOferta.value.descricao
    oferta.categoria = this.formEditarOferta.get('categoria').pristine ? oferta.categoria : this.formEditarOferta.value.categoria
    oferta.preco = this.formEditarOferta.get('preco').pristine ? oferta.preco : this.formEditarOferta.value.preco

    if (oferta.titulo == null || oferta.titulo == undefined) {
      console.log('erro de titulo')
      return
    }

    if (oferta.descricao == null || oferta.descricao == undefined) {
      console.log('erro de descricao')
      return
    }

    if (oferta.categoria == null || oferta.categoria == undefined) {
      console.log('erro de categoria')
      return
    }

    if (oferta.preco == null || oferta.preco == undefined) {
      console.log('erro de preco')
      return
    }


    // atualiza os campos de texto
    this.ofertasService.atualizarOferta(oferta)
      .then(
        () => {
          if (this.imagens != undefined && this.imagens != null) {
            if (this.imagens.length > 0) {
              // atualiza as imagens
              this.ofertasService.atualizarImagensOferta(oferta, this.imagens)
            }
          }
        }
      )
    

  }






















  public printarOferta() {
    console.log(this.oferta)
    //A maior de todas as descrições possíveis para uma oferta de festa. Só para testar se o layout está funcionando bem. Não perca, oferta válida por tempo limitado!
  }

  public removerImagens() {
    this.ofertasService.removerImagensOferta(this.oferta)
    .then(
      () => {
        console.log('sucesso')
      }
    )
    .catch(
      () => {
        console.log('erro')
      }
    )
  }



}
