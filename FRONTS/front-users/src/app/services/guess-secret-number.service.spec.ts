import { TestBed } from '@angular/core/testing';

import { GuessSecretNumberService } from './guess-secret-number.service';

describe('GuessSecretNumberService', () => {
  let service: GuessSecretNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuessSecretNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
