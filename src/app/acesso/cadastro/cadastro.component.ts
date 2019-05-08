import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authenticator } from '../../services/auth.service';
import { Usuario } from '../../shared/usuario.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements AfterViewInit, OnDestroy {

  constructor(private authenticator: Authenticator) { }

  ngAfterViewInit() {
    $('footer').addClass('fixed-bottom')
  }

  ngOnDestroy() {
    $('footer').removeClass('fixed-bottom')
  }

  public formCadastro: FormGroup = new FormGroup(
    {
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'nome': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
      'senha': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      'confirmacaoSenha': new FormControl(null, []),
      'tipoConta': new FormControl(null, [Validators.required])
    }
  )

  public verificarSenhas() {
    if ((this.formCadastro.get('senha').value == this.formCadastro.get('confirmacaoSenha').value) && (this.formCadastro.get('senha').valid)) {
      $('#inputConfirmacaoSenha').addClass('is-valid')
      $('#inputConfirmacaoSenha').removeClass('is-invalid')
      $('#cadastrarButton').attr('disabled', 'false')
    } else {
      $('#inputConfirmacaoSenha').addClass('is-invalid')
      $('#inputConfirmacaoSenha').removeClass('is-valid')
      $('#cadastrarButton').attr('disabled', 'true')
    }
  }

  public formIsValid() {
    return this.formCadastro.valid && $('#inputConfirmacaoSenha').hasClass('is-valid')
  }


  public cadastrarButtonClick(sender: HTMLElement) {
    sender.blur()

    Object.keys(this.formCadastro.controls).forEach(
      (key: string) => {
        this.formCadastro.get(key).markAsDirty()
      }
    )

    if (this.formCadastro.valid) {
      let usuario = new Usuario(
        '',
        this.formCadastro.value.email,
        this.formCadastro.value.nome,
        this.formCadastro.value.tipoConta === "Anunciante"
      )

      this.authenticator.cadastrarUsuario(usuario, this.formCadastro.value.senha)
        .catch(
          (erro) => {
            if (erro.code == 'auth/email-already-in-use') {
              alert('Erro: Email já está em uso')
              $('#inputEmail').removeClass('is-valid')
              $('#inputEmail').addClass('is-invalid')
            }
          }
        )
    }
  }
}