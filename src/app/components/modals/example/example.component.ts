import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent {
  constructor(public dialogRef: MatDialogRef<ExampleComponent>) {}
}