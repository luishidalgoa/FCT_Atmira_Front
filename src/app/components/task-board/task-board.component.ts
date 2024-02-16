import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, Type, ViewChild, ViewChildren, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TypeOfService } from '../../model/enum/type-of-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../model/domain/task';
import { ProjectService } from '../../service/mockup/project.service';
import { ObjetiveService } from '../../service/objetive.service';
import { AuthService } from '../../service/mockup/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../../service/mockup/task.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, MatMenuModule,TaskComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent {
  @Input({required: true})
  value!: Task; // tarea padre
  @Output()
  deleteEvent: EventEmitter<Task> = new EventEmitter<Task>();
  tasks!: Task[]; //subtareas
  details: boolean = false;
  newT: boolean = false;
  TasksSelected: {parent_id: string | undefined;Tasks:Task[] | undefined} = {parent_id:undefined,Tasks:[]};

  formGroup: FormGroup;

  typeOfServiceValues = Object.values(TypeOfService);

  _project:ProjectService = inject(ProjectService);



  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder,private _auth: AuthService,private _task:TaskService) {
      
      this.formGroup = this._formBuilder.group({
        title: new FormControl(''),
        typeOfService: new FormControl('')
      });
      
      
   }

   router: ActivatedRoute = inject(ActivatedRoute);
   ngOnInit(): void {
    const id = this.router.snapshot.params['id'];
    this._task.getTasksById_Code(id).subscribe((data:Task[])=>{
      this.tasks = data;
    });
   }
   


  newTask(): void {
    alert("new task");
  }
  @ViewChild('form') form!: ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (!this.form) return;

    if (!this.form.nativeElement.contains(event.target)) {
      this.newT = false;
    }
  }
  
  delete(): void{
    this._task.delete(this.value).subscribe((result:boolean)=>{
      if(result){
        this.deleteEvent.emit(this.value);
      }
    });
  }

  selectTasksGroup(task:Task):void{
    if(this.TasksSelected.parent_id === task.id_code){
      this.TasksSelected = {parent_id:undefined,Tasks:[]};
    }else{
      //this.TasksSelected.parent_id = task.task != null ? task.task : task;

    }
  }
}
