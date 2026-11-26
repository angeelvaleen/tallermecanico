import { TestBed } from '@angular/core/testing';

import { VehicleServices } from './vehicles';

describe('VehicleServices', () => {
  let service: VehicleServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
