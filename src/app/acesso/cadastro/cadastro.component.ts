import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authenticator } from '../../services/auth.service';
import { Usuario } from '../../shared/usuario.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  constructor(private authenticator: Authenticator) { }

  ngOnInit() {
  }

  public formCadastro: FormGroup = new FormGroup(
    {
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'nome': new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
      'senha': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      'tipoConta': new FormControl(null, [Validators.required])
    }
  )


  public cadastrarButtonClick(sender: HTMLElement) {
    sender.blur()

    Object.keys(this.formCadastro.controls).forEach(
      (key: string) => {
        this.formCadastro.get(key).markAsDirty()
      }
    )

    if (this.formCadastro.valid) {

      let usuario = new Usuario(
        this.formCadastro.value.email,
        this.formCadastro.value.nome,
        this.formCadastro.value.tipoConta === "Anunciante"
      )

      this.authenticator.cadastrarUsuario(usuario, this.formCadastro.value.senha)

    }
  }

}
