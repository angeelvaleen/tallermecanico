import { TestBed } from '@angular/core/testing';

import { Fuels } from './fuels';

describe('Fuels', () => {
  let service: Fuels;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fuels);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
