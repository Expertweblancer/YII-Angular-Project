/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChooseOfferService } from './choose-offer.service';

describe('ChooseOfferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChooseOfferService]
    });
  });

  it('should ...', inject([ChooseOfferService], (service: ChooseOfferService) => {
    expect(service).toBeTruthy();
  }));
});
