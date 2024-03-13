import { CommonModule } from '@angular/common';
import { Component, Inject, Input, inject } from '@angular/core';
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
import { AuthService } from '../../../service/user/auth.service';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';

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
  value!: Task | Project;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task | Project,public dialogRef: MatDialogRef<NewTaskComponent>,private _formBuilder: FormBuilder,private _task:TaskService){
    this.value = data;
    this.form = this._formBuilder.group({
      title: new FormControl('',[Validators.required]),
      objective: new FormControl('',[Validators.required]),
    })
  }

  private _auth:AuthService = inject(AuthService);
  private _userDataWrapper:UserDataWrapperService = inject(UserDataWrapperService);
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
        if(this.value.tasks == undefined) this.value.tasks = [];
        this.value.tasks.push(data);
        this._userDataWrapper.setCurrentItem(this.value)
        this.dialogRef.close();
      }
    });
  }
  
}
