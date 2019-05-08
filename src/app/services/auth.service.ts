import * as firebase from 'firebase'
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Usuario } from '../shared/usuario.model';

@Injectable()
export class Authenticator {

  private __authToken: string
  private __usuario: Usuario

  constructor(private router: Router) { }

  private getTokenId(): string {
    const storedToken = localStorage.getItem('userToken')

    if (this.__authToken === undefined && storedToken !== null) {
      this.__authToken = storedToken
    }

    return this.__authToken
  }

  private getUserObject(): Usuario {
    const storedToken = localStorage.getItem('userInfo')

    if (this.__usuario === undefined && storedToken !== null) {
      this.__usuario = JSON.parse(storedToken)
    }

    return this.__usuario
  }

  public getUserInfo(): [string, Usuario] {
    return [this.getTokenId(), this.getUserObject()]
  }

  public cadastrarUsuario(usuario: Usuario, senha: string) {
    return firebase.auth().createUserWithEmailAndPassword(usuario.email, senha)
      .then(
        (response: any) => {
          console.log('resposta parcial', response)
          firebase.database().ref('usuarios').child(`${btoa(usuario.email)}`).set(usuario)
            .then(
              (response: any) => {
                this.router.navigate(['/login'])
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
                          this.__authToken = idToken
                          this.__usuario = snapshot.val()
                          this.__usuario.id = snapshot.key
                          localStorage.setItem('userToken', idToken)
                          localStorage.setItem('userInfo', JSON.stringify(this.__usuario))
                          resolve(true)
                          this.router.navigate(['/'])
                        }
                      )
                      .catch(
                        (error: Error) => {
                          console.log(error)
                          localStorage.removeItem('userToken')
                          localStorage.removeItem('userInfo')
                          resolve(false)
                        }
                      )
                  }
                )
                .catch(
                  (error: Error) => {
                    console.log(error)
                    localStorage.removeItem('userToken')
                    localStorage.removeItem('userInfo')
                    resolve(false)
                  }
                )
            }
          ).catch(
            (error: Error) => {
              console.log(error)
              localStorage.removeItem('userToken')
              localStorage.removeItem('userInfo')
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
        localStorage.removeItem('userInfo')
        localStorage.removeItem('itensCarrinho')
        this.__authToken = undefined
        this.__usuario = undefined
        if (shouldRedirect) {
          this.router.navigate(['/login'])
        }
      }
    )
  }
}