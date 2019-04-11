module.exports = (app) => {

    app.get('/ofertas', function (req, res) {
        app.app.controllers.ofertas.getOfertas(app, req, res)
    })

    app.get('/oferta', function (req, res) {
        app.app.controllers.ofertas.getOferta(app, req, res)
    })

}