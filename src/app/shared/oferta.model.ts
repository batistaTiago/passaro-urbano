export class Oferta {

    constructor(
        public categoria: string = '',
        public titulo: string = '',
        public descricao: string = '',
        public anunciante: string = '',
        public preco: number = -1,
        public destaque: boolean = false,
        public imagens: Array<object> = [],
        public id: number = -1) {

    }
}