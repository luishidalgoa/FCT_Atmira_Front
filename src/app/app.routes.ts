import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './guards/auth.guard';
import { hubRoutes } from './pages/hub/hub.routes';

export const routes: Routes = [
    {
        path: 'Welcome',
        title: 'FCT_Atmira - Welcome',
        component: WelcomeComponent
    },
    {
        path: '',
        title: 'FCT_Atmira - Projects',
       // loadComponent: () => import('./pages/hub/hub.component').then(m => m.HubComponent),
        loadChildren: () => import('./pages/hub/hub.routes').then(mod => mod.hubRoutes),
        canActivate: [authGuard],
        data: {breadcrumb: {skip: true}}
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',

    },
    {
        path: '**',
        redirectTo: 'Welcome'
    }
];
