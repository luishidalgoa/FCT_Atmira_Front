import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../model/domain/task';
import { ProjectService } from '../../services/Project/project.service';
import { AuthService } from '../../../Login/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../../services/Task/task.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { UpdateTaskComponent } from '../../modals/update-task/update-task.component';
import { ConfirmComponent } from '../../../shared/modals/confirm/confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentProjectService } from '../../../shared/services/current-project.service';
@Component({
  selector: 'core-task-board',
  standalone: true,
  imports: [CommonModule, MatMenuModule, TaskComponent, ReactiveFormsModule, MatSelect, MatOption],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent implements OnInit{
  @Input({ required: true })
  value!: Task; // tarea padre
  @Output()
  deleteEvent: EventEmitter<Task> = new EventEmitter<Task>();
  details: boolean = false; //indica si el menu de detalles esta abierto o cerrado
  newT: boolean = false; // indica si el formulario para crear una nueva tarea esta abierto u oculto
  TasksSelected: { parent_id: string | undefined; Tasks: Task[] | undefined } = { parent_id: undefined, Tasks: [] }; //array de subtareas seleccionadas

  formGroup: FormGroup;

  typeOfServiceValues = Object.values(TypeOfService);

  _project: ProjectService = inject(ProjectService);


  private router: Router = inject(Router);
  constructor(public _currentProject: CurrentProjectService, public dialog: MatDialog, private _formBuilder: FormBuilder, private _auth: AuthService) {

    this.formGroup = this._formBuilder.group({
      title: new FormControl('', [Validators.required]),
      objective: new FormControl('', [Validators.required]),
    })

  }

  routerActive: ActivatedRoute = inject(ActivatedRoute);
  /**
   * [BUG]
   */
  ngOnInit(): void {
    this._currentProject.getSubtasksByTask(this.value).then((data: Task) => {
      this.value=data
    })


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

  update():void {
    this.dialog.open(UpdateTaskComponent, {
      width: 'auto',
      enterAnimationDuration: '300ms',
      maxWidth: '60rem',
      exitAnimationDuration: '300ms',
      data: this.value
    });
  }
  /**
   * llama al metodo delete del servicio de TaskService para eliminar la tarea de la base de datos. posteriormente emite el evento deleteEvent
   * para que el componente padre elimine la tarea del array de tareas si la eliminacion en la bbdd ha sido exitosa
   */
  delete(): void {
    const dialog =this.dialog.open(ConfirmComponent, {
      width: 'auto',
      maxWidth: '60rem',
      ariaLabel: 'Are you sure ?',
      role: 'alertdialog',
      ariaDescribedBy: 'Are you sure that you want to delete this task ?'
    })
    dialog.afterClosed().subscribe((result:boolean) =>{
      if(result){
        this.deleteEvent.emit(this.value);
      }
    })
  }

  /**
   * selecciona las subtareas de la tarea seleccionada y las guarda en el array de subtareas seleccionadas
   * @param task 
   */
  selectTasksGroup(task: Task): void {
    if (this.TasksSelected.parent_id === task.task?.idCode) {
      if (this.TasksSelected.Tasks == undefined) this.TasksSelected.Tasks = [];
      this.TasksSelected.Tasks.push(task);
    } else {
      this.TasksSelected.parent_id = this.TasksSelected.parent_id == undefined ? task.task?.idCode : undefined;
    }
  }

  /**
   * elimina la subtarea de la tarea seleccionada y la elimina del array de subtareas seleccionadas
   * @param task 
   */
  deleteSubTask(task: Task): void {
    //buscamos la tarea que contenga el mismo id que el campo parent de la tarea que queremos eliminar
    const result: Task = this.value.tasks?.find((t: Task) => t.task?.idCode === task.task?.idCode) as Task;
    result.tasks = result.tasks?.filter((t: Task) => t.idCode !== task.idCode);

    if (this.TasksSelected.Tasks && this.TasksSelected.Tasks?.length > 0) {
      for (let task2 of this.TasksSelected.Tasks) {
        let result: Task = this.value.tasks?.find((t: Task) => t.task?.idCode === task2.task?.idCode) as Task; //buscamos la tarea padre
        result.tasks = result.tasks?.filter((t: Task) => t.idCode !== task2.idCode); //eliminamos la tarea
        //reescribimos la tarea padre por result
        this.value.tasks = this.value.tasks?.map((t: Task) => t.idCode === result.idCode ? result : t);
      }
    }else{
      this.value.tasks = this.value.tasks?.filter((t: Task) => t.idCode !== task.idCode);
    }
  }

  
   // Método para guardar los cambios al crear una nueva tarea
   saveSubTask(): void {
    // Evita que el formulario se envíe automáticamente
    const task: Task = {
      description: this.formGroup.get('title')?.value,
      closed: false,
      task: this.value,
      project: this.value.project,
      objective: this.formGroup.get('objective')?.value,
      colaborator: this._auth.currentUser$(),
    };
    this._currentProject.saveTask(task).then((data: Task | null) => {
      if (data) this.value = data;
    });
    this.newT = false; // Oculta el formulario después de guardar la tarea
  }


  /**
   * Indicara la notificacion de si la tarea se ha creado con exito o no
   * @param message 
   * @param action 
   */
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  openSnackBar(message: string, status: 'app-notification-success' | 'app-notification-error') {
    this._snackBar.open(message,'Hidden', {
      duration: 2500,
      panelClass: status
    });
  }

  _router: Router = inject(Router);
  navigate(){
    if(this.routerActive.snapshot.routeConfig?.path?.includes('task')){
      this.router.navigateByUrl(`projects/project/${this.value.project.id_code}/task/${this.value.idCode}`);
    }else{
      this.router.navigate(['task', this.value.idCode], {relativeTo: this.routerActive})
    }
  }
}