import { TestBed } from '@angular/core/testing';

import { Workorders } from './workorders';

describe('Workorders', () => {
  let service: Workorders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workorders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
