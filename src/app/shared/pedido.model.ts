import { Endereco } from "./endereco.model";
import { ItemCarrinho } from "./item-carrinho.model";
import { Usuario } from "./usuario.model";

export class Pedido {

    public id: number

    constructor(
        public endereco: Endereco,
        public formaPagamento: string,
        public itens: ItemCarrinho[],
        public comprador: Usuario,
        public valorTotal: number
    ) { }
}