import { Oferta } from '../shared/oferta.model'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs'

import { map, retry } from 'rxjs/operators'

@Injectable()
export class OfertasService {
    
    constructor(private http: HttpClient) { }
    
    private ofertas: Array<Oferta> = []

    public getPageHeaders(categoria: string): Promise<Oferta[]> {
        return this.http.get(`${API_URL}/categorias?categoria=${categoria}`)
        .toPromise()
        .then
        (
            (resposta: any) => {
                return resposta
            }
        )
    }
    
    public getOfertas(): Promise<Oferta[]> {
        return this.http.get(`${API_URL}/ofertas`)
        .toPromise()
        .then
        (
            (resposta: Oferta[]) => {
                return resposta
            }
        )
    }

    public getOfertasEmDestaque(): Promise<Oferta[]> {
        return this.http.get(`${API_URL}/ofertas?destaque=${true}`)
        .toPromise()
        .then(
            (ofertasEmDestaque: Oferta[]) => {
                return ofertasEmDestaque
            }
        )
    }
        
    public getOfertasPorCategoria(categoria: string): Promise<Oferta[]> {
        return this.http.get(`${API_URL}/ofertas?categoria=${categoria}`)
        .toPromise()
        .then
        (
            (resposta: Oferta[]) => {
                return resposta
            }
        )
    }
    
    public getOfertaById(id: number): Promise<Oferta> {
        return this.http.get(`${API_URL}/ofertas?id=${id}`)
        .toPromise()
        .then(
            (ofertas: Array<Oferta>) => {
                return ofertas[0]
            } 
        )
    }
    
    public getComoUsarOfertaById(id: number): Promise<string> {
        return this.http.get(`${API_URL}/como-usar?id=${id}`)
        .toPromise()
        .then
        (
            (resposta: any) => {
                console.log(resposta)
                return resposta[0].descricao
            }
        )
    }
        
    public getOndeFicaOfertaById(id: number): Promise<string> {
        return this.http.get(`${API_URL}/onde-fica?id=${id}`)
        .toPromise()
        .then
        (
            (resposta: any) => {
                return resposta[0].descricao
            }
        )
    }

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
}