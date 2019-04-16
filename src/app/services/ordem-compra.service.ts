import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs'
import * as firebase from 'firebase'

import { map } from 'rxjs/operators'
import { Pedido } from '../shared/pedido.model';


@Injectable()
export class OrdemCompraService {

    constructor(private http: HttpClient) {

    }

    public efetivarCompra(pedido: Pedido): any {

        return new Promise<string>(
            (resolve, reject) => {
                firebase.database().ref('pedidos').push(pedido).then(
                    (snapshot: any) => {
                        resolve(snapshot.key)
                    }
                )
            }
        )

        // let headers = new HttpHeaders({
        //     'Content-Type':'application/json'
        // })


        // let postResponse = this.http.post(
        //     `${API_URL}/pedidos`,
        //     JSON.stringify(pedido),
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
}