import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';
import { SubMenuService } from '../services/common/SubMenu/sub-menu.service';

export interface directive {
  items: Item[],
  control?: 'right' | 'left'
}

export interface Item {
  svg?: { icon: string, style?: string | undefined }[];
  title?: string;
  callback?: () => void;
}

@Directive({
  selector: '[appModal]',
  standalone: true
})
export class ModalDirective {
  @Input() modalParams: directive = {items: [],control: 'right'};
  private subMenu: SubMenuService = inject(SubMenuService);
  private el: ElementRef = inject(ElementRef); 
  private renderer: Renderer2= inject(Renderer2);

  constructor() { }

  @HostListener('click', ['$event'])
  create(event: MouseEvent) {
    this.subMenu.openDialog(this.modalParams.items,event).then(()=>{
      document.addEventListener('click', this.handleContextMenu.bind(this), true);
      document.addEventListener('contextmenu', this.handleContextMenu.bind(this), true);
    });
    event.preventDefault();

  }

  handleContextMenu(event: Event): void {
    // Verifica si el clic derecho provino del menú contextual
    const menuElement = document.getElementById('contextMenu');
    if(this.el.nativeElement.contains(event.target) || (menuElement && menuElement.contains(event.target as Node))){
      return;
    }else{
      this.subMenu.close();
    }
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
