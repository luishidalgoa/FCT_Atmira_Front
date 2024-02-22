import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../service/common/breadCrumb/bread-crumb.service';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit{
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private breadcrumbService: BreadCrumbService,private router:Router) {}
  /**
   * unicamente estamos obteniendo el historial de navegacion de la aplicacion
   * posteriormente nos suscribimos a los eventos de navegacion para actualizar el historial de navegacion
   * extrallendo el array de rutas que se encuentran en el servicio de BreadCrumbService e igualandolo a la variable breadcrumbs
   * que posteriormente se renderizara en el html
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.breadcrumbs;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = this.breadcrumbService.breadcrumbs;
      }
    });
  }
}
