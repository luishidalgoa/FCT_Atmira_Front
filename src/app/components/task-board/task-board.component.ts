import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TypeOfService } from '../../model/enum/type-of-service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent {
  @Input({ required: true })
  value!: { title: string }
  tasks: any[] = [];
  details: boolean = false;
  newT: boolean = false;

  formGroup: FormGroup;

  typeOfServiceValues = Object.values(TypeOfService);

  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder) {
      this.value = { title: 'Tarea 1' };




      this.formGroup = this._formBuilder.group({
        title: new FormControl(''),
        typeOfService: new FormControl('')
      });
   }

  @ViewChildren('input') input!: QueryList<ElementRef>;

  /**
   * Verificaremos en cada ngAfterViewInit si se ha renderizado el Input para crear una nueva tarea en el componente.
   * Si esta renderizado entonces se hara automaticamente el focus en el Input
   */
  ngAfterViewInit() {
    this.input.changes.subscribe((changes) => {
      if (this.input.length > 0) {
        //this.input.first.nativeElement.focus();
      }
    });
  }


  newTask(): void {
    alert("new task");
  }
  @ViewChild('form') form!: ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (!this.form) return;

    if (!this.form.nativeElement.contains(event.target)) {
      this.newT = false;
    }
  }
  
}
