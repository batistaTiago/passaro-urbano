import { Component, OnInit } from '@angular/core';

import { Endereco } from '../shared/endereco.model';
import { Pedido } from '../shared/pedido.model';
import { ItemCarrinho } from '../shared/item-carrinho.model';

import { OrdemCompraService } from '../services/ordem-compra.service';
import { CarrinhoService } from '../services/carrinho.service';
import { CepService } from '../services/cep.service';

import { Observable, Subject, of } from 'rxjs'
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'



@Component({
  selector: 'app-ordem-compra',
  templateUrl: './ordem-compra.component.html',
  styleUrls: ['./ordem-compra.component.css'],
  providers: [CepService, OrdemCompraService]
})
export class OrdemCompraComponent implements OnInit {

  public idPedidoCompra: number

  public itensCarrinho: ItemCarrinho[] = []

  public cep: string = ''
  public cidade: string = ''
  public bairro: string = ''
  public uf: string = ''
  
  public endereco: string = ''
  public numero: string = ''
  public complemento: string = ''
  public formaPagamento: string = ''
  
  private cepValido: boolean = false
  private enderecoValido: boolean = false
  private numeroValido: boolean = false
  private complementoValido: boolean
  private formaPagamentoValido: boolean = false
  
  private cepPrimitivo: boolean = true
  private enderecoPrimitivo: boolean = true
  private numeroPrimitivo: boolean = true
  private complementoPrimitivo: boolean = true
  private formaPagamentoPrimitivo: boolean = true
  
  private cepObserver: Observable<Endereco>
  private subjectCep: Subject<string> = new Subject<string>()
  
  private formasPagamento: string[] = ['dinheiro', 'credito', 'debito']
  
  constructor(
    private cepService: CepService, 
    private ordemCompraService: OrdemCompraService,
    public carrinhoService: CarrinhoService) { 

    }

  
  ngOnInit() {
    this.itensCarrinho = this.carrinhoService.getItems()
  }

  private startCepObserver() {
    this.cepObserver = this.subjectCep.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (value != '') {
          return this.cepService.getInfo(value)
        } else {
          this.cepValido = false
          this.limparInformacoesEndereco()
          return of<Endereco>()
        }
      }),
      catchError((erro: any) => {
        console.log(erro)
        return of<Endereco>(); 
      })
    )
  }

  private subscribeObserver() {
    this.cepObserver.subscribe(
      (endereco: Endereco) => {
        if (!(<any>endereco).erro) {
          this.cepValido = true
          this.cidade = endereco.localidade
          this.bairro = endereco.bairro
          this.uf = endereco.uf
          this.endereco = endereco.logradouro
        }
      }
    )
  }

  private getEndereco() {
    return new Endereco(
                this.cep,
                this.endereco,
                this.cidade,
                this.bairro,
                this.uf,
                this.numero,
                this.complemento
              )
  }
  
  private limparInformacoesEndereco() {
    this.cepValido = false
    this.cidade = ''
    this.bairro = ''
    this.uf = ''
    this.endereco = ''
  }
  
  public atualizarCep(cep: string) {
    this.cepPrimitivo = false
    if (!this.cepObserver) {
      this.startCepObserver()
      this.subscribeObserver()
    }
    if (cep.length == 8) {
      this.cep = cep
      this.subjectCep.next(cep)
    } else {
      this.subjectCep.next('')
    }
  }
  
  public atualizaNumero(numero: string) {
    this.numero = numero
    this.numeroValido = this.numero.length >= 1 ? true : false
    this.numeroPrimitivo = false
  }
  
  public atualizaComplemento(complemento: string) {
    this.complemento = complemento
    if (this.complemento.length >= 1) {
      this.complementoValido = true
    } else {
      this.complementoValido = null
    }
    this.complementoPrimitivo = false
  }
  
  public atualizaFormaPagamento(formaPagamento: string) {
    this.formaPagamento = formaPagamento
    this.formaPagamentoValido = this.formasPagamento.includes(this.formaPagamento)
    this.formaPagamentoPrimitivo = false
  }
  
  public formValido() {
    if (this.cepValido 
        && this.numeroValido 
        && this.formaPagamentoValido 
        && this.carrinhoService.getItems().length) {
      return ''
    } else {
      return 'disabled'
    }
  }

  public alterarQtdClickado(item: ItemCarrinho, add: boolean,  event: Event) {
    (<HTMLButtonElement>event.target).blur()
    this.carrinhoService.alterarQuantidade(item, add)
  }

  public confirmarCompra() {
    if (this.carrinhoService.getItems().length) {
      let endereco = this.getEndereco()
      let pedido = new Pedido(
        endereco, 
        this.formaPagamento,
        this.carrinhoService.getItems()
      )
      this.ordemCompraService
        .efetivarCompra(pedido)
        .subscribe(
          (idNovoPedido: number) => {

            this.idPedidoCompra = idNovoPedido

            this.carrinhoService.limparItens()
          }
        )
    } else {
      alert('nao eh possivel realizar um pedido sem itens')
    }
  }


  public debug() {
    console.log(this.carrinhoService.getItems().length == 0)
  }
}
