import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Item, ModalDirective } from './directives/modal.directive';
import { SubMenuService } from './services/common/SubMenu/sub-menu.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLinkActive,RouterLink,ModalDirective,MatButtonModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FCT_Atmira';

  generateProjectsItems(): Item[]{
    

    return [
      {
        title: 'FCT_Atmira aaaaaaaaaaaaaaaaa',
        callback: () => {
          alert('FCT_Atmira');
        }
      }
    ]
  }
}

