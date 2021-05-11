/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderTimeService } from './order-time.service';

describe('OrderTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderTimeService]
    });
  });

  it('should ...', inject([OrderTimeService], (service: OrderTimeService) => {
    expect(service).toBeTruthy();
  }));
});
