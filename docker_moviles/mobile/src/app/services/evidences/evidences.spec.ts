import { TestBed } from '@angular/core/testing';

import { Evidences } from './evidences';

describe('Evidences', () => {
  let service: Evidences;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Evidences);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
