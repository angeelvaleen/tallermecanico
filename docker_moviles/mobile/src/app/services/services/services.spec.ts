import { TestBed } from '@angular/core/testing';

import { ServiceServices } from './services';

describe('ServiceServices', () => {
  let service: ServiceServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
