import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Project } from '../../../model/domain/project';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectService } from '../../services/Project/project.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../Login/services/auth.service';
import { CurrentProjectService } from '../../../shared/services/current-project.service';

@Component({
  selector: 'core-project-dashboard',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TitleCasePipe, MatMenuModule],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent implements OnInit {
  private Data!: Project[]; // array de proyectos que se guardara en la tabla this.dataSource

  displayedColumns: string[] = ['name', 'initialDate', 'endDate', 'type', 'status', 'option']; // columnas que se mostraran en la tabla
  dataSource!: MatTableDataSource<Project>; // fuente de datos de la tabla. Se utiliza para mostrar los datos en la tabla y guardar los proyectos en la tabla

  constructor(private _liveAnnouncer: LiveAnnouncer, private _router: Router, private _auth: AuthService, private _currentProject: CurrentProjectService, private _project: ProjectService) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator; // paginador de la tabla. Se utiliza para paginar los resultados de la tabla

  /**
   * inicializa el paginador de la tabla una vez que la vista se ha renderizado completamente
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 100);
  }

  ngOnInit(): void {
    this._currentProject.repository.subscribe(() => {
      if (!this._currentProject.repositoryValue) return
      this.Data = this._currentProject.repositoryValue;
      this.dataSource = new MatTableDataSource(this.Data);
    })
  }

  /**
   * Hace una llamada al servicio de proyectos para eliminar el proyecto seleccionado de la bbdd.
    Acto seguido, actualiza el array de proyectos del usuario, para reflejar el cambio en la vista.
  * @param project 
   */
  delete(project: Project) {
    this._currentProject.deleteProject(project).subscribe((result: boolean) => {
      if (!result) console.error('Error al eliminar el proyecto');
    });
  }
  /**
   * Redirecciona a la ruta /projects/project/{id} donde id es el id del proyecto completo. 
   * El usuario podra visualizar el proyecto completo + sus tareas.
   * @param project proyecto seleccionado por el usuario
   */
  show(project: Project) {
    this._currentProject.navigateProject(project);
  }
}
