import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, Type, ViewChild, ViewChildren, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TypeOfService } from '../../model/enum/type-of-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../model/domain/task';
import { ProjectService } from '../../service/common/Project/project.service';
import { AuthService } from '../../service/user/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../../service/common/Task/task.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, MatMenuModule,TaskComponent,ReactiveFormsModule,MatSelect,MatOption],
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
      title: new FormControl('',[Validators.required]),
      objective: new FormControl('',[Validators.required]),
    })
      
      
   }

   router: ActivatedRoute = inject(ActivatedRoute);
   ngOnInit(): void {
      const id = this.router.snapshot.params['id'];
      this._task.getTaskByProject(id).subscribe((data:Task[])=>{
        console.log('DATA',this.value,data)
        this.tasks = data;
      });
   }
   


  newTask(event:any): void {

    const task: Task = {
      description: this.formGroup.get('title')?.value,
      Asigned: this._auth.currentUser$(),
      closed: false,
      ID_Code_Project: this.value.project.id_code as number,
      task: null,
      project: this.value.project,
      objective: this.formGroup.get('objective')?.value
    };
    console.log('TASK',task)
    this._task.save(task).subscribe((data:Task)=>{
      if(data)this.tasks.push(data)
    })
    event.preventDefault()
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

  selectTasksGroup(task:Task,):void{
    if(this.TasksSelected.parent_id === task.task?.idCode){
      if(this.TasksSelected.Tasks == undefined) this.TasksSelected.Tasks = [];
      this.TasksSelected.Tasks.push(task);
    }else{
      this.TasksSelected.parent_id = this.TasksSelected.parent_id == undefined ? task.task?.idCode: undefined;
    }
    console.log(this.TasksSelected)
  }

  deleteSubTask(task:Task):void{
    //buscamos la tarea que contenga el mismo id que el campo parent de la tarea que queremos eliminar
    const result:Task = this.tasks.find((t:Task)=>t.task?.idCode === task.task?.idCode) as Task;
    result.tasks = result.tasks?.filter((t:Task)=>t.idCode !== task.idCode);

    if(this.TasksSelected.Tasks && this.TasksSelected.Tasks?.length > 0){
      for(let task2 of this.TasksSelected.Tasks){
        let result:Task = this.tasks.find((t:Task)=>t.task?.idCode === task2.task?.idCode) as Task; //buscamos la tarea padre
        result.tasks = result.tasks?.filter((t:Task)=>t.idCode !== task2.idCode); //eliminamos la tarea
        //reescribimos la tarea padre por result
        this.tasks = this.tasks.map((t:Task)=>t.idCode === result.idCode ? result : t);

        console.log('ELIMINADO',this.tasks);
      }
    }
  }
}
