import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

import { map, retry } from 'rxjs/operators'
import { Endereco } from '../shared/endereco.model';

@Injectable()
export class CepService {
    
    constructor(private http: HttpClient) { }

    private buildApiUrl(cep: string): string {
        return 'http://viacep.com.br/ws/' + cep +'/json/unicode/'
    }

    public getInfo(cep: string): Observable<Endereco> {
        let response = this.http.get(this.buildApiUrl(cep))
        return response.pipe(
            map(
                (resposta: Endereco) => {
                    return resposta
                }
            ),
            retry(10)
        )
    }

}