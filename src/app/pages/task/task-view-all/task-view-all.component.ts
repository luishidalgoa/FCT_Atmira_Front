import { Component } from '@angular/core';
import { TaskDescriptionComponent } from '../../../components/task-description/task-description.component';

@Component({
  selector: 'app-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {

}
