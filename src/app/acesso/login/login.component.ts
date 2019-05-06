import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authenticator } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  private authToken: string = ''

  constructor(private authenticator: Authenticator) { }

  ngAfterViewInit() {
    $('footer').addClass('fixed-bottom')
  }

  ngOnDestroy() {
    $('footer').removeClass('fixed-bottom')
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
