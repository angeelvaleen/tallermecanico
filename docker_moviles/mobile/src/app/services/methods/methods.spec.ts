import { TestBed } from '@angular/core/testing';

import { MethodServices } from './methods';

describe('MethodServices', () => {
  let service: MethodServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MethodServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
