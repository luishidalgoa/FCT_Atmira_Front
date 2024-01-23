import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import { ExampleComponent } from '../../components/modals/example/example.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule,RouterLinkActive,RouterLink,MatButtonModule, MatMenuModule,
  MatButtonModule],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})
export class HubComponent {
  title = 'FCT_Atmira';

  generateProjectsItems(){
    

    return [
      {
        title: 'FCT_Atmira',
        callback: () => {
          alert('FCT_Atmira');
        }
      }
    ]
  }

  constructor(public dialog: MatDialog){}
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ExampleComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }
}