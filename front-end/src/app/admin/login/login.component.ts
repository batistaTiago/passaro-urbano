import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { Usuario } from '../../shared/usuario.model';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private authToken: string = ''

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public submeterFormLogin(button: HTMLElement) {

    let usuario = new Usuario(
      'ekyidag@gmail.com',
      '123456',
      true
    )

    firebase.auth().signInWithEmailAndPassword(usuario.email, usuario.senha)
      .then(
        (resposta: any) => {
          firebase.auth().currentUser.getIdToken()
            .then(
              (idToken: string) => {
                this.authToken = idToken
                localStorage.setItem('userToken', this.authToken)
                this.router.navigate(['/'])
              }
            )
        }
      ).catch(
        (error: Error) => {
          console.log(error)
        }
      )

    button.blur()
  }

}
