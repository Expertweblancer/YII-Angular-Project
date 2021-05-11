/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FleetTypeService } from './fleet-type.service';

describe('FleetTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetTypeService]
    });
  });

  it('should ...', inject([FleetTypeService], (service: FleetTypeService) => {
    expect(service).toBeTruthy();
  }));
});
