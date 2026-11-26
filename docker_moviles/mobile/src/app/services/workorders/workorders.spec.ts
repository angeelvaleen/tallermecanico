import { TestBed } from '@angular/core/testing';

import { WorkorderServices } from './workorders';

describe('WorkorderServices', () => {
  let service: WorkorderServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkorderServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
