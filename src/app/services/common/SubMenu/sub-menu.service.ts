import { Injectable, WritableSignal, signal } from '@angular/core';
import { Item } from '../../../directives/modal.directive';

@Injectable({
  providedIn: 'root'
})
export class SubMenuService {
  contextMenu$: WritableSignal<{
    style?: string;
    items: Item[];
  }> = signal({ items: [] });
  event!: MouseEvent;

  constructor() { }

  async openDialog(items: Item[],event: MouseEvent): Promise<void> {
    this.contextMenu$.set(
       {
         style: this.calculatePosition(event),
         items: items,
       }
    )
   }

   close(): void {
      this.contextMenu$.set({ items: [] });
    }

   calculatePosition(event: any): string {
    let x = event.clientX;
    let y = event.clientY;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let menuWidth = 250;
    let menuHeight = 250;
    let xPosition = x + menuWidth > width ? x - menuWidth : x;
    let yPosition = y + menuHeight > height ? y - menuHeight : y;
    return `left:${xPosition}px;top:${yPosition}px;`;
  }
}
