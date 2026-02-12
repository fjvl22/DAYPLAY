import { TestBed } from '@angular/core/testing';

import { GuesssecretnumberService } from './guesssecretnumber.service';

describe('GuesssecretnumberService', () => {
  let service: GuesssecretnumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuesssecretnumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
