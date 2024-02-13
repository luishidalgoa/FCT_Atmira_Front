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
                data: { breadcrumb: { alias: 'project:id' } }
            },
            {
                path: 'projects/:id',
                loadComponent: ()=> import('../task/task-view-all/task-view-all.component').then(m=>m.TaskViewAllComponent),
                data: { breadcrumb: { alias: 'task:id' } }
            },
            {
                path: 'login',
                component: LoginComponent,
                data: { breadcrumb: { alias: 'task' } }
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
