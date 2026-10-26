import { TestBed } from '@angular/core/testing';

import { Diagnoses } from './diagnoses';

describe('Diagnoses', () => {
  let service: Diagnoses;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Diagnoses);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
