import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProjectSettingsComponent } from '../../Core/components/project-settings/project-settings.component';
import { Project } from '../../model/domain/project';
import { CurrentProjectService } from '../../shared/services/current-project.service';
import { ProjectSettingsModal } from '../../Core/modals/project-settings/project-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Expense } from '../../model/domain/expense';
import { ExpensesService } from './service/expenses.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterOutlet,ProjectSettingsComponent,MatTableModule, MatSortModule, MatPaginatorModule,DatePipe,TitleCasePipe,CurrencyPipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['estado', 'colaborador', 'descripcion', 'coste', 'fechaCreacion', 'reintegro'];
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
          this.Data = result;
          console.log(this.Data)
          this.dataSource = new MatTableDataSource(this.Data);
        })
      }

    })
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

  updateExpensesState(expense: Expense) {
    this._expenses.updateExpensesState(expense).subscribe(() => {
      this.Data = this.Data.map((exp: Expense) => {
        if(exp.ticketId === expense.ticketId) {
          return expense
        }
        return exp
      })

      this.dataSource = new MatTableDataSource(this.Data)
    })
  }

}
