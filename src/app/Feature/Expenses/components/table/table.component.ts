import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Expense } from '../../../../model/domain/expense';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ExpensesService } from '../../service/expenses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'feature-expenses-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule,DatePipe,TitleCasePipe,CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input()
  dataSource!: MatTableDataSource<Expense>;
  @Input()
  Data!: Expense[]
  @Input()
  displayedColumns: string[] = ['estado', 'colaborador', 'descripcion', 'coste', 'fechaCreacion','tipoGasto', 'reintegro'];

  constructor(private _expenses: ExpensesService,private _router:Router){}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.Data)
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

  navigateToProject(expense: Expense) {
    this._router.navigateByUrl(`/projects/project/${expense.project!.id_code}`)
  }
}
