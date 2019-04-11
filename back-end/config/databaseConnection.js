let mysql = require('mysql')

let wrapper = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bt_passaro_urbano'
    })
}

module.exports = () => {
    return wrapper
}
