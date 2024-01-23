import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AppComponent } from './app.component';
import { HubComponent } from './pages/hub/hub.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'Welcome',
        title: 'FCT_Atmira - Welcome',
        component: WelcomeComponent
    },
    {
        path: 'Hub',
        title: 'FCT_Atmira - Projects',
        component: HubComponent,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'Hub',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'Hub'
    }
];
