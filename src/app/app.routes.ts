import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './guards/auth.guard';
import { welcomeGuard } from './guards/welcome.guard';

export const routes: Routes = [
    {
        path: 'Welcome',
        title: 'FCT_Atmira - Welcome',
        component: WelcomeComponent,
        canActivate: [welcomeGuard]
    },
    {
        path: '',
        title: 'FCT_Atmira - Projects',
       // loadComponent: () => import('./pages/hub/hub.component').then(m => m.HubComponent),
        loadChildren: () => import('./pages/hub/hub.routes').then(mod => mod.hubRoutes),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',

    },
    {
        path: '**',
        redirectTo: 'Welcome'
    }
];
