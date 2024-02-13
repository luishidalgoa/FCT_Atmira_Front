import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Component, ViewChild, effect, inject} from '@angular/core';
import { MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Project } from '../../model/domain/project';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectService } from '../../service/mockup/project.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../service/mockup/auth.service';
import { UserDataWrapperService } from '../../service/user/user-data-wrapper.service';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [MatTableModule, MatSortModule,MatPaginatorModule, DatePipe,TitleCasePipe, MatMenuModule],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent {
  private Data!: Project[];

  displayedColumns: string[] = ['name', 'initialDate', 'endDate','type', 'status', 'option'];
  dataSource!: MatTableDataSource<Project>;

  constructor(private _liveAnnouncer: LiveAnnouncer, private _router: Router,private _auth:AuthService,private _user_dataWrapper:UserDataWrapperService,private _project:ProjectService) {
    effect(()=>{
      this.Data = this._user_dataWrapper.projects$();
      this.dataSource = new MatTableDataSource(this.Data);
    })
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    setTimeout(()=>{
      this.dataSource.paginator = this.paginator;
    },10);
  }

  delete(project:Project){
      this._project.delete(project).subscribe((result:boolean)=>{
        console.log(result)
      });
  }
  /**
   * Redirecciona a la ruta /project/{id} donde id es el id del proyecto completo. 
   * El usuario podra visualizar el proyecto completo + sus tareas.
   * @param project proyecto seleccionado por el usuario
   */
  show(project:Project){
    this._router.navigateByUrl(`projects/${project.id_code}`);
  }
}
