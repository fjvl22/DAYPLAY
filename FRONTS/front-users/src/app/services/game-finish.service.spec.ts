import { TestBed } from '@angular/core/testing';

import { GameFinishService } from './game-finish.service';

describe('GameFinishService', () => {
  let service: GameFinishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameFinishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
