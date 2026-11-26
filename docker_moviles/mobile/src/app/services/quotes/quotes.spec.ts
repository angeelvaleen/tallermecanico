import { TestBed } from '@angular/core/testing';

import { QuoteServices } from './quotes';

describe('QuoteServices', () => {
  let service: QuoteServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
