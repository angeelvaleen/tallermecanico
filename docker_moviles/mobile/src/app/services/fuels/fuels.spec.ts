import { TestBed } from '@angular/core/testing';

import { FuelServices } from './fuels';

describe('FuelServices', () => {
  let service: FuelServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
