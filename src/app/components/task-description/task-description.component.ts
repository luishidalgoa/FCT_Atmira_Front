import { Component } from '@angular/core';

@Component({
  selector: 'app-task-description',
  standalone: true,
  imports: [],
  templateUrl: './task-description.component.html',
  styleUrl: './task-description.component.scss'
})
export class TaskDescriptionComponent {
  constructor() { }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    // Aquí puedes hacer lo que quieras con el archivo seleccionado, como subirlo a un servidor.
    console.log('Archivo seleccionado:', file);
  }
}
