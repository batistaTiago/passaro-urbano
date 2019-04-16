import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authenticator } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private authToken: string = ''

  constructor(private authenticator: Authenticator) { }

  ngOnInit() {
  }

  public displayInvalidFeedback: boolean = false

  public formLogin: FormGroup = new FormGroup(
    {
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'senha': new FormControl(null, [Validators.required]),
    }
  )

  public submeterFormLogin(button: HTMLElement) {
    button.blur()
    if (this.formLogin.valid) {
      this.authenticator.autenticar(this.formLogin.value.email, this.formLogin.value.senha)
        .catch(
          () => {
            this.displayInvalidFeedback = true
          }
        )

    }
  }

}
