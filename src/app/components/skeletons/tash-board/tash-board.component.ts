import { Component } from '@angular/core';
import { LoaderSpinnerComponent } from '../loader-spinner/loader-spinner.component';

@Component({
  selector: 'app-tash-board-skeleton',
  standalone: true,
  imports: [LoaderSpinnerComponent],
  templateUrl: './tash-board.component.html',
  styleUrl: './tash-board.component.scss'
})
export class TashBoardComponentSkeleton {

}
