import { TestBed } from '@angular/core/testing';

import { DiagnosisServices } from './diagnoses';

describe('DiagnosisServices', () => {
  let service: DiagnosisServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosisServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
