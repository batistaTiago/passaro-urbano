import { Endereco } from "./endereco.model";
import { ItemCarrinho } from "./item-carrinho.model";

export class Pedido {

    public id: number

    constructor(
        public endereco: Endereco,
        public formaPagamento: string,
        public itens: ItemCarrinho[]
    ) { }
}