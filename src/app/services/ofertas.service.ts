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

    public getOfertasPorAnunciante(anunciante: string) {
        return new Promise<Oferta[]>(
            (resolve: any, reject: any) => {
                firebase.database().ref('ofertas')
                    .orderByKey()
                    .once('value')
                    .then(
                        (snapshot: any) => {
                            let results: Oferta[] = []
                            snapshot.forEach(
                                (element: any) => {
                                    let oferta = element.val()
                                    oferta.id = element.key
                                    if (oferta.anunciante[1] === anunciante) {
                                        results.push(oferta)
                                    }
                                }
                            )
                            resolve(results)
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

    private uploadImagesToFirebase(keyOferta: string, files: Array<File>): Promise<any>[] {

        let promises: any[] = []

        files.forEach(
            (file: File) => {
                let keyArquivo = btoa(file.name)
                let documentReference = firebase.storage()
                                            .ref()
                                            .child('images')
                                            .child(keyOferta)
                                            .child(keyArquivo)

                promises.push(documentReference.put(file))
            }
        )

        return promises

    }

    private publicarImagens(key: string, files: Array<File>): Promise<string[]> {

        return new Promise<any>(
            (resolve, reject) => {
                Promise.all(
                    this.uploadImagesToFirebase(key, files)
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

        this.publicarImagens(oferta.getStorageKey(), files)
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
                }
            )
            .catch(
                (erro: Error) => {
                    console.log(erro)
                }
            )
    }

    public atualizarImagensOferta(oferta: Oferta, imagens: File[]): Promise<any> {

        return this.publicarImagens(oferta.storageKey, imagens)
            .then(
                (response: string[]) => {
                    // let urls = oferta.imagens
                    let urls = []
                    response.forEach(
                        (url: string) => {
                            let urlObject = {
                                url: url
                            }
                            urls.push(urlObject)
                        }
                    )
                    console.log('atualizando urls de imagem da oferta ' + oferta.id + ' para:', urls)
                    firebase.database()
                        .ref('/ofertas')
                        .child(oferta.id)
                        .child('imagens')
                        .set(urls)
                }
            )
    }

    public atualizarOferta(oferta: Oferta) {
        return firebase.database()
            .ref('/ofertas')
            .child(oferta.id)
            .set(oferta)
            .then(
                (response: any) => {
                    console.log('sucesso')
                }
            )
            .catch(
                (erro: Error) => {
                    console.log('erro', erro)
                }
            )
    }
}