/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaymentTypesService } from './payment-types.service';

describe('PaymentTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentTypesService]
    });
  });

  it('should ...', inject([PaymentTypesService], (service: PaymentTypesService) => {
    expect(service).toBeTruthy();
  }));
});
