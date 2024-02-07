import { Routes } from '@angular/router';
import { ViewAllComponent } from '../project/view-all/view-all.component';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';

export const hubRoutes: Routes = [
    {
        path: 'projects',
        component: ViewAllComponent,
        children: [
            
        ]
    },
    {
        path: 'projects/:id',
        loadComponent: () => import('../../pages/task/view-all/view-all.component').then(m => m.ViewAllComponent),
        data: {breadcrumb: {alias: 'task:id'}}
    },
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    }
];
