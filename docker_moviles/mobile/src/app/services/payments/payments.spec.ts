import { TestBed } from '@angular/core/testing';

import { PaymentServices } from './payments';

describe('PaymentServices', () => {
  let service: PaymentServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
