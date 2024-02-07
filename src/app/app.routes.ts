import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './guards/auth.guard';
import { hubRoutes } from './pages/hub/hub.routes';

export const routes: Routes = [
    {
        path: 'Welcome',
        title: 'FCT_Atmira - Welcome',
        component: WelcomeComponent,
        canActivate: [authGuard]
    },
    {
        path: '',
        title: 'FCT_Atmira - Projects',
        loadComponent: () => import('./pages/hub/hub.component').then(m => m.HubComponent),
        canActivate: [authGuard],
        children: hubRoutes,
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
