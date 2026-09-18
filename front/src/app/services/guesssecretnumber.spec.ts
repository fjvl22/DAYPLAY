import { TestBed } from '@angular/core/testing';

import { Guesssecretnumber } from './guesssecretnumber';

describe('Guesssecretnumber', () => {
  let service: Guesssecretnumber;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Guesssecretnumber);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
