import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Component, ViewChild, effect, inject} from '@angular/core';
import { MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Project } from '../../model/domain/project';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectService } from '../../service/common/Project/project.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../service/user/auth.service';
import { UserDataWrapperService } from '../../service/user/user-data-wrapper.service';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [MatTableModule, MatSortModule,MatPaginatorModule, DatePipe,TitleCasePipe, MatMenuModule],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent {
  private Data!: Project[]; // array de proyectos que se guardara en la tabla this.dataSource

  displayedColumns: string[] = ['name', 'initialDate', 'endDate','type', 'status', 'option']; // columnas que se mostraran en la tabla
  dataSource!: MatTableDataSource<Project>; // fuente de datos de la tabla. Se utiliza para mostrar los datos en la tabla y guardar los proyectos en la tabla

  constructor(private _liveAnnouncer: LiveAnnouncer, private _router: Router,private _auth:AuthService,private _user_dataWrapper:UserDataWrapperService,private _project:ProjectService) {
    effect(()=>{
      this.Data = this._user_dataWrapper.projects$();
      this.dataSource = new MatTableDataSource(this.Data);
    })
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator; // paginador de la tabla. Se utiliza para paginar los resultados de la tabla

  /**
   * inicializa el paginador de la tabla una vez que la vista se ha renderizado completamente
   */
  ngAfterViewInit() {
    setTimeout(()=>{
      this.dataSource.paginator = this.paginator;
    },10);
  }

  /**
   * Hace una llamada al servicio de proyectos para eliminar el proyecto seleccionado de la bbdd.
    Acto seguido, actualiza el array de proyectos del usuario, para reflejar el cambio en la vista.
  * @param project 
   */
  delete(project:Project){
      this._project.delete(project).subscribe((result:boolean)=>{
        if(result){
          //devolvemos el array de projects sin el project eliminado
          this._user_dataWrapper.projects$.set(this._user_dataWrapper.projects$().filter((p:Project)=>p!==project));
        }else{
          console.error('Error al eliminar el proyecto');
        }
      });
  }
  /**
   * Redirecciona a la ruta /projects/project/{id} donde id es el id del proyecto completo. 
   * El usuario podra visualizar el proyecto completo + sus tareas.
   * @param project proyecto seleccionado por el usuario
   */
  show(project:Project){
    this._user_dataWrapper.setCurrentItem(project)
    this._router.navigateByUrl(`projects/project/${project.id_code}`);
  }
}
