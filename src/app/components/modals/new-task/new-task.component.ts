import { CommonModule } from '@angular/common';
import { Component, Inject, Input, inject, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { Task } from '../../../model/domain/task';
import { Project } from '../../../model/domain/project';
import { TaskService } from '../../../service/common/Task/task.service';
import { title } from 'process';
import { AuthService } from '../../../service/mockup/auth.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule,MatSelect,MatOption],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {
  form: FormGroup;
  typeOfServiceValues = Object.values(TypeOfService);
  @Input({required:true})
  parent!: Task | Project;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task | Project,public dialogRef: MatDialogRef<NewTaskComponent>,private _formBuilder: FormBuilder,private _task:TaskService){
    this.parent = data;
    this.form = this._formBuilder.group({
      title: new FormControl('',[Validators.required]),
      objective: new FormControl('',[Validators.required]),
    })
  }

  private _auth:AuthService = inject(AuthService);
  create():void {
    const isProject = (this.parent as Project)
    const task: Task = {
      description: this.form.get('objective')?.value,
      Asigned: this._auth.currentUser$(),
      closed: false,
      ID_Code_Project: isProject ? (this.parent as Project).id_code as number : (this.parent as Task).ID_Code_Project,
      task: !isProject ? (this.parent as Task).id_code as string : null,
      Project: isProject ? (this.parent as Project) : (this.parent as Task).Project,
      objective: this.form.get('title')?.value
    };
  
    this._task.save(task).subscribe((data:Task)=>{
      console.log(data);
      if(data && this.parent.tasks){
        this.dialogRef.close();
      }
    });
  }
  
}
