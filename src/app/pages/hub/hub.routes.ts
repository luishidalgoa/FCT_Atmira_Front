import { Routes } from '@angular/router';
import { ViewAllComponent} from '../project/view-all/view-all.component';
import {ProjectViewAllComponent} from '../task/project-view-all/project-view-all.component';
import { LoginComponent } from '../../components/modals/login/login.component';
import { HubComponent } from './hub.component';

export const hubRoutes: Routes = [
    {
        path: '',
        component:HubComponent,
        children: [
            {
                path: 'projects',
                loadComponent: ()=> import('../project/view-all/view-all.component').then(m=>m.ViewAllComponent),
                data: { breadcrumb: 'Project Dash' }
            },
            {
                path: 'projects/:id',
                loadComponent: ()=> import('../task/project-view-all/project-view-all.component').then(m=>m.ProjectViewAllComponent),
                data: { breadcrumb: 'Task Dash', parent:{breadcrumb: 'Project Dash',url:'/projects'} }
            }
        ]
    }
    ,
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'projects'
    }
];
