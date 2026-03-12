import { TestBed } from '@angular/core/testing';

import { MathRushService } from './math-rush.service';

describe('MathRushService', () => {
  let service: MathRushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathRushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
