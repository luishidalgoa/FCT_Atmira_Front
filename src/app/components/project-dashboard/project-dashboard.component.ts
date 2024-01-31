import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild, inject} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Project } from '../../model/domain/project';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectService } from '../../service/common/Project/project.service';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [MatTableModule, MatSortModule,MatPaginatorModule, DatePipe,TitleCasePipe],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent {
  private _project:ProjectService = inject(ProjectService);
  private Data!: Project[];

  displayedColumns: string[] = ['name', 'initialDate', 'endDate','type', 'status'];
  dataSource!: MatTableDataSource<Project>;

  constructor(private _liveAnnouncer: LiveAnnouncer) {
    this.Data = [{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    },{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    },{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    },{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    },{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    },{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    },{
      active: true,
      initialDate: new Date(),
      endDate: new Date(),
      name: 'FCT_Atmira',
      typeOfService: 'Desarrollo',
    }];
    this.dataSource = new MatTableDataSource(this.Data);
    /*this._project.getAllProjects('luis').subscribe((data:Project[])=>{
      this.Data.push(...data);
      
    });*/
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
