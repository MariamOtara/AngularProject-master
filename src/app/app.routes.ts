import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home)},
    {path: 'menue',
    loadComponent: () => import('./menue/menue').then(m => m.MenueComponent)},
    {path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)},
    {path: 'signin',
    loadComponent: () => import('./signin/signin').then(m => m.Signin)},
    {path: 'cart',
    loadComponent: () => import('./cart/cart').then(m => m.Cart),
    canActivate:[authGuard]
    },
    {path: 'details',
    loadComponent: () => import('./details/details').then(m => m.Details)},
    {path:'profile',
     loadComponent: () => import('./profile/profile').then(m => m.Profile),
     canActivate:[authGuard]
    },
    {path:'verifyemail',
     loadComponent: () => import('./verifyemail/verifyemail').then(m => m.Verifyemail),
     },
     {path:'resetpassword',
     loadComponent: () => import('./resetpassword/resetpassword').then(m => m.Resetpassword),
     },

    {path: '**',
    loadComponent: () => import('./error/error').then(m => m.Error)},
];
