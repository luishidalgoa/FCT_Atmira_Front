import { Routes } from '@angular/router';
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
                path: 'projects/project/:id',
                loadComponent: ()=> import('../task/project-view-all/project-view-all.component').then(m=>m.ProjectViewAllComponent),
                data: { breadcrumb: 'Task Dash', parent:{breadcrumb: 'Project Dash',url:'/projects'} },
            },
            {
                path: 'projects/project/:id/task/:taskId',
                loadComponent: ()=> import('../task/task-view-all/task-view-all.component').then(m=>m.TaskViewAllComponent),
                data: { breadcrumb: 'Task', parent:{breadcrumb: 'Project Dash',url:'/projects'} },
            }
        ]
    },
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    }
];
