import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../../../model/domain/project';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../../user/auth.service';
import { Colaborator } from '../../../model/domain/colaborator';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private _http: HttpClient,private _auth:AuthService) { }

  /**
   * metodo que se encarga de guardar un proyecto en la base de datos
   * @param project objeto completo del proyecto
   * @param ID_Alias id del usuario que va ha crear el proyecto 
   * @returns 
   */
  save(project: Project,ID_Alias:string): Observable<Project> {
      const header = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }).set('Authorization', `Bearer ${this._auth.authorization$().token}`)
      };
      
      const url: string = `${environment.apiUrl}/project/save/colaboratorId/${ID_Alias}`;
      return this._http.post<Project>(url, project, header);
  }
  /**
   * metodo que se encarga de obtener los proyectos de un usuario en base atraves del ID_Alias
   * @param ID_Alias nombre de usuario del que se quieren obtener los proyectos
   * @param limit limite de proyectos que se quieren obtener
   * @returns retorna un array de proyectos del usuario extraidos de la base de datos
   */
  getUserProjects(ID_Alias: string, limit?: number): Observable<Project[]> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/colaborator/${ID_Alias}/projects`;
    return this._http.get<Project[]>(url, header);
  }

  /**
   * metodo que se encarga de eliminar un proyecto de la base de datos
   * @param project objeto completo del proyecto del que extraeremos el id para eliminarlo
   * @returns retorna true si el proyecto ha sido eliminado correctamente, false en caso contrario
   */
  delete(project: Project): Observable<boolean> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }).set('Authorization', `Bearer ${this._auth.authorization$().token}`)
    };
    const url: string = `${environment.apiUrl}/project/delete/${project.id_code}`;
 
    return this._http.delete<boolean>(url, header);
  }
  /**
   * metodo que se encarga de obtener un proyecto en base a su id
   * @param id id del proyecto que se quiere obtener
   * @returns retorna un objeto completo del proyecto
   */
  getById(id: number): Observable<Project> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/project/list/${id}`;
    return this._http.get<Project>(url, header);
  }
  /**
   * retornara una coleccion de Colaboradores asociados a un proyecto
   * @param id id del proyecto
   * @returns lista de colaboradores
   */
  getColaboratos(id:string):Observable<Colaborator[]>{
    const url : string =`${environment.apiUrl}/project/${id}/colaborators`
    return this._http.get<Colaborator[]>(url)
  }

  /**
   * actualiza un proyecto
   */
  updateProject(project:Project,id:string):Observable<Project>{
    const url : string =`${environment.apiUrl}/projects/${id}`
    return this._http.put<Project>(url,project)
  }

}
