import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Task } from '../../model/domain/task';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjetiveService } from '../../service/objetive.service';
import { TaskService } from '../../service/mockup/task.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule,MatSelect,MatOption,MatFormField,MatLabel,ReactiveFormsModule,MatMenuModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({required: true})
  value!: Task;
  @Input({required: true})
  index!: number;
  @Output()
  Checkbox: EventEmitter<Task> = new EventEmitter<Task>();
  @Output()
  delete: EventEmitter<Task> = new EventEmitter<Task>();

  selected!: string;

  constructor(public _objetive: ObjetiveService,private _router:Router){
    
  }

  ngOnInit(): void {
    this.selected = this.value.closed ? 'true' : 'false';
  }
  private _task:TaskService = inject(TaskService);
  status(status:boolean){
    this._task.status(this.value.idCode as string,status).subscribe((data:Task)=>{
      this.value = data;
      this.selected = data.closed ? 'true' : 'false';
    });
  }

  check(){
    this.Checkbox.emit(this.value);
  }

  deleteEvent(){
    this.delete.emit(this.value);
  }

  goToTask(){
    //imprimimos el :id de la ruta de navegacion
    this._router.navigateByUrl(`projects/project/${this.value.project.id_code}/task/${this.value.idCode}`);
  }
}
