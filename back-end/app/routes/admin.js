module.exports = (app) => {

    app.get('/cadastrar-nova-oferta', function(req,res) {
        app.app.controllers.admin.cadastrarNovaOferta(app, req, res)
    })

    app.post('/processar-cadastro-oferta', function(req,res) {
        app.app.controllers.admin.processarCadastroOferta(app, req, res)
    })
    
}