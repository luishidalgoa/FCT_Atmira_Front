import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProjectSettingsComponent } from '../../Core/components/project-settings/project-settings.component';
import { Project } from '../../model/domain/project';
import { CurrentProjectService } from '../../shared/services/current-project.service';
import { ProjectSettingsModal } from '../../Core/modals/project-settings/project-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from '../../model/domain/expense';
import { ExpensesService } from './service/expenses.service';
import { TableComponent } from './components/table/table.component';
import { CreateNewExpenseComponent } from './modals/create-new-expense/create-new-expense.component';

@Component({
  selector: 'feature-expenses',
  standalone: true,
  imports: [RouterOutlet,ProjectSettingsComponent,TableComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit, OnDestroy {
  dataSource!: MatTableDataSource<Expense>;
  currentProject: Project | null = null;
  subscription!: Subscription
  Data: Expense[] = []

  constructor(private _currentProject: CurrentProjectService, private dialog: MatDialog, private route: ActivatedRoute, private _expenses: ExpensesService ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  ngOnInit(): void {
    //extraemos el parametro idProject de la url
    const projectId = this.route.snapshot.params['projectId'];
    this._currentProject.currentProjectId = projectId
    this.subscription = this._currentProject.getCurrentProject().subscribe((project: Project | null) => {
      this.currentProject = project

      if(this.currentProject) {
        const obj: Expense = new Expense()
        obj.project = {
          active: this.currentProject.active,
          endDate: this.currentProject.endDate,
          id_code: this.currentProject.id_code,
          name: this.currentProject.name,
          initialDate: this.currentProject.initialDate,
          typeOfService: this.currentProject.typeOfService,
        },
        
        this._expenses.filter(obj).subscribe((result: Expense[]) => {
          this.UpdateExpense(result)
        })
      }

    })
  }

  UpdateExpense(data: Expense[]) {
    this.Data = data;
    this.dataSource = new MatTableDataSource(this.Data);
  }

  openSettings(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(ProjectSettingsModal, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration,
      data: this.currentProject
    });
  }

  newExpense(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(CreateNewExpenseComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration,
      data: true
    });
    dialogRef.componentInstance.save.subscribe((data: Expense) => {
      if(data) this.pushData(data)
      
    })
  }

  pushData(data: Expense) {
    this.Data.push(data)
    this.dataSource = new MatTableDataSource(this.Data);
  }

  

}
