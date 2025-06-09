import { TestBed } from '@angular/core/testing';

import { ProsService } from './pros.service';

describe('ProsService', () => {
  let service: ProsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
