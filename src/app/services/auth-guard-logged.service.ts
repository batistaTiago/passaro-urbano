// import { Injectable } from '@angular/core'
// import { Router, CanActivate } from '@angular/router'
// import { Authenticator } from './auth.service'

// @Injectable()
// export class LoggedAuthGuard implements CanActivate {

//     constructor(
//         private authenticator: Authenticator,
//         private router: Router) { }

//     public canActivate(): boolean {
//         const r = this.authenticator.usuarioAutenticado()
//         console.log('usuario logado? ' + r)

//         if (!r) {
//             this.router.navigate(['/'])
//         }
        
//         return r
//     }

// }