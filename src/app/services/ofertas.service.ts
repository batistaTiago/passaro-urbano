import { Oferta } from '../shared/oferta.model'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs'

import { map, retry } from 'rxjs/operators'

import * as firebase from 'firebase'

@Injectable()
export class OfertasService {

    constructor(
        private http: HttpClient) { }

    private ofertas: Array<Oferta> = []

    public getPageHeaders(categoria: string): Promise<Oferta[]> {

        return new Promise<any>(
            (resolve: any, reject: any) => {
                firebase.database().ref(`categorias/${categoria}`)
                    .once('value')
                    .then(
                        (snapshot: any) => {
                            resolve(snapshot.val())
                        }
                    )
            }
        )
    }

    public getOfertas(): Promise<Oferta[]> {

        return new Promise<any>(
            (resolve: any, reject: any) => {
                firebase.database().ref('ofertas')
                    .orderByKey()
                    .once('value')
                    .then(
                        (snapshot: any) => {
                            let ofertas: Array<any> = []
                            snapshot.forEach(
                                (childSnapshot) => {
                                    let oferta: any = childSnapshot.val()
                                    oferta.id = childSnapshot.key
                                    ofertas.push(oferta)
                                }
                            )

                            resolve(ofertas.reverse())
                            // console.log(ofertas)
                        }
                    )
            }
        )
    }

    public getOfertasPorCategoria(categoria: string): Promise<Oferta[]> {
        return new Promise<any>(
            (resolve: any, reject: any) => {
                firebase.database().ref('ofertas')
                    .orderByKey()
                    .once('value')
                    .then(
                        (snapshot: any) => {
                            let ofertas: Array<any> = []
                            snapshot.forEach(
                                (childSnapshot) => {
                                    let oferta: any = childSnapshot.val()
                                    if (oferta.categoria.toLowerCase() == categoria.toLowerCase()) {
                                        oferta.id = childSnapshot.key
                                        ofertas.push(oferta)
                                    } 
                                    // else {
                                    //     console.log(oferta.categoria.toLowerCase())
                                    //     console.log(categoria.toLowerCase())
                                    // }
                                }
                            )

                            resolve(ofertas.reverse())
                            // console.log(ofertas)
                        }
                    )
            }
        )
    }

    public getOfertaById(id: string): Promise<Oferta> {
        return new Promise<any>(
            (resolve: any, reject: any) => {
                firebase.database().ref('ofertas')
                    .orderByKey()
                    .once('value')
                    .then(
                        (snapshot: any) => {
                            snapshot.forEach(
                                (childSnapshot) => {
                                    let oferta: any = childSnapshot.val()
                                    oferta.id = childSnapshot.key
                                    if (oferta.id == id) {
                                        resolve(oferta)
                                    }
                                }
                            )
                        }
                    )
            }
        )
    }

    // public getComoUsarOfertaById(id: number): Promise<string> {
    //     return this.http.get(`${API_URL}/como-usar?id=${id}`)
    //         .toPromise()
    //         .then
    //         (
    //             (resposta: any) => {
    //                 console.log(resposta)
    //                 return resposta[0].descricao
    //             }
    //         )
    // }

    // public getOndeFicaOfertaById(id: number): Promise<string> {
    //     return this.http.get(`${API_URL}/onde-fica?id=${id}`)
    //         .toPromise()
    //         .then
    //         (
    //             (resposta: any) => {
    //                 return resposta[0].descricao
    //             }
    //         )
    // }

    public pesquisarOfertas(query: string): Observable<Oferta[]> {

        // http://localhost:3000/ofertas?descricao_oferta_like=pizza

        let response = this.http.get(`${API_URL}/ofertas?descricao_oferta_like=${query}`)
        return response.pipe(
            map(
                (resposta: Oferta[]) => {
                    return resposta
                }
            ),
            retry(10)
        )

    }

    private publicarImagens(oferta: Oferta, files: Array<File>): Promise<any>[] {

        let keyOferta = btoa(Date.now() + oferta.anunciante + oferta.categoria)

        let promises: any[] = []

        files.forEach(
            (file: File) => {
                let keyArquivo = btoa(file.name)
                console.log('uploading file: ' + file.name)
                let documentReference = firebase.storage().ref().child('images').child(keyOferta).child(keyArquivo)

                promises.push(documentReference.put(file))
            }
        )

        return promises

    }

    private getUrls(oferta: Oferta, files: Array<File>): Promise<string[]> {

        return new Promise<any>(
            (resolve, reject) => {
                Promise.all(
                    this.publicarImagens(oferta, files)
                ).then(
                    (resp) => {
                        let promises: Promise<string>[] = []
                        resp.reverse().forEach(
                            (r: any) => {
                                promises.push(firebase.storage()
                                    .ref(r.ref['location'].path)
                                    .getDownloadURL())
                            }
                        )
                        Promise.all(
                            promises
                        ).then(
                            (urls: string[]) => {
                                resolve(urls)
                            }
                        ).catch(
                            (erro: Error) => {
                                reject(erro)
                            }
                        )
                    }
                )
            }
        )
    }

    public cadastrarOferta(oferta: Oferta, files: File[]) {
        this.getUrls(oferta, files)
            .then(
                (response: any) => {
                    response.forEach(
                        imageUrl => {
                            let urlOject = {
                                url: imageUrl
                                // url: btoa(imageUrl)
                                // url: '1234'
                            }
                            oferta.imagens.push(urlOject)
                        }
                    )
                    delete oferta.id

                    firebase.database().ref(`ofertas/`).push(oferta).then(
                        () => {
                            console.log('concluido')
                        }
                    )

                    // console.log(oferta)

                    // const headers = new HttpHeaders()
                    // .set('Content-Type', 'application/json')

                    // console.log('enviando oferta para o back-end', oferta)

                    // this.http.post(
                    //     `${API_URL}/processar-cadastro-oferta`,
                    //     oferta,
                    //     { headers: headers }
                    // )
                    //     .toPromise()
                    //     .then(
                    //         (response: any) => {
                    //             console.log(response)
                    //         }
                    //     )
                    //     .catch(
                    //         (erro: Error) => {
                    //             console.log(erro)
                    //         }
                    //     )

                    /*
                    .pipe(
                        map(
                            (resposta: any) => {
                                console.log(resposta)
                                // return <number>resposta.id
                            }
                        )
                    )
                    */

                    // console.log(postResponse)
                }
            )
            .catch(
                (erro: Error) => {
                    console.log(erro)
                }
            )
    }

    // console.log(firebase.storage())


    // let headers = new HttpHeaders({
    //     'Content-Type':'application/json'
    // })


    // let postResponse = this.http.post(
    //     `${API_URL}/cadastrar-oferta`,
    //     JSON.stringify(oferta),
    //     { headers }
    //     ).pipe(
    //         map(
    //             (resposta: any) => {
    //               console.log(resposta, resposta)
    //               return <number>resposta.id
    //             }
    //         )
    //     )
    // return postResponse
}