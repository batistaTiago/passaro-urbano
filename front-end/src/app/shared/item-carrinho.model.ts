export class ItemCarrinho {

    constructor(
        public id: number,
        public imagem: object,
        public titulo: string,
        public descricao: string,
        public valor: number,
        public quantidade: number
    ) {}

}