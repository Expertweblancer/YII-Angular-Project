import { TestBed, inject } from '@angular/core/testing';

import { LandingOrder.CreateService } from './landing-order.create.service';

describe('LandingOrder.CreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingOrder.CreateService]
    });
  });

  it('should be created', inject([LandingOrder.CreateService], (service: LandingOrder.CreateService) => {
    expect(service).toBeTruthy();
  }));
});
