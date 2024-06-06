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
import { WorkPlace } from '../../../model/domain/work-place';
import { Departament } from '../../../model/domain/departament';
import { DepartmentService } from '../../../Feature/WorkPlace/service/departament.service';
import { AuthService } from '../../../Login/services/auth.service';
import { WorkplaceService } from '../../../Feature/WorkPlace/service/workplace.service';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  form!: FormGroup;
  languages = Object.values(Language);
  
  constructor(
    public dialogRef: MatDialogRef<ConfigurationComponent>,
    private fb: FormBuilder,
    private _authService: AuthService,
    @Inject(DepartmentService) private _departmentService: DepartmentService,
    @Inject(WorkplaceService) private _workplaceService: WorkplaceService,
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      language: [''],
      workPlace: [this._authService.currentUser$().WorkPlace ?? ''],
      department: ['']
    });
  }
  saveWorkplace() {
    if (this.form.valid) {
      const workPlace: WorkPlace = {
        code: this.form.get('workPlace')?.value,
        id: 0
      };
      this._workplaceService.guardarTrabajo(workPlace).subscribe((data: WorkPlace) => {
      });
    }
  }

  saveDepartment() {
    if (this.form.valid) {
      const department: Departament = {
        code: this.form.get('department')?.value,
        id: 0
      };
      this._departmentService.save(department).subscribe((data: Departament) => {
      });
    }
  }

  onSubmit() {
    this.saveWorkplace();
    this.saveDepartment();
  }
} 