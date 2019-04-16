import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import { Authenticator } from './auth.service'

@Injectable()
export class UnloggedAuthGuard implements CanActivate {

    constructor(
        private authenticator: Authenticator,
        private router: Router) { }

    public canActivate(): boolean {
        const r = !this.authenticator.usuarioAutenticado()

        if (!r) {
            this.router.navigate(['/'])
        }
        
        return r
    }

}