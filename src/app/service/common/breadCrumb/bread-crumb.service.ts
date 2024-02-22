import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TaskService } from '../Task/task.service';
import { ProjectService } from '../Project/project.service';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {

  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }


  _task:TaskService = inject(TaskService);
  _project:ProjectService = inject(ProjectService);
  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string, url: string }> = []): Array<{ label: string, url: string }> {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if(child.snapshot.data['breadcrumb'] != undefined){

        if(child.snapshot.data['parent']){
          const routeURL: string = child.snapshot.data['parent']['url'];
          if (routeURL !== '') {
            url += `${routeURL}`;
          }
    
          breadcrumbs.push({ label: child.snapshot.data['parent']['breadcrumb'], url: url })
        }
        url='';  
        const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
        if (routeURL !== '') {
          url += `${routeURL}`;
        }
        //Debemos identificar si se trata de un proyecto o una tarea, o por si por el contrario ninguna de las dos
        if(!url.includes('_') && url.includes('/')){
          const uri: string = url.split('/').pop() as string;
          this._project.getById(uri as unknown as number).subscribe((data)=>{
            breadcrumbs.push({ label: data.name, url: '/'+url });
          });
        }else if(url.includes('_')){
          const uri: string = url.split('/').pop() as string;
          {
            const project_id = uri.split('_')[0];
            this._project.getById(project_id as unknown as number).subscribe((data)=>{
              breadcrumbs.push({ label: data.name, url: '/projects/project/'+project_id });
            }).add(()=>{
              //extraemos todos los digitos que estan entre _ excepto el primero segmentandolos uno a uno mediante un bucle for
              const project_id = uri.split('_')[0];
              for(let i = 1; i < uri.split('_').length; i++){
                //en el hipotetico caso de tener 0_1_1 nos interesaria que en la primera iteracion extraigamos 0_1 y en la segunda 0_1_1. y guardarlo dentro de task_id
                const task_id = uri.split('_').slice(0, i+1).join('_');
                this._task.getById(task_id).subscribe((data)=>{
                  breadcrumbs.push({ label: data.description, url: '/projects/project/'+project_id+'/task/'+task_id });
                });
              }
            });
          }
        }else{
          breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: '/'+url });
        }
      
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
      
    }

    return breadcrumbs;
  }
}
