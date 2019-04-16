import { Component, OnInit } from '@angular/core';
import { OfertasService } from '../../services/ofertas.service';
import { Authenticator } from '../../services/auth.service';
import { Oferta } from '../../shared/oferta.model';

import { Observable, Subject, of } from 'rxjs'
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [OfertasService]
})
export class TopoComponent implements OnInit {

  public ofertasObs: Observable<Oferta[]>
  private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(
    private ofertasService: OfertasService,
    private authenticator: Authenticator) { 

  }

  ngOnInit() {
    this.ofertasObs = this.subjectPesquisa.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(
        (query: string) => {
          let parsedQuery = query.trim()
          if (query == '') {
            return of<Oferta[]>([]); 
          }
          return this.ofertasService.pesquisarOfertas(parsedQuery)
        }
      ),
      catchError( (erro: any) => {
        console.log(erro)
        return of<Oferta[]>([]); 
      })
    )
  }

  public usuarioLogado() {
    return this.authenticator.usuarioAutenticado()
  }

  public logout() {
    this.authenticator.logout()
  }

  public searchBarTextFieldKeyUp(searchQuery: string) {
    console.log('keyup char: ' + searchQuery)
    this.subjectPesquisa.next(searchQuery)
  }

  public clearObserverOfertas() {
    this.subjectPesquisa.next('')
  }

}
