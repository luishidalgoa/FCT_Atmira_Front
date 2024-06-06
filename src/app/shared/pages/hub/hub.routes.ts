import { Routes } from '@angular/router';
import { HubComponent } from './hub.component';
export const hubRoutes: Routes = [
    {
        path: '',
        component:HubComponent,
        children: [
            {
                path: 'projects',
                loadComponent: ()=> import('../../../Core/pages/view-all/view-all.component').then(m=>m.ViewAllComponent),
                data: { breadcrumb: 'Home' }
            },
            {
                path: 'projects/project/:projectId',
                loadComponent: ()=> import('../../../Core/pages/project/project-view-all/project-view-all.component').then(m=>m.ProjectViewAllComponent),
                data: { breadcrumb: 'Task Dash', parent:{breadcrumb: 'Home',url:'/projects'} },
                
            },
            {
                path: 'projects/project/:projectId/expenses',
                loadChildren: () => import('../../../Feature/Expenses/expenses.routes').then(mod => mod.expensesRoutes),
            },
            {
                path: 'projects/project/:projectId/task/:taskId',
                loadComponent: ()=> import('../../../Core/pages/task/task-view-all/task-view-all.component').then(m=>m.TaskViewAllComponent),
                data: { breadcrumb: 'Task', parent:{breadcrumb: 'Home',url:'/projects'} },
            },
            {
                path: '',
                redirectTo: 'projects',
                pathMatch: 'full'
            }
        ]
    }
];
