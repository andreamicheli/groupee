import { TestBed } from '@angular/core/testing';

import { RandomHandService } from './random-hand.service';

describe('RandomHandService', () => {
  let service: RandomHandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomHandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
