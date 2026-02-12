import { TestBed } from '@angular/core/testing';

import { MathrushService } from './mathrush.service';

describe('MathrushService', () => {
  let service: MathrushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathrushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
