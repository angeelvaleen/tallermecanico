import { TestBed } from '@angular/core/testing';

import { QuotepartServices } from './quoteparts';

describe('QuotepartServices', () => {
  let service: QuotepartServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotepartServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
