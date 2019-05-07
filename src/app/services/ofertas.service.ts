import { Oferta } from '../shared/oferta.model'
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class OfertasService {

    constructor() { }

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

    public pesquisarOfertas(query: string): Promise<Oferta[]> {

        return new Promise<Oferta[]>(
            (resolve, reject) => {
                firebase.database()
                    .ref('/ofertas')
                    .orderByKey()
                    .on('value',
                        (snapshot: any) => {
                            let ofertas: Oferta[] = []
                            snapshot.forEach(
                                childSnapshot => {
                                    if (childSnapshot.val().descricao.includes(query)) {
                                        let oferta = childSnapshot.val()
                                        oferta.id = childSnapshot.key
                                        ofertas.push(oferta)
                                    }
                                }
                            )

                            // console.log(ofertas)
                            resolve(ofertas)
                        }
                    )
            }
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
                                (response) => {
                                    oferta.id = response.key
                                    firebase.database()
                                        .ref('/usuarios')
                                        .child(oferta.anunciante[1])
                                        .child('/ofertas')
                                        .once('value')
                                        .then(
                                            (ofertas) => {
                                                let result: string[] = []
                                                for (let attribute in ofertas.val()) {
                                                    result.push(ofertas.val()[attribute])
                                                }
                                                result.push(oferta.id)

                                                firebase.database()
                                                    .ref('/usuarios')
                                                    .child(oferta.anunciante[1])
                                                    .child('/ofertas')
                                                    .set(result)
                                                    .then(
                                                        () => {
                                                            resolve(oferta)
                                                        }
                                                    )

                                            }
                                        )
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

    private removerOfertaDaListaDeOfertas(oferta: Oferta): Promise<any> {
        return firebase.database()
            .ref('/ofertas')
            .child(oferta.id)
            .remove().then(
                () => {
                    firebase.database()
                        .ref('/ofertas')
                        .child(oferta.id)
                        .remove()
                }
            )
    }

    private removerOfertaDoPerfilDoUsuario(oferta: Oferta): Promise<any> {
        return firebase.database()
            .ref('/usuarios')
            .child(oferta.anunciante[1])
            .child('/ofertas')
            .once('value')
            .then(
                (snapshot) => {
                    snapshot.forEach(
                        (childSnapshot) => {
                            if (childSnapshot.val() === oferta.id) {
                                firebase.database()
                                    .ref('/usuarios')
                                    .child(oferta.anunciante[1])
                                    .child('/ofertas')
                                    .child(childSnapshot.key)
                                    .remove()
                            }
                        }
                    )
                }
            )
    }

    public removerOferta(oferta: Oferta) {
        console.log('removendo imagens')
        this.removerImagensOferta(oferta).then(
            () => {
                console.log('removendo da lista de ofertas do usuario')
                this.removerOfertaDoPerfilDoUsuario(oferta).then(
                    () => {
                        console.log('removendo da lista de ofertas')
                        this.removerOfertaDaListaDeOfertas(oferta)
                    }
                )
            }
        )
    }
}