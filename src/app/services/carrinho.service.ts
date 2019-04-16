import { ItemCarrinho } from "../shared/item-carrinho.model";
import { Oferta } from "../shared/oferta.model";
import { Authenticator } from "../services/auth.service";

import { Injectable } from '@angular/core'

@Injectable()
export class CarrinhoService {

    constructor(private authenticator: Authenticator) { }

    private itens: Array<ItemCarrinho> = []

    public getItems() {
        
        if (this.itens.length == 0) {
            const itensCarrinhoLocalStorage = localStorage.getItem('itensCarrinho')
            if (itensCarrinhoLocalStorage != null && itensCarrinhoLocalStorage != undefined) {
                this.itens = JSON.parse(itensCarrinhoLocalStorage)
            }
        }

        return this.itens
    }

    public limparItens() {
        this.itens = []
    }

    public incluirItem(oferta: Oferta) {
        if (this.authenticator.usuarioAutenticado()) {
            let itemCarrinho: ItemCarrinho = new ItemCarrinho(
                oferta.id,
                oferta.imagens[0],
                oferta.titulo,
                oferta.descricao,
                oferta.preco,
                1
            )
    
            for (let item of this.itens) {
                if (item.id == itemCarrinho.id) {
                    item.quantidade += 1
                    return
                }
            }
    
            this.itens.push(itemCarrinho)

            localStorage.setItem('itensCarrinho', JSON.stringify(this.itens))
        }
    }

    public alterarQuantidade(itemAlvo: ItemCarrinho, add: boolean) {
        for (let item of this.itens) {
            if (item.id == itemAlvo.id) {
                if (add) {
                    item.quantidade += 1
                } else {
                    if (item.quantidade > 0) {
                        item.quantidade -= 1
                    } else {

                        // TODO: mostrar alerta para perguntar se 
                        //       o usuario realmente quer remover o item do carrinho
                        
                        let index = this.itens.indexOf(itemAlvo)
                        if (index != -1 && confirm("Deseja realmente remover este item do carrinho?")) {
                            this.itens.splice(index, 1)
                        }
                    }
                }
                return
            }
        }
    }

    public getValorTotal(): number {
        let total: number = 0
        for (let item of this.itens) {
            total += item.preco * item.quantidade
        }
        return total
    }
}