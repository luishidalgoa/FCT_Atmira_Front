import { Routes } from '@angular/router';
import { ViewAllComponent} from '../project/view-all/view-all.component';
import {TaskViewAllComponent} from '../task/task-view-all/task-view-all.component';
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
                loadComponent: ()=> import('../task/task-view-all/task-view-all.component').then(m=>m.TaskViewAllComponent),
                data: { breadcrumb: 'Tasks', parent:{breadcrumb: 'Project Dash',url:'/projects'} }
            }
        ]
    }
    ,
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    }
];
