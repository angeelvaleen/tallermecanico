import { TestBed } from '@angular/core/testing';

import { EvidenceServices } from './evidences';

describe('EvidenceServices', () => {
  let service: EvidenceServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvidenceServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
