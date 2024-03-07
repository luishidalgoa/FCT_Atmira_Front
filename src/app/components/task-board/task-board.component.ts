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
import { UserDataWrapperService } from '../../service/user/user-data-wrapper.service';
import { WritableSignal } from '@angular/core';
import { NewTaskComponent } from '../modals/new-task/new-task.component';
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
  details: boolean = false; //indica si el menu de detalles esta abierto o cerrado
  newT: boolean = false; // indica si el formulario para crear una nueva tarea esta abierto u oculto
  TasksSelected: {parent_id: string | undefined;Tasks:Task[] | undefined} = {parent_id:undefined,Tasks:[]}; //array de subtareas seleccionadas

  formGroup: FormGroup;

  typeOfServiceValues = Object.values(TypeOfService);

  _project:ProjectService = inject(ProjectService);


  private router: Router = inject(Router);
  constructor(public _user_dataWrapper:UserDataWrapperService,public dialog: MatDialog, private _formBuilder: FormBuilder,private _auth: AuthService,private _task:TaskService) {
      
  this.formGroup = this._formBuilder.group({
    title: new FormControl('',[Validators.required]),
    objective: new FormControl('',[Validators.required]),
  })
      
      
  }

  routerActive: ActivatedRoute = inject(ActivatedRoute);
   /**
    * [BUG]
    */
  ngOnInit(): void {
    const id = this.routerActive.snapshot.params['id'];
    this._task.getTaskByProject(id).subscribe((data:Task[])=>{
      this.tasks = data;
    });
  }
   


  /**
   * crea una nueva tarea en base a los datos del formulario y la guarda en la base de datos a traves del servicio de TaskService
   * posteriormente la guarda en el array de tareas del componente para que se renderice en el html
   * @param event 
   */

 // Dentro del método newTask en TaskBoardComponent

 newTask(event: Event): void {
  event.preventDefault();
  this.newT = true; // Mostrar el formulario para crear una nueva tarea

  const task: Task = {
    description: this.formGroup.get('title')?.value,
    Asigned: this._auth.currentUser$(),
    closed: false,
    ID_Code_Project: this.value.project.id_code as string,
    task: null,
    project: this.value.project,
    objective: this.formGroup.get('objective')?.value
  };

  this._task.save(task).subscribe((data: Task) => {
    if (data) {
      // Verifica si la nueva tarea tiene una tarea padre
      if (data.task) {
        // Encuentra la tarea principal en el arreglo de tareas
        const mainTask = this.tasks.find(t => t.idCode === data.task?.idCode);
        if (mainTask) {
          // Agrega la subtarea a la tarea principal encontrada
          if (!mainTask.tasks) {
            mainTask.tasks = [];
          }
          mainTask.tasks.push(data);
        }
      } else {
        // Si no tiene tarea padre, agrega la tarea principal al arreglo de tareas
        this.tasks.push(data);
      }
    }
  });
  event.preventDefault();
}


  @ViewChild('form') form!: ElementRef;
  /**
   * cierra el formulario para crear una nueva tarea si el usuario hace click fuera de el
   * @param event 
   * @returns 
   */
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (!this.form) return;

    if (!this.form.nativeElement.contains(event.target)) {
      this.newT = false;
    }
  }
  
  /**
   * llama al metodo delete del servicio de TaskService para eliminar la tarea de la base de datos. posteriormente emite el evento deleteEvent
   * para que el componente padre elimine la tarea del array de tareas si la eliminacion en la bbdd ha sido exitosa
   */
  delete(): void{
    this._task.delete(this.value).subscribe((result:boolean)=>{
      if(result){
        this.deleteEvent.emit(this.value);
      }
    });
  }

  /**
   * selecciona las subtareas de la tarea seleccionada y las guarda en el array de subtareas seleccionadas
   * @param task 
   */
  selectTasksGroup(task:Task,):void{
    if(this.TasksSelected.parent_id === task.task?.idCode){
      if(this.TasksSelected.Tasks == undefined) this.TasksSelected.Tasks = [];
      this.TasksSelected.Tasks.push(task);
    }else{
      this.TasksSelected.parent_id = this.TasksSelected.parent_id == undefined ? task.task?.idCode: undefined;
    }
  }

  /**
   * elimina la subtarea de la tarea seleccionada y la elimina del array de subtareas seleccionadas
   * @param task 
   */
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
      }
    }
  }

   // Método para guardar los cambios al crear una nueva tarea
   saveSubTask(): void {
    // Evita que el formulario se envíe automáticamente
    const task: Task = {
      description: this.formGroup.get('title')?.value,
      closed: false,
      ID_Code_Project: this.value.project.id_code as string,

      task: null,

      task: this.value,

      project: this.value.project,
      objective: this.formGroup.get('objective')?.value
    };
    this._task.save(task).subscribe((data: Task) => {

      if (data) this.tasks.push(data);

      if (data) this.value.tasks?.push(data);

    });
    this.newT = false; // Oculta el formulario después de guardar la tarea
  }
}