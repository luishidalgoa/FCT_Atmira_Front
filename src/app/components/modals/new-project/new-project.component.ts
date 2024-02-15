import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../service/common/Project/project.service';
import { Project } from '../../../model/domain/project';
import { CommonModule } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { AuthService } from '../../../service/user/auth.service';

@Component({
  selector: 'app-new-project',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule,MatSelect,MatOption],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  form: FormGroup;
  typeOfServiceValues = Object.values(TypeOfService);

  minDate: Date;
  constructor(public dialogRef: MatDialogRef<NewProjectComponent>,private _ProjectS:ProjectService, private _formBuilder: FormBuilder) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, 0, new Date().getDate());

    this.form = this._formBuilder.group({
      title: new FormControl('',Validators.maxLength(20)),
      initialDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      typeOfService: new FormControl('',Validators.required),
    })
  }

  private _user_dataWrapper: UserDataWrapperService = inject(UserDataWrapperService);
  private _authService: AuthService = inject(AuthService);
  create(){
    if(this.form.valid){
      const project:Project = {
        name: this.form.get('title')?.value,
        initialDate: this.form.get('initialDate')?.value,
        endDate: this.form.get('endDate')?.value,
        typeOfService: this.form.get('typeOfService')?.value,
        active: true 
      }
      this._ProjectS.save(project,this._authService.currentUser$().ID_Alias).subscribe((data:Project)=>{
        this._user_dataWrapper.addProject(data);
      });
      this.dialogRef.close();
    }else{
      
    }
  }

  close(){
    this.dialogRef.close();
  }
}