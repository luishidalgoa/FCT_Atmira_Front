import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { TypeOfService } from '../../../model/enum/type-of-service';


@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  typeOfServiceValues = Object.values(TypeOfService);
  constructor(public dialogRef: MatDialogRef<ConfigurationComponent>) {}
}