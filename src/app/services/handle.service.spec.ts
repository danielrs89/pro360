import { TestBed } from '@angular/core/testing';

import { HandleService } from './handle.service';

describe('HandleService', () => {
  let service: HandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
