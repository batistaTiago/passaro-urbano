export class Oferta {

    constructor(
        public categoria: string = '',
        public titulo: string = '',
        public descricao: string = '',
        public anunciante: [string, string] = ['', ''],
        public preco: number = -1,
        public destaque: boolean = false,
        public imagens: Array<object> = [],
        public id: string = '',
        public storageKey: string = null,
        public storageFileKeys: string[] = []) {

    }

    private setStorageKey() {
       this.storageKey = btoa(Date.now() + this.anunciante[0] + this.categoria)
    }

    public getStorageKey() {
        if (this.storageKey == null || this.storageKey == undefined) {
            this.setStorageKey()
        }
        return this.storageKey
    }
}