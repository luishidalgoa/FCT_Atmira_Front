import { Component, Input } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { Task } from '../../model/domain/task';
import { Project } from '../../model/domain/project';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  @Input() project?: Project;

}
