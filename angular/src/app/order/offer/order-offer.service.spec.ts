/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderOfferService } from './order-offer.service';

describe('OrderOfferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderOfferService]
    });
  });

  it('should ...', inject([OrderOfferService], (service: OrderOfferService) => {
    expect(service).toBeTruthy();
  }));
});
