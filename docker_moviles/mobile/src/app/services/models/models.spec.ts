import { TestBed } from '@angular/core/testing';

import { ModelServices } from './models';

describe('ModelServices', () => {
  let service: ModelServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
