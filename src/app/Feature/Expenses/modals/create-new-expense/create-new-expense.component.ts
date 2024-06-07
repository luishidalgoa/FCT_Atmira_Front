import { Component, EventEmitter, Inject, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../../../model/domain/project';
import { CurrentProjectService } from '../../../../shared/services/current-project.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { typeExpense } from '../../../../model/enum/typeExpense';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { Expense } from '../../../../model/domain/expense';
import { AuthService } from '../../../../Login/services/auth.service';
import { ExpensesService } from '../../service/expenses.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'feature-expenses-create-new-expense',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-new-expense.component.html',
  styleUrl: './create-new-expense.component.scss'
})
export class CreateNewExpenseComponent implements OnInit, OnDestroy {
  private _snackBar: MatSnackBar = inject(MatSnackBar);


  public form!: FormGroup;
  typeExpenses = Object.values(typeExpense);
  @Input() public project: boolean = false; // para saber si hay que asignarle proyecto de forma automatica o manual
  @Output() save: EventEmitter<Expense | null> = new EventEmitter<Expense | null>(); // evento para enviar el expense recien creado
  maxDate: Date = new Date();

  projectsByColaborator: Project[] = [];

  subscription!: Subscription

  constructor(@Inject(MAT_DIALOG_DATA) public data:boolean,private _expense: ExpensesService, private _auth: AuthService, private dialogRef: MatDialogRef<CreateNewExpenseComponent>, public _currentProject: CurrentProjectService, private fb: FormBuilder) { 
    this.project = data
  }

  ngOnInit(): void {
    // controles: Descripción, importe, Fecha del gasto, tipo de gasto, proyecto
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      count: [0, [Validators.required]],
      ticketDate: ['', [Validators.required]],
      type: ['', [Validators.required]],
      project: [this.project ? this._currentProject.currentProjectId: null, [Validators.required]]
    })

    this.subscription = this._currentProject.repository.subscribe(() => {
      if (!this._currentProject.repositoryValue) return
      this.projectsByColaborator = this._currentProject.repositoryValue;
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.close()
  }
  close() {
    this.dialogRef.close();
  }

  mapping(): Promise<Expense> {
    return new Promise((resolve) => {
      const expense: Expense = {
        state: null,
        colaborator: this._auth.currentUser$(),
        description: this.form.get('description')?.value,
        cost: this.form.get('count')?.value,
        ticketDate: this.form.get('ticketDate')?.value,
        typeExpensive: this.form.get('type')?.value,
        project: undefined,
      }
      this._currentProject.getProjectById(this.form.get('project')?.value).then((project: Project | null) => {
        if (project) expense.project = project
      })
      resolve(expense)
    })
  }

  saveExpense() {
    this.mapping().then((expense: Expense) => {
      this._expense.updateExpensesState(expense).subscribe((data: Expense) => {
        if (data) {
          this.save.emit(data)
          this.openSnackBar('Expense created successfully', 'app-notification-success');
        } else {
          this.save.emit(null)
          this.openSnackBar('Error creating expense', 'app-notification-error');
        }
      })
    })
    this.close()
  }

  openSnackBar(message: string, status: 'app-notification-success' | 'app-notification-error') {
    this._snackBar.open(message, 'Hidden', {
      duration: 2500,
      panelClass: status
    });
  }
}
