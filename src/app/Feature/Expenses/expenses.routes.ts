import { Routes } from '@angular/router';
import { ExpensesComponent } from './expenses.component';
export const expensesRoutes: Routes = [
    {
        path: '',
        component:ExpensesComponent,
        children: [
            {
                path: '',
                loadComponent: ()=> import('./components/expenses-form/expenses-form.component').then(m=>m.ExpensesFormComponent),
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    },

];
