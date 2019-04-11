module.exports.cadastrarNovaOferta = (app, req, res) => {
    res.render('inserir view de cadastro de oferta')
}

module.exports.processarCadastroOferta = (app, req, res) => {
    let formData = req.body

    // req.assert('nome', 'Nome obrigatório').notEmpty()
    // req.assert('anunciante', 'Anunciante obrigatório').notEmpty()
    // req.assert('descricao', 'Descricao obrigatório').notEmpty()
    // req.assert('preco', 'Preco obrigatório').len(10,100)

    // let erros = req.validationErrors()

    // if (erros) {
    //     res.render('admin/form_add_noticia')
    //     return
    // }
    
    let callback = (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.redirect('/ofertas')
        }
        
    }

    let ofertaModel = new app.app.models.BTModelOferta()

    // res.send(formData)

    ofertaModel.cadastrarOferta(formData, callback)
}