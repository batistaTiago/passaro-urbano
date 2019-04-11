import { Oferta } from '../shared/oferta.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs'

import { map, retry } from 'rxjs/operators'
import { Pedido } from '../shared/pedido.model';


@Injectable()
export class OrdemCompraService {

    constructor(private http: HttpClient) {
        
    }

    public efetivarCompra(pedido: Pedido): Observable<number> {
        
        console.log('efetuando requisicao')

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