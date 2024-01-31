import { Component } from '@angular/core';
import { ProjectDashboardComponent } from '../../../components/project-dashboard/project-dashboard.component';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [ProjectDashboardComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss'
})
export class ViewAllComponent {

}
