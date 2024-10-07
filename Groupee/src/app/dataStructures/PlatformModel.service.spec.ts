import { TestBed } from '@angular/core/testing';

import { PlatformModelService } from './PlatformModel.service';

describe('HostStructureService', () => {
  let service: PlatformModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
