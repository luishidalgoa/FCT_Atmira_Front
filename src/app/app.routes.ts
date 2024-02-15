import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AppComponent } from './app.component';
import { HubComponent } from './pages/hub/hub.component';
import { authGuard } from './guards/auth.guard';
import { ProjectDashboardComponent } from './components/project-dashboard/project-dashboard.component';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { ViewAllComponent } from './pages/project/view-all/view-all.component';

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
        component: HubComponent,
        canActivate: [authGuard],
        children: [
            {
              path: 'projects',
              component: ViewAllComponent
            },
            {
              path: 'projects/:id',
              component: TaskBoardComponent
            },
            {
                path: '',
                redirectTo: 'projects',
                pathMatch: 'full'
            }
          ],
    },
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',

    }/*,
    {
        path: '**',
        redirectTo: 'Welcome'
    }*/
];
