import * as firebase from 'firebase'
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Usuario } from '../shared/usuario.model';

@Injectable()
export class Authenticator {

  private authToken: string
  private userIsVendor: boolean
  private userName: string

  constructor(private router: Router) { }

  private getTokenId(): string {
    const storedToken = localStorage.getItem('userToken')

    if (this.authToken === undefined && storedToken !== null) {
      this.authToken = storedToken
    }

    return this.authToken
  }

  private getUserIsVendor(): boolean {
    const storedToken = localStorage.getItem('userIsVendor')

    if (this.userIsVendor === undefined && storedToken !== null) {
      this.userIsVendor = storedToken === "true" ? true : false
    }
    return this.userIsVendor
  }

  private getUserName(): string {
    const storedToken = localStorage.getItem('userName')

    if (this.userName === undefined && storedToken !== null) {
      this.userName = storedToken
    }
    return this.userName
  }

  public getUserInfo(): [string, boolean, string] {
    return [this.getTokenId(), this.getUserIsVendor(), this.getUserName()]
  }

  public cadastrarUsuario(usuario: Usuario, senha: string) {
    firebase.auth().createUserWithEmailAndPassword(usuario.email, senha)
      .then(
        (response: any) => {
          console.log('resposta parcial', response)
          firebase.database().ref('usuarios').child(`${btoa(usuario.email)}`).set(usuario)
            .then(
              (response: any) => {
                this.router.navigate(['/login'])
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

  public autenticar(email: string, senha: string): Promise<boolean> {

    return new Promise<boolean>(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, senha)
          .then(
            () => {
              firebase.auth().currentUser.getIdToken()
                .then(
                  (idToken: string) => {
                    firebase.database()
                      .ref(`/usuarios/`)
                      .child(`${btoa(email)}`)
                      .once('value')
                      .then(
                        (snapshot: any) => {
                          console.log(snapshot.val())
                          this.authToken = idToken
                          this.userIsVendor = snapshot.val().isVendor
                          this.userName = snapshot.val().nome
                          localStorage.setItem('userToken', this.authToken)
                          localStorage.setItem('userIsVendor', this.userIsVendor ? "true" : "false")
                          localStorage.setItem('userName', this.userName)
                          resolve(true)
                          this.router.navigate(['/'])
                        }
                      )
                      .catch(
                        (error: Error) => {
                          console.log(error)
                          resolve(false)
                        }
                      )
                  }
                )
                .catch(
                  (error: Error) => {
                    console.log(error)
                    resolve(false)
                  }
                )
            }
          ).catch(
            (error: Error) => {
              console.log(error)
              reject(false)
            }
          )
      }
    )

    // return new Promise<boolean>(
    //   (resolve, reject) => {
    //     firebase.auth().signInWithEmailAndPassword(email, senha)
    //       .then(
    //         () => {
    //           Promise.all(
    //             [
    //               firebase.auth().currentUser.getIdToken(),
    //               firebase.database().ref(`/usuarios/`).child(`${btoa(email)}`).once('value')
    //             ]
    //           )
    //             .then(
    //               (snapshot: any) => {
    //                 console.log(snapshot)
    //                 this.authToken = snapshot[1]
    //                 this.userIsVendor = snapshot[2].val().isVendor
    //                 localStorage.setItem('userToken', this.authToken)
    //                 localStorage.setItem('userIsVendor', this.userIsVendor.toString())
    //                 resolve(true)
    //                 this.router.navigate(['/'])
    //               }
    //             )
    //             .catch(
    //               (error: Error) => {
    //                 console.log(error)
    //                 reject(false)
    //               }
    //             )
    //         }
    //       )
    //   }
    // )
  }

  public usuarioAutenticado(): boolean {
    return this.getTokenId() !== undefined
  }

  public logout(shouldRedirect: boolean = false) {
    firebase.auth().signOut().then(
      (result: any) => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userIsVendor')
        localStorage.removeItem('userName')
        localStorage.removeItem('itensCarrinho')
        this.authToken = undefined
        if (shouldRedirect) {
          this.router.navigate(['/login'])
        }
      }
    )
  }
}