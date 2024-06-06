import { Routes } from '@angular/router';
import { ExpensesComponent } from './expenses.component';
export const expensesRoutes: Routes = [
    {
        path: '',
        component:ExpensesComponent,
    },
    {
        path: '**',
        redirectTo: ''
    },

];
