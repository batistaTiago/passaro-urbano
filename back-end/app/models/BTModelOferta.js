function BTModelOferta() {

    this._connection = require('../../config/databaseConnection')()()
    
    this.getOfertas = (callback) => {
        this._connection.query('select * from tb_ofertas', callback)
    }

    this.getOferta = (callback) => {
        this._connection.query('select * from tb_ofertas where id = 1', callback)
    }

    this.cadastrarOferta = (oferta, callback) => {
        console.log(oferta)
        this._connection.query('insert into tb_ofertas set ?', oferta, callback)
    }
}

module.exports = function() {
    return BTModelOferta;
}