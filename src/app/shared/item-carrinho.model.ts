export class ItemCarrinho {

    constructor(
        public id: string,
        public imagem: object,
        public titulo: string,
        public descricao: string,
        public preco: number,
        public quantidade: number
    ) {}

}