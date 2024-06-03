import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Language } from '../../../model/enum/language';
import { AuthService } from '../../../service/user/auth.service';
import { WorkPlace } from '../../../model/domain/work-place';
import { DepartmentService } from '../../../service/common/Department/department.service';
import { WorkplaceService } from '../../../service/common/Workplace/workplace.service';
import { Departament } from '../../../model/domain/departament';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  form: FormGroup;
  languages = Object.values(Language);
  
  constructor(
    public dialogRef: MatDialogRef<ConfigurationComponent>,
    private fb: FormBuilder,
    private _authService: AuthService,
    @Inject(DepartmentService) private _departmentService: DepartmentService,
    @Inject(WorkplaceService) private _workplaceService: WorkplaceService,
  ) {
    this.form = this.fb.group({
      workPlace: [''],
      department: ['']
    });
  }
  ngOnInit() {
    const savedWorkPlace = this._workplaceService.getWorkPlace();
    const savedDepartment = this._departmentService.getDepartment();

    if (savedWorkPlace) {
      this.form.get('workPlace')?.setValue(savedWorkPlace.Code);
    }

    if (savedDepartment) {
      this.form.get('department')?.setValue(savedDepartment.Code);
    }
  }
  saveWorkplace() {
    const workPlace: WorkPlace = {
      Code: this.form.get('workPlace')?.value,
      ID_id: 0
    };
    this._workplaceService.setWorkPlace(workPlace);
    this._workplaceService.guardarTrabajo(workPlace).subscribe((data: WorkPlace) => {
      console.log('Workplace saved:', data);
    });
  }

  saveDepartment() {
    const department: Departament = {
      Code: this.form.get('department')?.value,
      ID_id: 0
    };
    this._departmentService.setDepartment(department);
    this._departmentService.save(department).subscribe((data: Departament) => {
      console.log('Department saved:', data);
    });
  }
} 
