import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { Task } from '../../../model/domain/task';
import { Project } from '../../../model/domain/project';
import { TaskService } from '../../services/Task/task.service';
import { AuthService } from '../../../Login/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CurrentProjectService } from '../../../shared/services/current-project.service';

@Component({
  selector: 'core-new-task',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule,MatSelect,MatOption],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {
  form: FormGroup;
  typeOfServiceValues = Object.values(TypeOfService);
  @Input({required:true})
  value!: Task | Project;
  @Output() save = new EventEmitter<boolean>(); // evento para enviar el estado de la creacion de la tarea
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task | Project,public dialogRef: MatDialogRef<NewTaskComponent>,private _formBuilder: FormBuilder,private _task:TaskService){
    this.value = data;
    this.form = this._formBuilder.group({
      title: new FormControl('',[Validators.required]),
      objective: new FormControl('',[Validators.required]),
    })
  }

  private _auth:AuthService = inject(AuthService);
  private _currentProject:CurrentProjectService = inject(CurrentProjectService);
  create():void {
    const task: Task = {
      description: this.form.get('title')?.value,
      colaborator: this._auth.currentUser$(),
      closed: false,
      task: (this.value as Task).description ? (this.value as Task) : null,
      project: (this.value as Task).project!== undefined ? (this.value as Task).project : this.value as Project,
      objective: this.form.get('objective')?.value
    };
  
    this._task.save(task).subscribe((data:Task)=>{
      if(data){
        this._currentProject.task = data // automaticamente el BehaviorSubject de projects se actualiza
        this.openSnackBar('Task created successfully','app-notification-success');
      }else{
        this.openSnackBar('Error creating task','app-notification-error');
      }
      this.saveTask(false);
    });
    this.saveTask(true);
    this.dialogRef.close();
  }
  
  /**
   * Creamos un evento el cual indica si se esta procesando la creacion de la tarea. enviara una notificacion de que se esta procesando
   * de este modo podran saber el componente padre si se esta creando y cuando se ha creado finalmente
   * @param status 
   */
  saveTask(status:boolean):void{
    this.save.emit(status);
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
}
