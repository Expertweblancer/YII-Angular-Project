/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParcelService } from './parcel.service';

describe('ParcelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParcelService]
    });
  });

  it('should ...', inject([ParcelService], (service: ParcelService) => {
    expect(service).toBeTruthy();
  }));
});
