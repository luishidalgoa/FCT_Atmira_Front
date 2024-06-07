import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { ExpensesService } from '../../service/expenses.service';
import { Subscription } from 'rxjs';
import { Expense } from '../../../../model/domain/expense';
import { AuthService } from '../../../../Login/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss'
})
export class ViewAllComponent implements OnInit, OnDestroy{
  subscription!:Subscription;
  dataSource!: MatTableDataSource<Expense>;
  Data: Expense[] = []

  constructor(private _expenses: ExpensesService,private _auth: AuthService) { }
  ngOnInit(): void {
    const obj: Expense = new Expense()
    obj.colaborator = this._auth.currentUser$()
    this.subscription = this._expenses.filter(obj).subscribe((result: Expense[]) => {
      this.Data = result;
      this.dataSource = new MatTableDataSource(this.Data);
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
}
