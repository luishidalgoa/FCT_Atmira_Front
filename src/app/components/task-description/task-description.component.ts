import { Component, Input, ViewChild, viewChild } from '@angular/core';
import { Task } from '../../model/domain/task';

@Component({
  selector: 'app-task-description',
  standalone: true,
  imports: [],
  templateUrl: './task-description.component.html',
  styleUrl: './task-description.component.scss'
})
export class TaskDescriptionComponent {
  @Input({ required: true }) 
  value!: Task;
  edit:boolean = false;
  constructor() { }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    // Aquí puedes hacer lo que quieras con el archivo seleccionado, como subirlo a un servidor.
    console.log('Archivo seleccionado:', file);
  }

  textSize!: number;

  write(){
    this.edit = !this.edit
    this.textSize = 256 - this.value.description.length
  }
  @ViewChild('textarea') textarea!: any
  writing(event: any){
    this.textSize = 256 - event.target.value.length
  }
}
