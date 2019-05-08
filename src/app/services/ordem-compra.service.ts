import { Injectable } from '@angular/core';

import { Pedido } from '../shared/pedido.model';
import { Authenticator } from "./auth.service";

import * as firebase from 'firebase'


@Injectable()
export class OrdemCompraService {

    constructor(private authenticator: Authenticator) {

    }

    public efetivarCompra(pedido: Pedido): any {

        return new Promise<string>(
            (resolve, reject) => {
                let idPedido = null
                firebase.database()
                    .ref('pedidos')
                    .push(pedido)
                    .then(
                        (snapshot: any) => {
                            idPedido = snapshot.key
                        }
                    )
                    .then(
                        () => {
                            let promises: Promise<any>[] = []
                            for (let item of pedido.itens) {
                                promises.push(
                                    firebase.database().ref('/ofertas').child(item.id).once('value').then(
                                        (snapshot) => {
                                            let novoPedido = {
                                                'id': idPedido,
                                                'comprador': pedido.comprador,
                                                'endereco': pedido.endereco,
                                                'formaPagamento': pedido.formaPagamento,
                                                'item': item,
                                                'status': 'aguardandoConfirmacao'
                                            }
                                            firebase.database()
                                                .ref('usuarios')
                                                .child(snapshot.val().anunciante[1])
                                                .child('vendas')
                                                .push(novoPedido)
                                        }
                                    )
                                )
                            }

                            Promise.all(
                                promises
                            ).then(
                                () => {
                                    resolve(idPedido)
                                }
                            )
                        }
                    )

            }
        )

    }



    public getVendas(idAnunciante: string): Promise<Array<any>> {
        return new Promise(
            (resolve, reject) => {
                firebase.database().ref('/usuarios').child(idAnunciante).child('/vendas')
                    .once('value')
                    .then(
                        (snapshot) => {
                            let vendas = []
                            snapshot.forEach(
                                childSnapshot => {
                                    let venda = childSnapshot.val()
                                    venda.key = childSnapshot.key
                                    vendas.push(venda)
                                }
                            )
                            resolve(vendas)
                        }
                    )
            }
        )
    }

    public getVendasPendentes(idAnunciante: string): Promise<any[]> {
        return new Promise(
            (resolve, reject) => {
                this.getVendas(idAnunciante).then(
                    (vendas) => {
                        let vendasPendentes: any[] = []
                        vendas.forEach(
                            venda => {
                                if (venda.status == "aguardandoConfirmacao") {
                                    vendasPendentes.push(venda)
                                }
                            }
                        )
                        resolve(vendasPendentes)
                    }
                )
            }
        )

    }

    public aceitarVenda(idVenda: string): Promise<void> {
        return this.processarVenda(idVenda, true)
    }

    public rejeitarVenda(idVenda: string): Promise<void> {
        return this.processarVenda(idVenda, false)
    }

    private processarVenda(idVenda: string, aceitar: boolean): Promise<void> {
        let newStatus = 'aguardandoConfirmacao'
        if (aceitar === true) {
            newStatus = 'confirmado'
        } else if (aceitar === false) {
            newStatus = 'rejeitado'
        }
        return new Promise(
            (resolve, reject) => {
                firebase.database().ref('/usuarios')
                    .child(this.authenticator.getUserInfo()[1].id)
                    .child('vendas')
                    .child(idVenda)
                    .update({ 'status': newStatus })
                    .then(
                        () => {
                            resolve()
                        }
                    )
            }
        )
    }
}