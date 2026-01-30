import { TestBed } from '@angular/core/testing';

import { Secretnumber } from './secretnumber';

describe('Secretnumber', () => {
  let service: Secretnumber;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Secretnumber);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
