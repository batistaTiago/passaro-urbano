import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../shared/usuario.model';
import { Authenticator } from 'src/app/services/auth.service';

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

  public submeterFormLogin(button: HTMLElement) {

    this.authenticator.autenticar('ekyidag@gmail.com', '123456')

    button.blur()
  }

}
