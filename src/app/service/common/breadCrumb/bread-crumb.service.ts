import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
            url += `/${routeURL}`;
            }
     
        breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: url });
      
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
      
    }

    return breadcrumbs;
  }
}
