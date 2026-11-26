import { TestBed } from '@angular/core/testing';

import { AppointmentServices } from './appointments';

describe('AppointmentServices', () => {
  let service: AppointmentServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
