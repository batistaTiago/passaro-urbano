import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import { Authenticator } from './auth.service'

@Injectable()
export class VendorAuthGuard implements CanActivate {

    constructor(
        private authenticator: Authenticator,
        private router: Router) { }

    public canActivate(): boolean {
        const userInfo = this.authenticator.getUserInfo()
        
        const canAccess = 
        userInfo[0] !== undefined && 
        userInfo[0] !== null && 
        userInfo[1] !== undefined && 
        userInfo[1] !== null

        if (!canAccess) {
            this.router.navigate(['/'])
        }

        return canAccess
    }

}