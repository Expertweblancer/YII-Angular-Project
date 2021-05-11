/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FleetService } from './fleet.service';

describe('FleetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetService]
    });
  });

  it('should ...', inject([FleetService], (service: FleetService) => {
    expect(service).toBeTruthy();
  }));
});
