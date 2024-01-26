import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../service/common/Project/project.service';
import { Project } from '../../../model/domain/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-project',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  form: FormGroup;

  minDate: Date;
  maxDate: Date;
  constructor(public dialogRef: MatDialogRef<NewProjectComponent>,private _ProjectS:ProjectService, private _formBuilder: FormBuilder) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.form = this._formBuilder.group({
      title: new FormControl('',Validators.maxLength(20)),
      initialDate: new FormControl('',Validators.required),
      finalDate: new FormControl('',Validators.required),
      typeOfService: new FormControl('',Validators.required),
    })
  }

  create(){
    if(this.form.valid){
      const project:Project = {
        name: this.form.get('title')?.value,
        initialDate: this.form.get('initialDate')?.value,
        endDate: this.form.get('finalDate')?.value,
        typeOfService: 'IT',
        colaboratorProjects: [],
        active: true
      }
      this._ProjectS.save(project).subscribe((data:Project)=>{
        console.log(data)
      });
      this.dialogRef.close();
    }else{
      console.log("NO SE PUEDE",this.form)
    }
  }
}
