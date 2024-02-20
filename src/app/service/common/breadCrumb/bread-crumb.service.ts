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
          this._task.getById(uri).subscribe((data)=>{
            breadcrumbs.push({ label: data.description, url: '/'+url });
          });
        }else{
          breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: '/'+url });
        }
      
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
      
    }

    return breadcrumbs;
  }
}
