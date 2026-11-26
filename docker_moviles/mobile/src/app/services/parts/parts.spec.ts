import { TestBed } from '@angular/core/testing';

import { PartServices } from './parts';

describe('PartServices', () => {
  let service: PartServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
