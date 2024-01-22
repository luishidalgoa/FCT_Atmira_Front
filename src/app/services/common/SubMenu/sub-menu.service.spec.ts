import { TestBed } from '@angular/core/testing';

import { SubMenuService } from './sub-menu.service';

describe('SubMenuService', () => {
  let service: SubMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
