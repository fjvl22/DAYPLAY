import { TestBed } from '@angular/core/testing';

import { Mathrush } from './mathrush';

describe('Mathrush', () => {
  let service: Mathrush;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mathrush);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
