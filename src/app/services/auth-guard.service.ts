import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { Authenticator } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authenticator: Authenticator) { }

    public canActivate(): boolean {
        return this.authenticator.usuarioAutenticado()
    }

}