import { TestBed } from '@angular/core/testing';

import { Quoteparts } from './quoteparts';

describe('Quoteparts', () => {
  let service: Quoteparts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Quoteparts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
