module.exports.getOfertas = (app, req, res) => {
    let callback = (error, result) => {
        res.send(result)
    }

    let ofertaModel = new app.app.models.BTModelOferta()
    ofertaModel.getOfertas(callback)

}

module.exports.getOferta = (app, req, res) => {
    //app.app (parametro.diretorio.diretorio...)
    let ofertaModel = new app.app.models.BTModelOferta()

    let callback = (error, result) => {
        res.send(result)
    }

    ofertaModel.getOferta(callback)
}