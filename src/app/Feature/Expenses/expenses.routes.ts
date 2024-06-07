import { Routes } from '@angular/router';
import { ViewAllComponent } from './pages/view-all/view-all.component';
export const expensesRoutes: Routes = [
    {
        path: '',
        component: ViewAllComponent,
    },
    {
        path: '**',
        redirectTo: ''
    },

];
