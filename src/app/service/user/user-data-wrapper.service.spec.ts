import { TestBed } from '@angular/core/testing';

import { UserDataWrapperService } from './user-data-wrapper.service';

describe('UserDataWrapperService', () => {
  let service: UserDataWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
