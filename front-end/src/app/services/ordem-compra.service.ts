import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs'

import { map } from 'rxjs/operators'
import { Pedido } from '../shared/pedido.model';


@Injectable()
export class OrdemCompraService {

    constructor(private http: HttpClient) {
        
    }

    public efetivarCompra(pedido: Pedido): Observable<number> {

        let headers = new HttpHeaders({
            'Content-Type':'application/json'
        })


        let postRequest = this.http.post(
            `${API_URL}/pedidos`,
            JSON.stringify(pedido),
            { headers }
            ).pipe(
                map(
                    (resposta: any) => {
                      console.log(resposta, resposta)
                      return <number>resposta.id
                    }
                )
            )
        return postRequest
    }
}