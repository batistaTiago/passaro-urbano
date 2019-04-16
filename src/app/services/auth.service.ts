import * as firebase from 'firebase'
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Usuario } from '../shared/usuario.model';

@Injectable()
export class Authenticator {

    private authToken: string

    constructor(private router: Router) { }

    public getTokenId(): string {
        return this.authToken
    }

    public cadastrarUsuario(usuario: Usuario, senha: string) {
      firebase.auth().createUserWithEmailAndPassword(usuario.email, senha)
      .then(
        (response: any) => {
          console.log('resposta parcial', response)
          firebase.database().ref('usuarios').child(`${btoa(usuario.email)}`).set(usuario)
          .then(
            (response: any) => {
              this.router.navigate(['/admin/login'])
            }
          )
          .catch(
            (erro: Error) => {
              console.log(erro)
            }
          )
        }
      )
    }

    public autenticar(email: string, senha: string) {
        firebase.auth().signInWithEmailAndPassword(email, senha)
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
    }

    public usuarioAutenticado(): boolean {

      const storedToken = localStorage.getItem('userToken')

      if (this.authToken === undefined && storedToken !== null) {
        this.authToken = storedToken
      }

      if (this.authToken === undefined) {
        this.router.navigate(['/admin/login'])
      }

      return this.authToken !== undefined

    }

    public logout() {
      firebase.auth().signOut().then(
        (result: any) => {
          console.log(result)
          localStorage.removeItem('userToken')
          this.authToken = undefined
          this.router.navigate(['/admin/login'])
        }
      )
    }
}