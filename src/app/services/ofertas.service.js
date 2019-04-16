"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var app_constants_1 = require("./app.constants");
var operators_1 = require("rxjs/operators");
var OfertasService = /** @class */ (function () {
    function OfertasService(http) {
        this.http = http;
        this.ofertas = [];
    }
    OfertasService.prototype.getOfertas = function () {
        return this.http.get(app_constants_1.API_URL + "/ofertas")
            .toPromise()
            .then(function (resposta) {
            return resposta;
        });
    };
    OfertasService.prototype.getOfertasPorCategoria = function (categoria) {
        return this.http.get(app_constants_1.API_URL + "/ofertas?categoria=" + categoria)
            .toPromise()
            .then(function (resposta) {
            return resposta;
        });
    };
    OfertasService.prototype.getOfertaById = function (id) {
        return this.http.get(app_constants_1.API_URL + "/ofertas?id=" + id)
            .toPromise()
            .then(function (ofertas) {
            return ofertas[0];
        });
    };
    OfertasService.prototype.getComoUsarOfertaById = function (id) {
        return this.http.get(app_constants_1.API_URL + "/como-usar?id=" + id)
            .toPromise()
            .then(function (resposta) {
            console.log(resposta);
            return resposta[0].descricao;
        });
    };
    OfertasService.prototype.getOndeFicaOfertaById = function (id) {
        return this.http.get(app_constants_1.API_URL + "/onde-fica?id=" + id)
            .toPromise()
            .then(function (resposta) {
            console.log(resposta);
            return resposta[0].descricao;
        });
    };
    OfertasService.prototype.pesquisarOfertas = function (query) {
        // http://localhost:3000/ofertas?descricao_oferta_like=pizza
        var response = this.http.get(app_constants_1.API_URL + "/ofertas?descricao_oferta_like=" + query);
        return response.pipe(operators_1.map(function (resposta) {
            return resposta;
        }), operators_1.retry(10));
    };
    OfertasService = __decorate([
        core_1.Injectable()
    ], OfertasService);
    return OfertasService;
}());
exports.OfertasService = OfertasService;
