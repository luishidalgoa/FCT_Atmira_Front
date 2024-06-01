import { TestBed } from '@angular/core/testing';

import { ObjetiveService } from './objetive.service';

describe('ObjetiveService', () => {
  let service: ObjetiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
