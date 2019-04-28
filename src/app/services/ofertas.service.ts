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

    private uploadImagesToFirebase(oferta: Oferta, files: Array<File>): Promise<any>[] {

        let promises: any[] = []

        if (oferta.storageKey === null || oferta.storageKey === undefined || oferta.storageKey === '') {
            oferta.storageKey = btoa(Date.now() + oferta.anunciante[0] + oferta.titulo)
        }

        let key = oferta.storageKey

        // console.log(key)

        oferta.storageFileKeys = []

        files.forEach(
            (file: File) => {
                let keyArquivo = btoa(file.name)

                oferta.storageFileKeys.push(keyArquivo)
                promises.push(firebase.storage().ref().child('images').child(key).child(keyArquivo).put(file))
            }
        )

        if (oferta.id) {
            firebase.database().ref('ofertas').child(oferta.id).child('storageFileKeys').set(oferta.storageFileKeys)
        }

        return promises

    }

    private publicarImagens(oferta: Oferta, files: Array<File>): Promise<string[]> {

        return new Promise<any>(
            (resolve, reject) => {
                Promise.all(
                    this.uploadImagesToFirebase(oferta, files)
                ).then(
                    (resp) => {
                        let promises: Promise<string>[] = []
                        resp.forEach(
                            (r: any) => {
                                // console.log(r.name)
                                promises.push(firebase.storage().ref(r.ref['location'].path).getDownloadURL())
                            }
                        )
                        Promise.all(
                            promises
                        )
                            .then(
                                (urls: string[]) => {
                                    resolve(urls)
                                }
                            )
                        // .catch(
                        //     (erro: Error) => {
                        //         reject(erro)
                        //     }
                        // )
                    }
                )
            }
        )
    }

    public cadastrarOferta(oferta: Oferta, files: File[]): Promise<any> {

        return new Promise<Oferta>(
            (resolve, reject) => {
                this.publicarImagens(oferta, files)
                    .then(
                        (imageUrls: string[]) => {
                            imageUrls.forEach(
                                imageUrl => {
                                    // console.log(imageUrl)
                                    let urlOject = {
                                        url: imageUrl
                                    }
                                    oferta.imagens.push(urlOject)
                                }
                            )
                            delete oferta.id

                            firebase.database().ref(`ofertas/`).push(oferta).then(
                                (response: any) => {
                                    oferta.id = response.key
                                    resolve(oferta)
                                }
                            )
                        }
                    )
                // .catch(
                //     (erro: Error) => {
                //         console.log(erro)
                //     }
                // )
            }
        )
    }

    public removerImagensOferta(oferta: Oferta): Promise<any> {

        let promises: Promise<any>[] = []

        //deleta arquivos de imagem da oferta
        if (oferta.storageFileKeys) {
            for (let fileKey of oferta.storageFileKeys) {
                // console.log('deletando arquivo: ' + oferta.storageKey + '/' + fileKey)
                promises.push(firebase.storage().ref('images').child(oferta.storageKey).child(fileKey).delete())
                promises.push(firebase.database().ref('ofertas').child(oferta.id).child('storageFileKeys').remove())
                promises.push(firebase.database().ref('ofertas').child(oferta.id).child('imagens').remove())
            }
        } else {
            console.log("STORAGE FILE KEYS NÃO CONFIGURADO")
        }

        return new Promise<any>(
            (resolve, reject) => {
                Promise.all(
                    promises
                )
                    .then(
                        () => {
                            resolve()
                        }
                    )
                    .catch(
                        () => {
                            reject()
                        }
                    )
            }
        )
    }

    public atualizarImagensOferta(oferta: Oferta, imagens: File[]): Promise<any> {


        return this.removerImagensOferta(oferta)
            .then(
                () => {
                    this.publicarImagens(oferta, imagens)
                        .then(
                            (response: string[]) => {

                                // resposta -> array com urls de download

                                let urls = []
                                response.forEach(
                                    (url: string) => {
                                        let urlObject = {
                                            url: url
                                        }
                                        urls.push(urlObject)
                                    }
                                )

                                firebase.database()
                                    .ref('/ofertas')
                                    .child(oferta.id)
                                    .child('imagens')
                                    .set(urls)
                                // .then(
                                //     () => {
                                //         console.log('final da atualização')
                                //         console.log(oferta)
                                //     }
                                // )

                            }
                        )
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